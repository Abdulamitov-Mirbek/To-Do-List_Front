import type { FormEvent } from "react";
import type { Page } from "../../types";
import MobileShell from "../layout/MobileShell";

type AuthCardProps = {
  page: Page;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  isSubmitting?: boolean;
  error?: string | null;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPageChange: (page: Page) => void;
};

const AuthCard = ({
  page,
  email,
  password,
  confirmPassword,
  name,
  isSubmitting = false,
  error = null,
  setEmail,
  setPassword,
  setConfirmPassword,
  setName,
  onSubmit,
  onPageChange,
}: AuthCardProps) => {
  const isLogin = page === "login";

  return (
    <MobileShell className="auth-layout">
      <div className="logo-circle">✓</div>
      <h2 className="auth-heading">
        {isLogin ? "С возвращением" : "Создать аккаунт"}
      </h2>
      <p className="auth-subheading">
        {isLogin ? "Войдите, чтобы продолжить" : "Начните планировать сегодня"}
      </p>

      {error && <p className="form-error">{error}</p>}

      <form className="auth-form" onSubmit={onSubmit}>
        {!isLogin && (
          <label className="field-label">
            Имя
            <input
              className="input-field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Mirbek"
              required
              disabled={isSubmitting}
            />
          </label>
        )}

        <label className="field-label">
          Email
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={isLogin ? undefined : "вы@example.com"}
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="field-label">
          Пароль
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isLogin ? "••••••••" : "Минимум 8 символов"}
            required
            disabled={isSubmitting}
          />
        </label>

        {!isLogin && (
          <label className="field-label">
            Повторите пароль
            <input
              className="input-field"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Введите ещё раз"
              required
              disabled={isSubmitting}
            />
          </label>
        )}

        {isLogin && (
          <div className="forgot-row">
            <button type="button" className="link-text" disabled={isSubmitting}>
              Забыли пароль?
            </button>
          </div>
        )}

        <button type="submit" className="btn-grad" disabled={isSubmitting}>
          {isSubmitting
            ? isLogin
              ? "Вход..."
              : "Регистрация..."
            : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
        </button>
      </form>

      <p className="auth-switch">
        {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
        <button
          type="button"
          className="link-text"
          onClick={() => onPageChange(isLogin ? "register" : "login")}
          disabled={isSubmitting}
        >
          {isLogin ? "Регистрация" : "Войти"}
        </button>
      </p>
    </MobileShell>
  );
};

export default AuthCard;
