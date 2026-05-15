import type { ApiTask } from "../api/types";
import type { Task } from "../types";

export const mapApiTaskToTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? "",
  priority: task.priority,
  dueDate: task.dueDate,
  done: task.isCompleted,
});

export const mapApiTasks = (tasks: ApiTask[]): Task[] =>
  tasks.map(mapApiTaskToTask);
