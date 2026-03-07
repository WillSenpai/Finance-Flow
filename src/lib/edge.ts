export async function invokeEdgeWithJwt<TResponse>(
  functionName: string,
  accessToken: string,
  body: unknown,
): Promise<TResponse> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!baseUrl || !publishableKey) {
    throw new Error("Configurazione Supabase mancante (URL o key).");
  }

  const response = await fetch(`${baseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!isOkResponse(response)) {
    const message = await readEdgeError(response);
    throw new Error(message);
  }

  return readEdgeSuccess<TResponse>(response);
}

type ResponseLike = Response | {
  ok?: boolean;
  status?: number;
  statusText?: string;
  data?: unknown;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
  clone?: () => ResponseLike;
};

function isOkResponse(response: ResponseLike): boolean {
  if (typeof response.ok === "boolean") return response.ok;
  const status = typeof response.status === "number" ? response.status : 0;
  return status >= 200 && status < 300;
}

async function readEdgeSuccess<TResponse>(response: ResponseLike): Promise<TResponse> {
  const parsed = await tryParseBody(response);
  if (parsed !== undefined) return parsed as TResponse;
  throw new Error("Risposta funzione non valida.");
}

async function readEdgeError(response: ResponseLike): Promise<string> {
  const parsed = await tryParseBody(response);
  if (parsed && typeof parsed === "object") {
    const payload = parsed as { error?: string; message?: string };
    if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  }

  const text = await tryReadText(response);
  if (text?.trim()) return text;

  const status = typeof response.status === "number" ? response.status : 0;
  const statusText = typeof response.statusText === "string" ? response.statusText : "";
  return `HTTP ${status} ${statusText}`.trim();
}

async function tryParseBody(response: ResponseLike): Promise<unknown | undefined> {
  try {
    const clone = typeof response.clone === "function" ? response.clone() : undefined;
    if (clone && typeof clone.json === "function") {
      return await clone.json();
    }
  } catch {
    // Ignore clone/json failure and fallback below.
  }

  try {
    if (typeof response.json === "function") {
      return await response.json();
    }
  } catch {
    // Ignore and fallback below.
  }

  if ("data" in response) {
    const raw = response.data;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    if (raw !== undefined) return raw;
  }

  return undefined;
}

async function tryReadText(response: ResponseLike): Promise<string | undefined> {
  try {
    if (typeof response.text === "function") {
      return await response.text();
    }
  } catch {
    // Ignore and fallback below.
  }

  if ("data" in response && typeof response.data === "string") {
    return response.data;
  }

  return undefined;
}
