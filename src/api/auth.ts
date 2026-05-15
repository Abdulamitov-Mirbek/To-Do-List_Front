import { apiRequest } from "./client";
import { tokenStorage } from "./storage";
import type { LoginResponse, RegisterResponse } from "./types";

export const login = async (email: string, password: string) => {
  const data = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  tokenStorage.set(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  const data = await apiRequest<RegisterResponse>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password, name }),
  });
  tokenStorage.set(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
};

export const logout = () => {
  tokenStorage.clear();
};
