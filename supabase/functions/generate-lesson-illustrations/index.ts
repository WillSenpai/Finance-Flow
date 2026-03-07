import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { imageGeneration } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";

function parseStepTitles(markdown: string): { title: string; description: string }[] {
  const sections = markdown.split(/(?=^###\s)/m).filter((s) => s.trim());
  return sections.map((section) => {
    const match = section.match(/^###\s+(.+)/);
    const title = match ? match[1].trim() : "Sezione";
    const content = match ? section.replace(/^###\s+.+\n?/, "").trim() : section.trim();
    const firstSentence = content.split(/[.!?]\s/)[0];
    return { title, description: firstSentence ? firstSentence.slice(0, 120) : "" };
  });
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const body = await req.json();
    const { lessonId, steps: providedSteps, batch, mode, force = false } = body;

    const AI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (mode === "card") {
      if (!supabaseAnonKey) {
        return new Response(JSON.stringify({ error: "SUPABASE_ANON_KEY missing" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Authorization required" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const {
        data: { user },
        error: userError,
      } = await authedClient.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .limit(1);
      if (rolesError) {
        return new Response(JSON.stringify({ error: rolesError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!roles || roles.length === 0) {
        return new Response(JSON.stringify({ error: "Admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const lessonQuery = supabase
        .from("academy_lessons_cache")
        .select("id, lesson_id, titolo, content, card_image_url");

      const { data: lessons, error: lessonsError } = batch
        ? await lessonQuery.order("lesson_id", { ascending: true })
        : await lessonQuery.eq("lesson_id", lessonId).limit(1);

      if (lessonsError) {
        return new Response(JSON.stringify({ error: lessonsError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!lessons || lessons.length === 0) {
        return new Response(JSON.stringify({ error: "No lessons found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const results: Array<{ lessonId: string; status: "generated" | "skipped" | "failed"; imageUrl?: string; error?: string }> = [];
      for (const row of lessons as any[]) {
        if (!force && row.card_image_url) {
          results.push({ lessonId: row.lesson_id, status: "skipped", imageUrl: row.card_image_url });
          continue;
        }
        try {
          const imageUrl = await generateAndUploadCard(
            supabase,
            AI_API_KEY,
            row.id,
            row.lesson_id,
            row.titolo || `Lezione ${row.lesson_id}`,
            row.content || "",
          );
          if (!imageUrl) {
            results.push({ lessonId: row.lesson_id, status: "failed", error: "No image generated" });
          } else {
            results.push({ lessonId: row.lesson_id, status: "generated", imageUrl });
          }
        } catch (error) {
          results.push({
            lessonId: row.lesson_id,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Batch mode: generate for all lessons
    if (batch) {
      const { data: allLessons } = await supabase
        .from("academy_lessons_cache")
        .select("lesson_id, content")
        .order("lesson_id");

      if (!allLessons?.length) {
        return new Response(JSON.stringify({ error: "No lessons found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const results: Record<string, { generated: number; skipped: boolean }> = {};

      for (const lesson of allLessons) {
        // Check if already exists
        const { data: existing } = await supabase
          .from("lesson_illustrations")
          .select("id")
          .eq("lesson_id", lesson.lesson_id)
          .limit(1);

        if (existing && existing.length > 0) {
          results[lesson.lesson_id] = { generated: 0, skipped: true };
          continue;
        }

        const steps = parseStepTitles(lesson.content);
        let generated = 0;

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          try {
            const imageUrl = await generateAndUpload(
              supabase, AI_API_KEY, lesson.lesson_id, i, step
            );
            if (imageUrl) generated++;
          } catch (e) {
            console.error(`Error generating lesson ${lesson.lesson_id} step ${i}:`, e);
          }
        }

        results[lesson.lesson_id] = { generated, skipped: false };
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Single lesson mode
    if (!lessonId) {
      return new Response(JSON.stringify({ error: "lessonId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get steps from provided data or from DB
    let steps = providedSteps;
    if (!steps?.length) {
      const { data: lessonData } = await supabase
        .from("academy_lessons_cache")
        .select("content")
        .eq("lesson_id", lessonId)
        .maybeSingle();
      if (lessonData?.content) {
        steps = parseStepTitles(lessonData.content);
      }
    }

    if (!steps?.length) {
      return new Response(JSON.stringify({ error: "No steps found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check which steps already exist
    const { data: existing } = await supabase
      .from("lesson_illustrations")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("step_index");

    const existingSteps = new Set((existing || []).map((e: any) => e.step_index));

    // If all steps exist, return cached
    if (existingSteps.size >= steps.length) {
      return new Response(JSON.stringify({ illustrations: existing, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const illustrations = [...(existing || [])];

    // Only generate missing steps
    for (let i = 0; i < steps.length; i++) {
      if (existingSteps.has(i)) continue;
      try {
        const imageUrl = await generateAndUpload(
          supabase, AI_API_KEY, lessonId, i, steps[i]
        );
        if (imageUrl) {
          illustrations.push({
            lesson_id: lessonId,
            step_index: i,
            title: steps[i].title,
            description: steps[i].description || "",
            image_url: imageUrl,
          });
        }
      } catch (e) {
        console.error(`Error processing step ${i}:`, e);
      }
    }

    return new Response(JSON.stringify({ illustrations, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateAndUpload(
  supabase: any,
  apiKey: string,
  lessonId: string,
  stepIndex: number,
  step: { title: string; description: string }
): Promise<string | null> {
  const prompt = `Create a cute, colorful flat illustration for a financial education lesson. The topic is: "${step.title}". Context: ${step.description}. Style: modern flat design, vibrant colors, friendly characters, no text in the image, clean white background. The illustration should be simple, educational, and appealing to young adults learning about personal finance.`;

  let uploadPayload: UploadPayload | null = null;

  const modelCandidates = getImageModelCandidates();
  let lastStatus = 0;
  for (const model of modelCandidates) {
    const imageResp = await imageGeneration({
      apiKey,
      model,
      prompt,
      size: "1024x1024",
    });

    if (!imageResp.ok) {
      lastStatus = imageResp.status;
      const errText = await imageResp.text();
      console.error(`Image generation failed for step ${stepIndex} with model ${model}:`, errText);
      if (imageResp.status === 429) {
        await new Promise(r => setTimeout(r, 5000));
      }
      continue;
    }

    const imageDataPayload = await imageResp.json();
    const imageData = extractImageDataUrl(imageDataPayload);
    if (!imageData) {
      console.error(`No image returned for step ${stepIndex} with model ${model}`);
      continue;
    }
    uploadPayload = await normalizeImagePayload(imageData, stepIndex);
    if (uploadPayload) break;
  }

  if (!uploadPayload && lastStatus === 429) {
    return generateAndUpload(supabase, apiKey, lessonId, stepIndex, step);
  }
  if (!uploadPayload) return null;

  const filePath = `lesson-${lessonId}/step-${stepIndex}.${uploadPayload.fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("lesson-illustrations")
    .upload(filePath, uploadPayload.binaryData, {
      contentType: uploadPayload.contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error(`Upload failed for step ${stepIndex}:`, uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("lesson-illustrations")
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase
    .from("lesson_illustrations")
    .insert({
      lesson_id: lessonId,
      step_index: stepIndex,
      title: step.title,
      description: step.description || "",
      image_url: imageUrl,
    });

  if (insertError) {
    console.error(`DB insert failed for step ${stepIndex}:`, insertError);
    return null;
  }

  return imageUrl;
}

async function generateAndUploadCard(
  supabase: any,
  apiKey: string,
  lessonRowId: string,
  lessonId: string,
  lessonTitle: string,
  lessonContent: string,
): Promise<string | null> {
  const prompt = buildCardPrompt(lessonTitle, lessonContent);

  const modelCandidates = [
    "gemini-3-pro-image-preview",
    ...getImageModelCandidates(),
  ];
  let uploadPayload: UploadPayload | null = null;

  for (const model of modelCandidates) {
    const imageResp = await imageGeneration({
      apiKey,
      model,
      prompt,
      size: "1024x1024",
    });
    if (!imageResp.ok) {
      const errText = await imageResp.text();
      console.error(`Card generation failed for lesson ${lessonId} with model ${model}:`, errText);
      continue;
    }

    const imageDataPayload = await imageResp.json();
    const imageData = extractImageDataUrl(imageDataPayload);
    if (!imageData) continue;
    uploadPayload = await normalizeImagePayload(imageData, Number(lessonId) || 0);
    if (uploadPayload) break;
  }

  if (!uploadPayload) return null;

  const filePath = `cards/lesson-${lessonId}-${Date.now()}.${uploadPayload.fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("lesson-illustrations")
    .upload(filePath, uploadPayload.binaryData, {
      contentType: uploadPayload.contentType,
      upsert: true,
    });
  if (uploadError) {
    console.error(`Card upload failed for lesson ${lessonId}:`, uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("lesson-illustrations")
    .getPublicUrl(filePath);
  const imageUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from("academy_lessons_cache")
    .update({
      card_image_url: imageUrl,
      card_image_prompt: prompt,
      card_image_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", lessonRowId);

  if (updateError) {
    console.error(`Card DB update failed for lesson ${lessonId}:`, updateError);
    return null;
  }

  return imageUrl;
}

async function normalizeImagePayload(
  imageData: string,
  stepIndex: number,
): Promise<UploadPayload | null> {
  const base64Match = imageData.match(/^data:image\/(png|jpeg|webp);base64,(.+)$/);
  if (base64Match) {
    const mimeType = base64Match[1] as "png" | "jpeg" | "webp";
    const base64Data = base64Match[2];
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    return {
      binaryData,
      fileExt: mimeType === "jpeg" ? "jpg" : mimeType,
      contentType: `image/${mimeType}`,
    };
  }

  if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
    try {
      const resp = await fetch(imageData);
      if (!resp.ok) {
        console.error(`Could not fetch remote image for step ${stepIndex}: ${resp.status}`);
        return null;
      }

      const contentType = resp.headers.get("content-type") ?? "image/png";
      const mimeType = contentType.includes("webp")
        ? "webp"
        : contentType.includes("jpeg") || contentType.includes("jpg")
        ? "jpeg"
        : "png";

      const arrayBuffer = await resp.arrayBuffer();
      return {
        binaryData: new Uint8Array(arrayBuffer),
        fileExt: mimeType === "jpeg" ? "jpg" : mimeType,
        contentType: `image/${mimeType}`,
      };
    } catch (e) {
      console.error(`Error fetching remote image for step ${stepIndex}:`, e);
      return null;
    }
  }

  console.error(`Unsupported image format for step ${stepIndex}`);
  return null;
}

function getImageModelCandidates(): string[] {
  const configured = Deno.env.get("AI_ILLUSTRATION_MODEL");
  const candidates = [
    configured,
    "gemini-3-pro-image-preview",
    "google/imagen-3.0-generate-002",
    "google/gemini-2.0-flash-preview-image-generation",
  ].filter((v): v is string => !!v && v.trim().length > 0);
  return [...new Set(candidates)];
}

type UploadPayload = {
  binaryData: Uint8Array;
  fileExt: "png" | "jpg" | "webp";
  contentType: "image/png" | "image/jpeg" | "image/webp";
};

function extractImageDataUrl(aiData: any): string | null {
  // Native Gemini generateContent format
  const parts = aiData?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      const inlineData = part?.inlineData;
      if (typeof inlineData?.data === "string" && inlineData.data.length > 0) {
        const mime = typeof inlineData?.mimeType === "string" && inlineData.mimeType.startsWith("image/")
          ? inlineData.mimeType
          : "image/png";
        return `data:${mime};base64,${inlineData.data}`;
      }
    }
  }

  // OpenAI images.generate format
  const imageData = aiData?.data?.[0];
  if (typeof imageData?.b64_json === "string" && imageData.b64_json.length > 0) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }
  if (typeof imageData?.url === "string" && imageData.url.length > 0) {
    return imageData.url;
  }

  // Some providers return images in message.images[].
  const fromImages =
    aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (typeof fromImages === "string" && fromImages.length > 0) {
    return fromImages;
  }

  // OpenAI-compatible responses often return content as an array of parts.
  const content = aiData?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      const maybeBase64 =
        part?.image_base64 ??
        part?.b64_json ??
        part?.image?.b64_json;
      if (typeof maybeBase64 === "string" && maybeBase64.length > 0) {
        return `data:image/png;base64,${maybeBase64}`;
      }
      if (part?.type === "image_url" || part?.type === "output_image") {
        const maybeUrl =
          typeof part?.image_url === "string"
            ? part.image_url
            : part?.image_url?.url;
        if (typeof maybeUrl === "string" && maybeUrl.length > 0) {
          return maybeUrl;
        }
      }
    }
  }

  // Rare fallback: direct data URL in string content.
  if (typeof content === "string" && content.startsWith("data:image/")) {
    return content;
  }

  return null;
}

function buildCardPrompt(title: string, content: string): string {
  const excerpt = content
    .replace(/[#*_`>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
  return [
    "Create an editorial illustration for a mobile learning card about personal finance.",
    `Lesson title: ${title}.`,
    excerpt ? `Lesson context: ${excerpt}.` : "",
    "Style constraints: flat modern illustration, coherent color palette, no text, no numbers, no logos.",
    "Composition constraints: top-focused scene that works when cropped to the top 35% of a vertical card.",
    "Audience: young adults learning money basics in Italy.",
  ]
    .filter(Boolean)
    .join(" ");
}
