export type Page =
  | "login"
  | "register"
  | "tasks"
  | "create"
  | "edit"
  | "profile";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  done: boolean;
};

export type TaskFilter = "all" | "active" | "done";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type TaskStats = {
  total: number;
  active: number;
  completed: number;
  progress: number;
};

export const priorityLabel: Record<Priority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};
