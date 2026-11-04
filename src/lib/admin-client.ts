/** Client-side helper for admin API calls. Throws Error with the server message on failure. */
export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  })
  const body = (await res.json().catch(() => ({}))) as { error?: string } & T
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`)
  return body
}
