import type React from "react";

interface NiceLayoutProps {
  children: React.ReactNode;
}
const NiceLayout: React.FC<NiceLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-svh flex-col">
      <main className="mx-auto max-w-[950px] py-10"> {children}</main>
    </div>
  );
};
export default NiceLayout;
