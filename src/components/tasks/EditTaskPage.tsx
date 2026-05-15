import type { FormEvent } from "react";
import type { Priority } from "../../types";
import MobileShell from "../layout/MobileShell";

type EditTaskPageProps = {
  title: string;
  description: string;
  dueDateLocal: string;
  priority: Priority;
  done: boolean;
  isSubmitting?: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setDueDateLocal: (value: string) => void;
  setPriority: (value: Priority) => void;
  setDone: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onDelete: () => void;
};

const EditTaskPage = ({
  title,
  description,
  dueDateLocal,
  priority,
  done,
  isSubmitting = false,
  setTitle,
  setDescription,
  setDueDateLocal,
  setPriority,
  setDone,
  onSubmit,
  onBack,
  onDelete,
}: EditTaskPageProps) => (
  <MobileShell>
    <form className="page-form" onSubmit={onSubmit}>
      <div className="page-header">
        <button
          type="button"
          className="icon-button"
          onClick={onBack}
          aria-label="Назад"
          disabled={isSubmitting}
        >
          ←
        </button>
        <h2 className="page-title">Изменить задачу</h2>
        <button
          type="button"
          className="icon-button danger"
          onClick={onDelete}
          aria-label="Удалить"
          disabled={isSubmitting}
        >
          🗑
        </button>
      </div>

      <div className="card-soft">
        <label className="field-label">
          Заголовок
          <input
            className="input-field"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label className="field-label">
          Описание
          <textarea
            className="input-field"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className="card-soft">
        <label className="field-label">
          Срок
          <input
            className="input-field"
            type="datetime-local"
            value={dueDateLocal}
            onChange={(event) => setDueDateLocal(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <span className="field-label">Приоритет</span>
        <div className="priority-pick">
          {(["low", "medium", "high"] as Priority[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`priority-btn ${value} ${priority === value ? "active" : ""}`}
              onClick={() => setPriority(value)}
              disabled={isSubmitting}
            >
              {value === "low" ? "Низкий" : value === "medium" ? "Средний" : "Высокий"}
            </button>
          ))}
        </div>
      </div>

      <div className="card-soft status-card">
        <div>
          <p className="status-title">Статус</p>
          <p className="status-hint">{done ? "Выполнена" : "Активная задача"}</p>
        </div>
        <button
          type="button"
          className={`toggle ${done ? "on" : ""}`}
          onClick={() => setDone(!done)}
          aria-label="Переключить статус"
          disabled={isSubmitting}
        >
          <span className="toggle-thumb" />
        </button>
      </div>

      <button type="submit" className="btn-grad" disabled={isSubmitting}>
        {isSubmitting ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  </MobileShell>
);

export default EditTaskPage;
