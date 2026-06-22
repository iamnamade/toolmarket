"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

const topicOptions = [
  "შეკვეთის საკითხი",
  "პროდუქტის ინფორმაცია",
  "ტექნიკური დახმარება",
  "თანამშრომლობა",
  "სხვა"
];

export function ContactForm() {
  const [ready, setReady] = useState(false);

  return (
    <form
      className="rounded-lg border border-[#E5EAF0] bg-white p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setReady(true);
      }}
    >
      <div className="mb-6">
        <span className="text-sm font-black text-[#F58220]">ფორმა</span>
        <h2 className="mt-2 text-2xl font-black tracking-normal text-[#041C32]">
          მოგვწერეთ
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">
          შეავსეთ საკონტაქტო ფორმა და მიუთითეთ, რა თემაზე გჭირდებათ დახმარება.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="სახელი" id="name">
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            placeholder="თქვენი სახელი"
            required
          />
        </Field>
        <Field label="ელ. ფოსტა" id="email">
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            placeholder="name@example.com"
            required
          />
        </Field>
        <Field label="თემა" id="topic">
          <select id="topic" name="topic" className="form-input" required>
            {topicOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="შეტყობინება" id="message" className="mt-4">
        <textarea
          id="message"
          name="message"
          rows={6}
          className="form-input min-h-36 resize-y py-3"
          placeholder="დაწერეთ შეტყობინება"
          required
        />
      </Field>

      {ready ? (
        <div className="mt-5 flex items-center gap-3 rounded-md border border-[#B7E4C7] bg-[#F0FFF4] px-4 py-3 text-sm font-bold text-[#157347]">
          <CheckCircle2 className="size-5 shrink-0" />
          შეტყობინება მზად არის გასაგზავნად
        </div>
      ) : null}

      <button
        type="submit"
        className="focus-ring mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#F58220] px-5 text-sm font-black text-white transition hover:bg-[#de741d] sm:w-auto"
      >
        <Send className="size-4" />
        გაგზავნა
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  children,
  className = ""
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-[#102033]">
        {label}
      </label>
      {children}
    </div>
  );
}
