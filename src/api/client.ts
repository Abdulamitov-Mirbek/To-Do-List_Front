import { API_BASE_URL } from "./config";
import { tokenStorage } from "./storage";
import type { RefreshResponse } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let refreshPromise: Promise<string | null> | null = null;

const parseMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // ignore parse errors
  }
  return response.statusText || "Ошибка запроса";
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    tokenStorage.clear();
    return null;
  }

  const data = (await response.json()) as RefreshResponse;
  tokenStorage.set(data.tokens.accessToken, data.tokens.refreshToken);
  return data.tokens.accessToken;
};

const getRefreshedToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  auth?: boolean;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { auth = true, headers = {}, ...init } = options;

  const send = async (accessToken?: string | null) => {
    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    if (!(init.body instanceof FormData)) {
      requestHeaders["Content-Type"] ??= "application/json";
    }

    if (auth && accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: requestHeaders,
    });
  };

  let accessToken = auth ? tokenStorage.getAccess() : null;
  let response = await send(accessToken);

  if (auth && response.status === 401 && tokenStorage.getRefresh()) {
    accessToken = await getRefreshedToken();
    if (!accessToken) {
      throw new ApiError(401, "Сессия истекла. Войдите снова.");
    }
    response = await send(accessToken);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
