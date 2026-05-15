import MobileShell from "../layout/MobileShell";
import type { TaskStats } from "../../types";

type ProfilePageProps = {
  name: string;
  email: string;
  stats: TaskStats;
  isLoading?: boolean;
  onBack: () => void;
  onLogout: () => void;
};

const ProfilePage = ({
  name,
  email,
  stats,
  isLoading = false,
  onBack,
  onLogout,
}: ProfilePageProps) => {
  const avatarLetter = (name.trim()[0] ?? "A").toUpperCase();

  return (
    <MobileShell>
      <div className="profile-page">
        <div className="page-header">
          <button
            type="button"
            className="icon-button"
            onClick={onBack}
            aria-label="Назад"
            disabled={isLoading}
          >
            ←
          </button>
          <h2 className="page-title">Профиль</h2>
        </div>

        <div className="profile-hero">
          <div className="avatar-big">{avatarLetter}</div>
          <h3 className="profile-name">{name}</h3>
          <p className="profile-email">{email}</p>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-num">{stats.total}</div>
            <div className="stat-lbl">Всего</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.completed}</div>
            <div className="stat-lbl">Готово</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.progress}%</div>
            <div className="stat-lbl">Прогресс</div>
          </div>
        </div>

        <p className="section-label">Настройки</p>
        <div className="menu-row">
          <div className="menu-icon">🔔</div>
          <span className="menu-label">Уведомления</span>
          <span className="menu-arrow">›</span>
        </div>
        <div className="menu-row">
          <div className="menu-icon">🌙</div>
          <span className="menu-label">Тёмная тема</span>
          <span className="menu-arrow">›</span>
        </div>
        <div className="menu-row">
          <div className="menu-icon">🌐</div>
          <span className="menu-label">Русский</span>
          <span className="menu-arrow">›</span>
        </div>

        <div className="divider" />

        <button
          type="button"
          className="menu-row logout-row"
          onClick={onLogout}
          disabled={isLoading}
        >
          <div className="menu-icon danger">↪</div>
          <span className="menu-label danger-text">Выйти</span>
        </button>
      </div>
    </MobileShell>
  );
};

export default ProfilePage;
