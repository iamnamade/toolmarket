import { serviceHighlights } from "@/data/site";

export function ServiceHighlights() {
  return (
    <section className="bg-white pb-12">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {serviceHighlights.map((highlight) => (
          <div
            key={highlight.title}
            className="rounded-lg border border-[#E5EAF0] bg-[#F7F9FC] p-5"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-md bg-white text-[#072B4D] ring-1 ring-[#E5EAF0]">
              <highlight.icon className="size-5" />
            </div>
            <h2 className="text-sm font-black text-[#102033]">{highlight.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{highlight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
