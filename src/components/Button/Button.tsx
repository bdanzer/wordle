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
        marginTop: 8,
        transition: "1s ease",
        border: "none",
        padding: "15px 15px",
        backgroundColor,
        borderRadius: 6,
        textTransform: "uppercase",
        fontWeight: 700,
        color: "white",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}

export default Button;
