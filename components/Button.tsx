import Icon, { IconName } from "./Icon";

type Props = {
  children: React.ReactNode;
  href?: string;
  target?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "dark" | "secondary";
  iconLeft?: IconName;
  iconRight?: IconName;
  full?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export default function Button({ children, href, target, size = "md", variant = "primary", iconLeft, iconRight, full, type = "button", onClick, className = "" }: Props) {
  const cls = `btn ${size} ${variant === "primary" ? "" : variant} ${full ? "full" : ""} ${className}`;
  const inner = (
    <>
      {iconLeft && <Icon name={iconLeft} size={size === "sm" ? 18 : 20} />}
      <span>{children}</span>
      {iconRight && (
        <span className="arrow" style={{ display: "inline-flex" }}>
          <Icon name={iconRight} size={size === "sm" ? 18 : 20} />
        </span>
      )}
      <i className="shine" />
    </>
  );
  if (href)
    return (
      <a className={cls} href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} data-magnetic>
        {inner}
      </a>
    );
  return (
    <button className={cls} type={type} onClick={onClick} data-magnetic>
      {inner}
    </button>
  );
}
