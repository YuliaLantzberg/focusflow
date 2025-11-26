export function getToken() {
  const token = localStorage.getItem("ff_token");
  if (!token) return null;
  return token;
}

export async function apiFetch(url: string, options?: RequestInit) {
  const token = getToken();
  console.log(token);
  const optionsWithToken = {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  const res = await fetch(url, optionsWithToken);
  return res;
}
