import type { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

const MobileShell = ({ children, className = "" }: MobileShellProps) => (
  <div className={`app-page ${className}`.trim()}>
    <div className="page-inner">{children}</div>
  </div>
);

export default MobileShell;
