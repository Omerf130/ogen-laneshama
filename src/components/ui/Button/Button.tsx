import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small";
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: undefined;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  variant = "primary",
  size = "default",
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    variant === "secondary"
      ? styles.secondary
      : variant === "ghost"
        ? styles.ghost
        : styles.primary,
    size === "small" ? styles.small : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    if (disabled) {
      return <span className={classes} aria-disabled="true">{children}</span>;
    }

    return (
      <Link
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      disabled={disabled}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
