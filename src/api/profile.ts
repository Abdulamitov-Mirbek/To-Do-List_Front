import { apiRequest } from "./client";
import type { ProfileResponse } from "./types";

export const fetchProfile = () =>
  apiRequest<ProfileResponse>("/api/user/profile");
