export function getToken() {
  const token = localStorage.getItem("ff_token");
  if (!token) return null;
  return token;
}

export async function apiFetch(url: string, options?: RequestInit) {
  const token = getToken();
  const optionsWithToken = {
    ...options,
    headers: {
      ...options?.headers,
      ...(options?.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  const res = await fetch(url, optionsWithToken);
  return res;
}

export async function loadData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await apiFetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed fetching ${url}: ${res.status}`);
  }
  return res.json();
}
