import { supabase } from "@/integrations/supabase/client";
import { ApiError } from "@/lib/api-error";
import { triggerProPaywall } from "@/lib/billing/paywallEvents";

type InvokeOptions = {
  body?: unknown;
  headers?: Record<string, string>;
};

/**
 * Ensure the Supabase client has a valid, fresh session before invoking.
 * After this call, `supabase.auth.getSession()` (used internally by
 * `fetchWithAuth`) will return a non-expired access token.
 */
async function ensureFreshSession(): Promise<void> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Sessione non valida o scaduta. Effettua nuovamente il login.");
  }

  // Verify the token is still accepted by the auth server.
  // getUser() is the only reliable way to check validity (getSession reads from cache).
  const { error: userError } = await supabase.auth.getUser(token);
  if (userError) {
    // Token rejected — force a refresh so the next invoke picks up a new one.
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error("Sessione non valida o scaduta. Effettua nuovamente il login.");
    }
  }
}

function extractErrorDetails(error: { context?: Response; message?: string }) {
  return async () => {
    const payload = error.context ? await error.context.json().catch(() => null) : null;
    const message =
      (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : null) ??
      (payload && typeof payload === "object" && "error" in payload && typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : null) ??
      error.message ??
      "Errore funzione edge";

    const code = payload && typeof payload === "object" && "code" in payload && typeof (payload as { code?: unknown }).code === "string"
      ? (payload as { code: string }).code
      : undefined;
    const status = error.context?.status ?? 500;

    return { message, code, status, payload };
  };
}

async function runInvoke<T>(fn: string, options: InvokeOptions): Promise<T> {
  // Let the Supabase client handle Authorization and apikey headers
  // via its built-in fetchWithAuth mechanism (same as all other working functions).
  const { data, error } = await supabase.functions.invoke(fn, {
    body: options.body ?? {},
    headers: options.headers,
  });

  if (error) {
    const { message, code, status, payload } = await extractErrorDetails(error)();

    if (status === 402 || status === 429) {
      triggerProPaywall({ status, message, code });
    }

    throw new ApiError(message, { status, code, payload });
  }

  return data as T;
}

export async function invokeWithAuth<T = unknown>(fn: string, options: InvokeOptions = {}): Promise<T> {
  await ensureFreshSession();

  try {
    return await runInvoke<T>(fn, options);
  } catch (firstError) {
    // Only retry on auth-related failures.
    const isAuthError =
      (firstError instanceof ApiError && firstError.status === 401) ||
      /401|unauthorized|jwt|authorization|Invalid JWT/i.test(firstError instanceof Error ? firstError.message : "");

    if (!isAuthError) throw firstError;

    // One retry after forcing a session refresh.
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error("Sessione scaduta. Effettua di nuovo il login.");
    }

    try {
      return await runInvoke<T>(fn, options);
    } catch (retryError) {
      const isRetryAuth =
        (retryError instanceof ApiError && retryError.status === 401) ||
        /401|unauthorized|jwt|authorization|Invalid JWT/i.test(retryError instanceof Error ? retryError.message : "");

      if (isRetryAuth) {
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
      }
      throw retryError;
    }
  }
}
