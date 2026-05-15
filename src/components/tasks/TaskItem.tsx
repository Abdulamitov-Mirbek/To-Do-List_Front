import type { Task } from "../../types";
import { priorityLabel } from "../../types";
import { formatDueDate } from "../../utils/dates";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
};

const TaskItem = ({ task, onToggle, onEdit }: TaskItemProps) => {
  const meta = task.done
    ? "Готово"
    : `${priorityLabel[task.priority]} · ${formatDueDate(task.dueDate, task.done)}`;

  return (
    <article
      className={`task-item ${task.done ? "done" : ""}`}
      onClick={() => onEdit(task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onEdit(task.id);
      }}
      role="button"
      tabIndex={0}
    >
      <button
        type="button"
        className={`task-check ${task.done ? "done" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle(task.id);
        }}
        aria-label={task.done ? "Снять отметку" : "Отметить выполненной"}
      />
      <div className="task-body">
        <p className={`task-title ${task.done ? "done" : ""}`}>{task.title}</p>
        <div className="task-meta">
          {!task.done && (
            <span className={`priority-dot pri-${task.priority}`} />
          )}
          <span>{meta}</span>
        </div>
      </div>
    </article>
  );
};

export default TaskItem;
