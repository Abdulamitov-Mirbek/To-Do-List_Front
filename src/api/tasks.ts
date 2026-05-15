import { apiRequest } from "./client";
import type {
  CreateTaskPayload,
  PatchTaskPayload,
  TaskMutationResponse,
  TasksListResponse,
  UpdateTaskPayload,
} from "./types";

export const fetchTasks = () =>
  apiRequest<TasksListResponse>("/api/tasks");

export const fetchTask = (id: string) =>
  apiRequest<TaskMutationResponse>(`/api/tasks/${id}`);

export const createTask = (payload: CreateTaskPayload) =>
  apiRequest<TaskMutationResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateTask = (id: string, payload: UpdateTaskPayload) =>
  apiRequest<TaskMutationResponse>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const patchTask = (id: string, payload: PatchTaskPayload) =>
  apiRequest<TaskMutationResponse>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteTask = (id: string) =>
  apiRequest<void>(`/api/tasks/${id}`, { method: "DELETE" });
