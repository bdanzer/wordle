import { CSSProperties, ReactNode } from "react";

function Button({
  children,
  backgroundColor,
  style,
  ...otherProps
}: {
  children: ReactNode;
  backgroundColor: string;
  style?: CSSProperties;
  [key: string]: any;
}) {
  return (
    <button
      {...otherProps}
      style={{
        ...style,
        transition: ".5s ease",
        border: "none",
        padding: "15px 15px",
        backgroundColor,
        borderRadius: 6,
        textTransform: "uppercase",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "1.25px",
        color: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default Button;
