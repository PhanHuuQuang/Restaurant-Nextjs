export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = await res.text();
    try {
      const data = JSON.parse(message) as { message?: string | string[] };
      if (typeof data?.message === "string") {
        message = data.message;
      } else if (Array.isArray(data?.message)) {
        message = data.message.join(", ");
      }
    } catch {
      // Body is not JSON; keep the raw text.
    }
    throw new ApiError(res.status, message || res.statusText);
  }

  const data = (await res.json()) as T;

  return data;
}
