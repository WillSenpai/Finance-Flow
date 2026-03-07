export const AI_PROVIDER = (Deno.env.get("AI_PROVIDER") ?? "openai").toLowerCase();

const DEFAULT_GATEWAY_URL = AI_PROVIDER === "gemini"
  ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
  : "https://api.openai.com/v1/chat/completions";

const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL") ?? DEFAULT_GATEWAY_URL;
const DEFAULT_IMAGE_GATEWAY_URL = AI_PROVIDER === "gemini"
  ? "https://generativelanguage.googleapis.com/v1beta/openai/images/generations"
  : "https://api.openai.com/v1/images/generations";
const AI_IMAGE_GATEWAY_URL = Deno.env.get("AI_IMAGE_GATEWAY_URL") ?? DEFAULT_IMAGE_GATEWAY_URL;

export const AI_BASE_MODEL = Deno.env.get("AI_BASE_MODEL") ??
  (AI_PROVIDER === "gemini" ? "gemini-2.5-flash-lite" : "gpt-4.1-mini");

export const AI_COMPLEX_MODEL = Deno.env.get("AI_COMPLEX_MODEL") ??
  (AI_PROVIDER === "gemini" ? "gemini-2.5-pro" : "gpt-4.1");

const AI_TIMEOUT_MS = Number(Deno.env.get("AI_TIMEOUT_MS") ?? "45000");

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatOptions = {
  apiKey: string;
  messages: ChatMessage[];
  stream?: boolean;
  model?: string;
  extraBody?: Record<string, JsonValue>;
};

export type ImageGenerationOptions = {
  apiKey: string;
  model: string;
  prompt: string;
  size?: string;
};

export async function chatCompletion(options: ChatOptions): Promise<Response> {
  const model = normalizeModelForProvider(options.model ?? AI_BASE_MODEL);
  const body: Record<string, JsonValue> = {
    model,
    messages: options.messages,
    stream: options.stream ?? false,
    ...(options.extraBody ?? {}),
  };

  return fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });
}

export async function imageGeneration(options: ImageGenerationOptions): Promise<Response> {
  const model = normalizeModelForProvider(options.model);
  if (AI_PROVIDER === "gemini") {
    const body: Record<string, JsonValue> = {
      contents: [{ parts: [{ text: options.prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    };
    return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": options.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });
  }

  const body: Record<string, JsonValue> = {
    model,
    prompt: options.prompt,
    size: options.size ?? "1024x1024",
  };

  return fetch(AI_IMAGE_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });
}

function normalizeModelForProvider(model: string): string {
  if (AI_PROVIDER === "gemini") {
    return model.replace(/^google\//, "");
  }
  return model;
}

type FallbackOptions = {
  apiKey: string;
  messages: ChatMessage[];
  isComplexTask: boolean;
  extraBody?: Record<string, JsonValue>;
  validateContent?: (content: string) => boolean;
};

export async function chatCompletionWithComplexFallback(
  options: FallbackOptions,
): Promise<{ response: Response; modelUsed: string }> {
  const baseResp = await chatCompletion({
    apiKey: options.apiKey,
    messages: options.messages,
    extraBody: options.extraBody,
    stream: false,
    model: AI_BASE_MODEL,
  });

  if (!options.isComplexTask) {
    return { response: baseResp, modelUsed: AI_BASE_MODEL };
  }

  if (!baseResp.ok) {
    const fallbackResp = await chatCompletion({
      apiKey: options.apiKey,
      messages: options.messages,
      extraBody: options.extraBody,
      stream: false,
      model: AI_COMPLEX_MODEL,
    });
    return { response: fallbackResp, modelUsed: AI_COMPLEX_MODEL };
  }

  if (!options.validateContent) {
    return { response: baseResp, modelUsed: AI_BASE_MODEL };
  }

  try {
    const cloned = baseResp.clone();
    const data = await cloned.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    if (typeof content === "string" && options.validateContent(content)) {
      return { response: baseResp, modelUsed: AI_BASE_MODEL };
    }
  } catch {
    // If response parsing fails, fallback to complex model for complex tasks.
  }

  const fallbackResp = await chatCompletion({
    apiKey: options.apiKey,
    messages: options.messages,
    extraBody: options.extraBody,
    stream: false,
    model: AI_COMPLEX_MODEL,
  });
  return { response: fallbackResp, modelUsed: AI_COMPLEX_MODEL };
}

export function extractAssistantContent(data: unknown): string {
  const content = (data as { choices?: Array<{ message?: { content?: string } }> })
    ?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}
