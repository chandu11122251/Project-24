import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import "./StarBorder.css";

type StarBorderProps<T extends ElementType = "button"> = {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: ReactNode;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children" | "style">;

export default function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) {
  const Component = (as ?? "button") as ElementType;

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
}
