import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { profile, projects, roles, skillGroups } from "@/lib/content";
import { careerStart, formatTenure } from "@/lib/tenure";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name} — ${profile.role}`,
};

export default async function ResumePage() {
  await connection();
  const now = new Date();
  const totalTenure = formatTenure(careerStart, "present", now);

  return (
    <div className="min-h-full bg-[#f5f5f7] text-slate-900">
      <div className="no-print mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          Back to site
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <a
            href={profile.resumePdfHref}
            download="Debaprasad-Sahoo-Resume.pdf"
            className="text-sm font-medium text-cyan-700"
          >
            Download PDF
          </a>
          <a
            href={profile.resumeHref}
            download="Debaprasad-Sahoo-Resume.docx"
            className="text-sm font-medium text-slate-700"
          >
            Download Word
          </a>
          <PrintButton />
        </div>
      </div>
      <article className="mx-auto w-full max-w-3xl bg-white px-6 py-10 sm:px-10 print:bg-white print:text-black">
        <header>
          <p className="font-mono text-xs tracking-[0.18em] text-cyan-700 uppercase">
            {profile.role} · {totalTenure}
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
            {profile.tagline}
          </p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span className="px-2 text-slate-400">/</span>
            <a href={profile.phoneHref}>{profile.phone}</a>
            <span className="px-2 text-slate-400">/</span>
            {profile.location}
          </p>
        </header>

        <section className="mt-12">
          <h2 className="border-b border-slate-200 pb-2 font-mono text-xs tracking-[0.18em] uppercase">
            Experience
          </h2>
          <ul className="mt-6 space-y-10">
            {roles.map((role) => (
              <li key={role.id}>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {role.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {role.company} · {role.location}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {role.period} · {formatTenure(role.start, role.end, now)}
                </p>
                <div className="mt-4 space-y-5">
                  {role.projects.map((project) => (
                    <div key={project.name}>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="mt-1 text-sm text-slate-600">{project.summary}</p>
                      <ul className="mt-2 space-y-1 text-sm leading-6">
                        {project.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="border-b border-slate-200 pb-2 font-mono text-xs tracking-[0.18em] uppercase">
            Personal projects
          </h2>
          <ul className="mt-6 space-y-6">
            {projects.map((project) => (
              <li key={project.id}>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm leading-relaxed">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="border-b border-slate-200 pb-2 font-mono text-xs tracking-[0.18em] uppercase">
            Skills
          </h2>
          <dl className="mt-6 space-y-3 text-sm">
            {skillGroups.map((group) => (
              <div key={group.title} className="grid gap-1 sm:grid-cols-4">
                <dt className="text-slate-600">{group.title}</dt>
                <dd className="sm:col-span-3">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="border-b border-slate-200 pb-2 font-mono text-xs tracking-[0.18em] uppercase">
            Certification
          </h2>
          <p className="mt-4 text-sm">{profile.certification} · Amazon Web Services</p>
        </section>
      </article>
    </div>
  );
}
