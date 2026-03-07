import { supabase } from "@/integrations/supabase/client";

type InvokeOptions = {
  body?: unknown;
  headers?: Record<string, string>;
};

async function getAccessToken(): Promise<string> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  let token = sessionData.session?.access_token;
  if (!token) {
    const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    token = refreshedData.session?.access_token;
  }

  if (!token) {
    throw new Error("Sessione non valida. Effettua nuovamente il login.");
  }

  return token;
}

export async function invokeWithAuth<T = unknown>(fn: string, options: InvokeOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const { data, error } = await supabase.functions.invoke(fn, {
    body: options.body,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) throw error;
  return data as T;
}
