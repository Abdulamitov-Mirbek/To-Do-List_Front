import type { Priority } from "../types";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  dateJoined?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiTask = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskStats = {
  total: number;
  active: number;
  completed: number;
  progress: number;
};

export type TasksListResponse = {
  tasks: ApiTask[];
  stats: TaskStats;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
};

export type LoginResponse = {
  message: string;
  user: ApiUser;
  tokens: AuthTokens;
};

export type RegisterResponse = LoginResponse;

export type RefreshResponse = {
  message: string;
  tokens: AuthTokens;
};

export type ProfileResponse = {
  user: ApiUser & { stats: TaskStats };
};

export type TaskMutationResponse = {
  message: string;
  task: ApiTask;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  completed?: boolean;
};

export type UpdateTaskPayload = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};

export type PatchTaskPayload = Partial<{
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  isCompleted: boolean;
  completed: boolean;
}>;
