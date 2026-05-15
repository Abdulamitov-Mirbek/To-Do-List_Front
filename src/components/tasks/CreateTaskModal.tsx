import type { FormEvent } from "react";
import type { Priority } from "../../types";

type CreateTaskModalProps = {
  title: string;
  description: string;
  dueDateLocal: string;
  priority: Priority;
  isSubmitting?: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setDueDateLocal: (value: string) => void;
  setPriority: (value: Priority) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

const CreateTaskModal = ({
  title,
  description,
  dueDateLocal,
  priority,
  isSubmitting = false,
  setTitle,
  setDescription,
  setDueDateLocal,
  setPriority,
  onSubmit,
  onCancel,
}: CreateTaskModalProps) => (
  <div className="modal-overlay">
    <form className="modal-sheet" onSubmit={onSubmit}>
      <div className="modal-handle" />
      <h3 className="sheet-title">Новая задача</h3>
      <p className="sheet-subtitle">Опишите, что нужно сделать</p>

      <label className="field-label">
        Заголовок
        <input
          className="input-field"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например: позвонить маме"
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
          placeholder="Дополнительно"
          disabled={isSubmitting}
        />
      </label>

      <label className="field-label">
        Срок выполнения
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

      <div className="sheet-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button type="submit" className="btn-grad" disabled={isSubmitting}>
          {isSubmitting ? "Создание..." : "Создать"}
        </button>
      </div>
    </form>
  </div>
);

export default CreateTaskModal;
