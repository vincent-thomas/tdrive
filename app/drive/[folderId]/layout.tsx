import type { FC, ReactNode } from "react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <nav className="flex justify-between">
        <div></div>
        <div></div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
