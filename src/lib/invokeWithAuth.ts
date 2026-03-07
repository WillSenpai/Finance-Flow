import { supabase } from "@/integrations/supabase/client";

type InvokeOptions = {
  body?: unknown;
  headers?: Record<string, string>;
};

async function safeSignOut() {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore sign out failures and preserve the original auth error.
  }
}

async function getAccessToken(): Promise<string> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  let token = sessionData.session?.access_token;
  if (token) return token;

  const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  token = refreshedData.session?.access_token;

  if (!token) {
    await safeSignOut();
    throw new Error("Sessione non valida o scaduta. Effettua nuovamente il login.");
  }

  return token;
}

export async function invokeWithAuth<T = unknown>(fn: string, options: InvokeOptions = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

  if (!baseUrl || !publishableKey) {
    throw new Error("Configurazione Supabase mancante (URL/Publishable key).");
  }

  const runInvoke = async (token: string) => {
    const res = await fetch(`${baseUrl}/functions/v1/${fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
      body: JSON.stringify(options.body ?? {}),
    });

    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      const message =
        (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as { message?: unknown }).message === "string"
          ? (parsed as { message: string }).message
          : null) ??
        (parsed && typeof parsed === "object" && "error" in parsed && typeof (parsed as { error?: unknown }).error === "string"
          ? (parsed as { error: string }).error
          : null) ??
        `HTTP ${res.status}`;

      throw new Error(message);
    }

    return parsed as T;
  };

  let token = await getAccessToken();
  try {
    return await runInvoke(token);
  } catch (firstError) {
    if (!/401|unauthorized|jwt|authorization/i.test(firstError instanceof Error ? firstError.message : "")) {
      throw firstError;
    }

    const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshedData.session?.access_token) {
      await safeSignOut();
      throw new Error("Sessione scaduta. Effettua di nuovo il login.");
    }

    token = refreshedData.session.access_token;
    try {
      return await runInvoke(token);
    } catch (retryError) {
      if (/401|unauthorized|jwt|authorization/i.test(retryError instanceof Error ? retryError.message : "")) {
        await safeSignOut();
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
      }
      throw retryError;
    }
  }
}
