import type React from "react";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return <div className="app-wrapper">{children}</div>;
};

export default AppWrapper;
