import Image from "next/image";

type LogoProps = {
  compact?: boolean;
  inverted?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <span
      className={[
        "relative block shrink-0",
        compact
          ? "h-10 w-[150px]"
          : "h-10 w-[160px] sm:h-12 sm:w-[200px]"
      ].join(" ")}
    >
      <Image
        src="/logo/toolmarket.png"
        alt="ToolMarket.ge"
        fill
        sizes={compact ? "150px" : "(max-width: 639px) 160px, 200px"}
        className="object-contain object-left"
      />
    </span>
  );
}
