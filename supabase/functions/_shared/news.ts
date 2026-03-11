import { imageGeneration } from "./ai.ts";

export async function generateNewsIllustration(
  apiKey: string,
  titolo: string,
): Promise<string | null> {
  const modelCandidates = getNewsImageModelCandidates();
  for (const model of modelCandidates) {
    try {
      const imageResponse = await imageGeneration({
        apiKey,
        model,
        prompt:
          `Create a professional, modern illustration for a financial news article titled "${titolo}". ` +
          "Style: editorial, clean composition, blue and green palette, no text in the image, suitable as a mobile article thumbnail.",
        size: "1024x1024",
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error(`News image generation failed with model ${model}:`, imageResponse.status, errorText);
        continue;
      }

      const imageData = await imageResponse.json();
      const imageUrl = extractImageDataUrl(imageData);
      if (imageUrl) return imageUrl;

      console.error(`News image generation returned no supported image payload for model ${model}`);
    } catch (error) {
      console.error(`News image generation failed (non-blocking) for model ${model}:`, error);
    }
  }

  return null;
}

function getNewsImageModelCandidates(): string[] {
  const configured = Deno.env.get("AI_IMAGE_MODEL");
  return [
    configured,
    "gemini-3-pro-image-preview",
    "google/imagen-3.0-generate-002",
    "google/gemini-2.0-flash-preview-image-generation",
  ].filter((value, index, array): value is string => Boolean(value && value.trim()) && array.indexOf(value) === index);
}

function extractImageDataUrl(aiData: any): string | null {
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

  const imageData = aiData?.data?.[0];
  if (typeof imageData?.b64_json === "string" && imageData.b64_json.length > 0) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }
  if (typeof imageData?.url === "string" && imageData.url.length > 0) {
    return imageData.url;
  }

  const fromImages = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (typeof fromImages === "string" && fromImages.length > 0) {
    return fromImages;
  }

  const content = aiData?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      const maybeBase64 = part?.image_base64 ?? part?.b64_json ?? part?.image?.b64_json;
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

  if (typeof content === "string" && content.startsWith("data:image/")) {
    return content;
  }

  return null;
}
