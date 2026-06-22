type IconButtonProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  expanded?: boolean;
  badge?: number;
};

export function IconButton({
  label,
  children,
  className = "",
  onClick,
  type = "button",
  expanded,
  badge
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className={[
        "focus-ring relative grid size-11 place-items-center rounded-md border border-[#E5EAF0] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]",
        className
      ].join(" ")}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#F58220] px-1 text-[10px] font-black leading-none text-white ring-2 ring-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </button>
  );
}
