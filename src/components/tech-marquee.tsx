"use client";

import { useReducedMotion } from "framer-motion";

const technologies = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "GCP Cloud Run",
  "Docker",
  "Model Context Protocol",
  "Tailwind CSS",
  "Spring Boot",
];

const pillClass =
  "shrink-0 whitespace-nowrap rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/80 dark:text-zinc-100";

export function TechMarquee() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section aria-label="Technologies" className="mx-auto w-full max-w-6xl overflow-hidden px-6 py-6">
        <ul className="flex flex-wrap justify-center gap-4">
          {technologies.map((name) => (
            <li key={name} className={pillClass}>
              {name}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label="Technologies" className="relative mx-auto w-full max-w-6xl overflow-hidden px-6 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f5f5f7] to-transparent dark:from-[#0b0c10]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f5f5f7] to-transparent dark:from-[#0b0c10]" />
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center gap-4 pr-4"
            aria-hidden={copy === 1}
          >
            {technologies.map((name) => (
              <li key={`${copy}-${name}`} className={pillClass}>
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
