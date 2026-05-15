import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { login, logout, register } from "./api/auth";
import { ApiError } from "./api/client";
import { fetchProfile } from "./api/profile";
import { tokenStorage } from "./api/storage";
import {
  createTask,
  deleteTask,
  fetchTasks,
  patchTask,
  updateTask,
} from "./api/tasks";
import AuthCard from "./components/auth/AuthCard";
import ProfilePage from "./components/profile/ProfilePage";
import CreateTaskModal from "./components/tasks/CreateTaskModal";
import EditTaskPage from "./components/tasks/EditTaskPage";
import TaskBoard from "./components/tasks/TaskBoard";
import type { Page, Priority, Task, TaskFilter, TaskStats, UserProfile } from "./types";
import {
  defaultDueDateIso,
  fromDatetimeLocalValue,
  isDueToday,
  toDatetimeLocalValue,
} from "./utils/dates";
import { mapApiTaskToTask, mapApiTasks } from "./utils/tasks";

type TaskDraft = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  done: boolean;
};

const emptyStats = (): TaskStats => ({
  total: 0,
  active: 0,
  completed: 0,
  progress: 0,
});

const emptyDraft = (): TaskDraft => ({
  title: "",
  description: "",
  dueDate: defaultDueDateIso(),
  priority: "medium",
  done: false,
});

const App = () => {
  const [page, setPage] = useState<Page>("login");
  const [email, setEmail] = useState("aida@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("Айда");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(emptyStats);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isTaskSaving, setIsTaskSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const todayCount = useMemo(
    () => tasks.filter((task) => isDueToday(task.dueDate, task.done)).length,
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active" && task.done) return false;
      if (filter === "done" && !task.done) return false;
      return task.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [tasks, filter, search]);

  const draftDueLocal = toDatetimeLocalValue(draft.dueDate);

  const setDraftDueLocal = (value: string) => {
    setDraft((current) => ({
      ...current,
      dueDate: fromDatetimeLocalValue(value),
    }));
  };

  const resetDraft = () => setDraft(emptyDraft());

  const handleApiError = useCallback((error: unknown, fallback: string) => {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        logout();
        setUser(null);
        setTasks([]);
        setStats(emptyStats());
        setPage("login");
        setAppError("Сессия истекла. Войдите снова.");
        return;
      }
      setAppError(error.message);
      return;
    }
    setAppError(fallback);
  }, []);

  const loadTasks = useCallback(async () => {
    setIsTasksLoading(true);
    setAppError(null);
    try {
      const data = await fetchTasks();
      setTasks(mapApiTasks(data.tasks));
      setStats(data.stats);
    } catch (error) {
      handleApiError(error, "Не удалось загрузить задачи");
    } finally {
      setIsTasksLoading(false);
    }
  }, [handleApiError]);

  const loadProfile = useCallback(async () => {
    setIsProfileLoading(true);
    setAppError(null);
    try {
      const data = await fetchProfile();
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
      setStats(data.user.stats);
    } catch (error) {
      handleApiError(error, "Не удалось загрузить профиль");
    } finally {
      setIsProfileLoading(false);
    }
  }, [handleApiError]);

  const enterApp = useCallback(
    async (profile: UserProfile) => {
      setUser(profile);
      setAppError(null);
      setPage("tasks");
      await loadTasks();
    },
    [loadTasks],
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.hasSession()) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const data = await fetchProfile();
        await enterApp({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        });
      } catch {
        logout();
        setPage("login");
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, [enterApp]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsAuthSubmitting(true);

    try {
      if (page === "register") {
        if (password !== confirmPassword) {
          setAuthError("Пароли не совпадают");
          return;
        }
        const data = await register(email.trim(), password, name.trim());
        await enterApp({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        });
        return;
      }

      const data = await login(email.trim(), password);
      await enterApp({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError("Не удалось выполнить запрос");
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const openCreate = () => {
    resetDraft();
    setPage("create");
  };

  const openEdit = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setEditingId(id);
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done,
    });
    setPage("edit");
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTaskSaving(true);
    setAppError(null);

    try {
      const response = await createTask({
        title: draft.title.trim(),
        description: draft.description.trim(),
        priority: draft.priority,
        dueDate: draft.dueDate,
        completed: false,
      });
      setTasks((current) => [...current, mapApiTaskToTask(response.task)]);
      await loadTasks();
      resetDraft();
      setPage("tasks");
    } catch (error) {
      handleApiError(error, "Не удалось создать задачу");
    } finally {
      setIsTaskSaving(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) return;

    setIsTaskSaving(true);
    setAppError(null);

    try {
      const response = await updateTask(editingId, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        priority: draft.priority,
        dueDate: draft.dueDate,
        completed: draft.done,
      });
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId ? mapApiTaskToTask(response.task) : task,
        ),
      );
      await loadTasks();
      setEditingId(null);
      resetDraft();
      setPage("tasks");
    } catch (error) {
      handleApiError(error, "Не удалось сохранить задачу");
    } finally {
      setIsTaskSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!editingId) return;

    setIsTaskSaving(true);
    setAppError(null);

    try {
      await deleteTask(editingId);
      setTasks((current) => current.filter((task) => task.id !== editingId));
      await loadTasks();
      setEditingId(null);
      resetDraft();
      setPage("tasks");
    } catch (error) {
      handleApiError(error, "Не удалось удалить задачу");
    } finally {
      setIsTaskSaving(false);
    }
  };

  const toggleDone = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setAppError(null);
    try {
      const response = await patchTask(id, { isCompleted: !task.done });
      setTasks((current) =>
        current.map((item) =>
          item.id === id ? mapApiTaskToTask(response.task) : item,
        ),
      );
      setStats((current) => {
        const nextDone = !task.done;
        const completed = nextDone ? current.completed + 1 : current.completed - 1;
        const active = nextDone ? current.active - 1 : current.active + 1;
        const total = current.total;
        return {
          total,
          active: Math.max(0, active),
          completed: Math.max(0, completed),
          progress: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      });
    } catch (error) {
      handleApiError(error, "Не удалось обновить статус");
    }
  };

  const handleOpenProfile = async () => {
    setPage("profile");
    await loadProfile();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setTasks([]);
    setStats(emptyStats());
    setPassword("");
    setConfirmPassword("");
    setSearch("");
    setFilter("all");
    setEditingId(null);
    resetDraft();
    setAuthError(null);
    setAppError(null);
    setPage("login");
  };

  if (isBootstrapping) {
    return (
      <div className="app-shell">
        <p className="page-hint bootstrap-hint">Загрузка...</p>
      </div>
    );
  }

  const userName = user?.name ?? name;
  const userEmail = user?.email ?? email;

  return (
    <div className="app-shell">
      {appError && page !== "login" && page !== "register" && (
        <p className="app-error" role="alert">
          {appError}
        </p>
      )}

      {(page === "login" || page === "register") && (
        <AuthCard
          page={page}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          name={name}
          isSubmitting={isAuthSubmitting}
          error={authError}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          setName={setName}
          onSubmit={(event) => void handleAuthSubmit(event)}
          onPageChange={(nextPage) => {
            setAuthError(null);
            setPage(nextPage);
          }}
        />
      )}

      {(page === "tasks" || page === "create") && (
        <>
          <TaskBoard
            userName={userName}
            tasks={tasks}
            activeCount={stats.active}
            doneCount={stats.completed}
            todayCount={todayCount}
            search={search}
            filter={filter}
            filteredTasks={filteredTasks}
            isLoading={isTasksLoading}
            setSearch={setSearch}
            setFilter={setFilter}
            onToggleDone={(id) => void toggleDone(id)}
            onEditTask={openEdit}
            onAddTask={openCreate}
            onOpenProfile={() => void handleOpenProfile()}
          />
          {page === "create" && (
            <CreateTaskModal
              title={draft.title}
              description={draft.description}
              dueDateLocal={draftDueLocal}
              priority={draft.priority}
              isSubmitting={isTaskSaving}
              setTitle={(value) => setDraft((current) => ({ ...current, title: value }))}
              setDescription={(value) =>
                setDraft((current) => ({ ...current, description: value }))
              }
              setDueDateLocal={setDraftDueLocal}
              setPriority={(value) =>
                setDraft((current) => ({ ...current, priority: value }))
              }
              onSubmit={(event) => void handleCreateSubmit(event)}
              onCancel={() => {
                resetDraft();
                setPage("tasks");
              }}
            />
          )}
        </>
      )}

      {page === "edit" && (
        <EditTaskPage
          title={draft.title}
          description={draft.description}
          dueDateLocal={draftDueLocal}
          priority={draft.priority}
          done={draft.done}
          isSubmitting={isTaskSaving}
          setTitle={(value) => setDraft((current) => ({ ...current, title: value }))}
          setDescription={(value) =>
            setDraft((current) => ({ ...current, description: value }))
          }
          setDueDateLocal={setDraftDueLocal}
          setPriority={(value) =>
            setDraft((current) => ({ ...current, priority: value }))
          }
          setDone={(value) => setDraft((current) => ({ ...current, done: value }))}
          onSubmit={(event) => void handleEditSubmit(event)}
          onBack={() => {
            setEditingId(null);
            resetDraft();
            setPage("tasks");
          }}
          onDelete={() => void handleDeleteTask()}
        />
      )}

      {page === "profile" && (
        <ProfilePage
          name={userName}
          email={userEmail}
          stats={stats}
          isLoading={isProfileLoading}
          onBack={() => setPage("tasks")}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
