import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 rounded-lg border border-[#E5EAF0] bg-[#072B4D] p-5 sm:p-8 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <div className="mb-4 grid size-11 place-items-center rounded-md bg-white/10 text-[#F58220] ring-1 ring-white/15">
              <Mail className="size-5" />
            </div>
            <h2 className="text-2xl font-black tracking-normal text-white sm:text-3xl">
              გამოიწერეთ სიახლეები
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              მიიღეთ ინფორმაცია ახალ პროდუქტებზე, ფასდაკლებებსა და ბრენდების შეთავაზებებზე.
            </p>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label htmlFor="newsletter-email" className="sr-only">
              ელ.ფოსტა
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="ელ.ფოსტა"
              className="focus-ring h-12 rounded-md border border-white/15 bg-white px-4 text-sm text-[#102033] placeholder:text-[#8A95A8]"
            />
            <button
              type="button"
              className="focus-ring h-12 rounded-md bg-[#F58220] px-5 text-sm font-black text-white transition hover:bg-[#de741d]"
            >
              გამოწერა
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
