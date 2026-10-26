type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function apiOrigin() {
  const fromEnv = import.meta.env.VITE_API_ORIGIN as string | undefined;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/+$/, "");
  return "";
}

export async function apiFetch<T>(
  path: string,
  opts?: { method?: HttpMethod; body?: unknown; token?: string | null }
): Promise<T> {
  const url = `${apiOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: opts?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {})
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.error as string)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

