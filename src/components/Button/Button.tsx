import { CSSProperties, ReactNode } from "react";

function Button({
  children,
  backgroundColor,
  style,
  fullWidth,
  condensed,
  ...otherProps
}: {
  children: ReactNode;
  backgroundColor: string;
  style?: CSSProperties;
  fullWidth?: boolean;
  condensed?: boolean;
  [key: string]: any;
}) {
  return (
    <button
      {...otherProps}
      style={{
        ...style,
        transition: ".5s ease",
        border: "none",
        padding: condensed ? "10px 19px" : "15px 19px",
        backgroundColor,
        borderRadius: 6,
        textTransform: "uppercase",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "1.25px",
        color: "white",
        cursor: "pointer",
        ...(fullWidth && { width: "100%" }),
      }}
    >
      {children}
    </button>
  );
}

export default Button;
