import type { Task, TaskFilter } from "../../types";
import MobileShell from "../layout/MobileShell";
import TaskItem from "./TaskItem";

type TaskBoardProps = {
  userName: string;
  tasks: Task[];
  activeCount: number;
  doneCount: number;
  todayCount: number;
  search: string;
  filter: TaskFilter;
  filteredTasks: Task[];
  isLoading?: boolean;
  setSearch: (value: string) => void;
  setFilter: (value: TaskFilter) => void;
  onToggleDone: (id: string) => void;
  onEditTask: (id: string) => void;
  onAddTask: () => void;
  onOpenProfile: () => void;
};

const TaskBoard = ({
  userName,
  tasks,
  activeCount,
  doneCount,
  todayCount,
  search,
  filter,
  filteredTasks,
  isLoading = false,
  setSearch,
  setFilter,
  onToggleDone,
  onEditTask,
  onAddTask,
  onOpenProfile,
}: TaskBoardProps) => {
  const firstName = userName.trim().split(/\s+/)[0] || "друг";
  const avatarLetter = (userName.trim()[0] ?? "A").toUpperCase();

  return (
    <MobileShell>
      <div className="tasks-page">
        <div className="tasks-header">
          <div>
            <p className="greeting">Привет, {firstName} 👋</p>
            <h1 className="gradient-text">Мои задачи</h1>
          </div>
          <button
            type="button"
            className="avatar"
            onClick={onOpenProfile}
            aria-label="Профиль"
          >
            {avatarLetter}
          </button>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-num">{activeCount}</div>
            <div className="stat-lbl">Активных</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{doneCount}</div>
            <div className="stat-lbl">Готово</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{todayCount}</div>
            <div className="stat-lbl">Сегодня</div>
          </div>
        </div>

        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="input-field"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск задач..."
            disabled={isLoading}
          />
        </div>

        <div className="chip-row">
          <button
            type="button"
            className={`chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
            disabled={isLoading}
          >
            Все · {tasks.length}
          </button>
          <button
            type="button"
            className={`chip ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
            disabled={isLoading}
          >
            Активные
          </button>
          <button
            type="button"
            className={`chip ${filter === "done" ? "active" : ""}`}
            onClick={() => setFilter("done")}
            disabled={isLoading}
          >
            Готово
          </button>
        </div>

        {isLoading ? (
          <p className="page-hint">Загрузка задач...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="page-hint">Задач пока нет. Нажмите +, чтобы создать.</p>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleDone}
                onEdit={onEditTask}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          className="fab"
          onClick={onAddTask}
          aria-label="Создать задачу"
          disabled={isLoading}
        >
          +
        </button>
      </div>
    </MobileShell>
  );
};

export default TaskBoard;
