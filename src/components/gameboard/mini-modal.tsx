import { ReactNode } from "react";

export function MiniModal({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="mini-modal"
      style={{
        background: "white",
        position: "absolute",
        height: "calc(100% - 32px)",
        width: "calc(100% - 32px)",
        borderRadius: 6,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}
