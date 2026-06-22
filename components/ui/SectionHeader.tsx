type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto mb-8 max-w-2xl text-center" : "mb-6 max-w-2xl"}>
      <span className="text-sm font-black text-[#F58220]">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-black tracking-normal text-[#041C32] sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-sm leading-6 text-[#6B7280]">{description}</p> : null}
    </div>
  );
}
