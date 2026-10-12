"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  Layers,
  LayoutGrid,
  Mail,
  Menu,
  Moon,
  Phone,
  Search,
  Server,
  Sparkles,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { applyAccent, accents, isAccentId, type AccentId } from "@/lib/accent";
import { CommandPalette } from "@/components/command-palette";
import { CompanyLogo } from "@/components/company-logo";
import { TechMarquee } from "@/components/tech-marquee";
import {
  navigation,
  profile,
  projectFilters,
  projects,
  roles,
  skillGroups,
  type Project,
  type ProjectCategory,
} from "@/lib/content";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
    </svg>
  );
}

const projectIcons: Record<Project["id"], LucideIcon> = {
  rootlink: Layers,
  debaai: Cpu,
  pipeline: Server,
};

const skillIcons: Record<string, LucideIcon> = {
  Languages: Sparkles,
  "Frameworks & tools": Layers,
  "Data & messaging": Server,
  "DevOps, cloud & security": Cpu,
  "Personal product work": LayoutGrid,
};

const categoryTone: Record<Project["category"], string> = {
  fullstack: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ai: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  devops:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const cardClass =
  "border border-zinc-200/80 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/80 dark:bg-[#16181d] dark:text-zinc-100 dark:shadow-none";
const headingClass = "text-zinc-900 dark:text-zinc-100";
const secondaryClass = "text-zinc-600 dark:text-zinc-400";
const bodyClass = "text-zinc-700 dark:text-zinc-300";
const mutedClass = "text-zinc-600 dark:text-zinc-400";
const accentClass = "accent-text";
const pillClass =
  "border border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
const sectionRule = "border-zinc-200/80 dark:border-zinc-800/60";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

function StatusPill({ className = "" }: { className?: string }) {
  return (
    <div
      className={`items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 ${className}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
      </span>
      Building AI Systems & Full-Stack Apps
    </div>
  );
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function Portfolio({
  totalTenure,
  roleDurations,
}: {
  totalTenure: string;
  roleDurations: Record<string, string>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectCategory>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [accent, setAccent] = useState<AccentId>("cyan");
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion
    ? { initial: false as const }
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-40px" },
      };

  useLayoutEffect(() => {
    const stored = localStorage.getItem("theme");
    applyTheme(stored === "light" ? "light" : "dark");
    const storedAccent = localStorage.getItem("accent");
    const nextAccent = isAccentId(storedAccent) ? storedAccent : "cyan";
    setAccent(nextAccent);
    applyAccent(nextAccent);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const visibleProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project) => project.category === activeTab);

  function toggleTheme() {
    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    applyTheme(next);
  }

  function chooseAccent(next: AccentId) {
    setAccent(next);
    applyAccent(next);
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f5f5f7] text-zinc-900 transition-colors duration-300 dark:bg-[#0b0c10] dark:text-zinc-100">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:px-3 focus:py-2 focus:text-white accent-fill"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-40 border-b text-zinc-900 transition-colors duration-300 dark:text-zinc-100 ${
          scrolled
            ? "border-zinc-200 bg-white/80 shadow-md backdrop-blur-xl dark:border-zinc-800/60 dark:bg-black/80 dark:shadow-none"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="#top"
              className="flex items-center gap-2 text-sm font-medium tracking-tight md:text-base"
            >
              <span className="accent-mark flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm">
                D
              </span>
              {profile.shortName}
            </a>
            <span
              className="relative flex h-2 w-2 lg:hidden"
              aria-label="Building AI Systems & Full-Stack Apps"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <StatusPill className="hidden lg:flex" />
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Sections">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-zinc-600 transition-colors duration-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-keyshortcuts="Control+K Meta+K"
              aria-label="Open command palette"
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden font-mono text-[10px] text-zinc-500 lg:inline">Ctrl K</kbd>
            </button>
            <div className="hidden sm:block">
              <AccentPicker value={accent} onChange={chooseAccent} />
            </div>
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-800 transition-colors duration-300 md:text-sm dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="rounded-full p-2 text-indigo-600 transition-colors duration-300 hover:bg-zinc-200 dark:text-amber-400 dark:hover:bg-zinc-800"
            >
              <Sun className="hidden h-4 w-4 dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-zinc-900 transition-colors duration-300 hover:bg-zinc-200 md:hidden dark:text-zinc-100 dark:hover:bg-zinc-800"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Sections"
            className="border-t border-zinc-200 bg-[#f5f5f7] px-6 py-3 shadow-lg md:hidden dark:border-zinc-800 dark:bg-[#0b0c10]"
          >
            <StatusPill className="my-2 flex w-fit" />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">Accent</span>
              <AccentPicker value={accent} onChange={chooseAccent} />
            </div>
            <button
              type="button"
              className="block w-full py-3 text-left text-base text-zinc-700 dark:text-zinc-300"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
            >
              Search
            </button>
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-3 text-base text-zinc-700 transition-colors duration-300 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="content">
        <section
          id="top"
          className="relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden px-6 pt-36 pb-16 text-center md:pt-48 md:pb-24"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden dark:opacity-40" aria-hidden>
            <div className="accent-beam hero-beam-center absolute -top-40 left-1/2 h-72 w-[32rem] rounded-full blur-3xl" />
            <div className="hero-beam-alt absolute -top-8 -left-24 h-56 w-56 rounded-full bg-indigo-300/15 blur-3xl dark:bg-indigo-400" />
            <div className="hero-beam absolute -top-16 -right-24 h-56 w-72 rounded-full bg-blue-300/15 blur-3xl dark:bg-blue-400" />
          </div>
          <motion.div
            className="flex flex-col items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="accent-chip mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            {profile.role} · {profile.company}
          </div>
          <h1 className="mb-8 max-w-4xl text-4xl leading-[1.08] font-bold tracking-tight text-zinc-900 sm:text-6xl md:text-7xl dark:text-zinc-100">
            Enterprise systems,{" "}
            <span className="accent-gradient">
              {totalTenure}
            </span>{" "}
            in the making.
          </h1>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
            {profile.tagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="accent-fill group flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              Explore Work
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-colors duration-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub Profile
            </a>
          </div>
          </motion.div>
        </section>

        <TechMarquee />

        <section id="experience" className={`mx-auto max-w-6xl border-t px-6 py-24 ${sectionRule}`}>
          <div className="mb-12">
            <h2 className={`mb-2 font-mono text-xs font-semibold tracking-widest uppercase ${accentClass}`}>
              Enterprise experience
            </h2>
            <p className={`text-3xl font-bold tracking-tight md:text-4xl ${headingClass}`}>
              {totalTenure} across product engineering.
            </p>
          </div>
          <motion.ol
            className="space-y-8"
            {...entrance}
            variants={stagger}
          >
            {roles.map((role) => (
              <motion.li
                key={role.id}
                variants={rise}
                onMouseMove={trackSpotlight}
                className={`spotlight ${cardClass} rounded-3xl p-7 md:p-8`}
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo logo={role.logo} />
                  <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className={`font-mono text-xs tracking-wide uppercase ${accentClass}`}>
                      {role.company}
                    </p>
                    <h3 className={`mt-2 text-2xl font-semibold tracking-tight ${headingClass}`}>
                      {role.title}
                    </h3>
                    <p className={`mt-1 text-sm ${secondaryClass}`}>
                      {role.location}
                    </p>
                  </div>
                  <p className={`font-mono text-sm ${mutedClass}`}>
                    {role.period}
                    {roleDurations[role.id] ? ` · ${roleDurations[role.id]}` : ""}
                  </p>
                  </div>
                </div>
                <div className="mt-8 space-y-8">
                  {role.projects.map((project) => (
                    <div key={project.name}>
                      <h4 className={`text-lg font-semibold tracking-tight ${headingClass}`}>
                        {project.name}
                      </h4>
                      <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-300">
                        {project.tagline}
                      </p>
                      <p className={`mt-3 text-sm leading-relaxed ${secondaryClass}`}>
                        {project.summary}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {project.highlights.map((item) => (
                          <li key={item} className={`flex items-start gap-3 text-sm leading-relaxed ${bodyClass}`}>
                            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accentClass}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        <section id="projects" className={`mx-auto max-w-6xl border-t px-6 py-24 ${sectionRule}`}>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className={`mb-2 font-mono text-xs font-semibold tracking-widest uppercase ${accentClass}`}>
                Personal projects
              </h2>
              <p className={`text-3xl font-bold tracking-tight md:text-4xl ${headingClass}`}>
                Products built outside the day job.
              </p>
            </div>
            <div
              className="flex items-center gap-1 self-start rounded-full border border-zinc-200 bg-zinc-100 p-1 md:self-auto dark:border-zinc-800 dark:bg-zinc-900"
              role="tablist"
              aria-label="Filter projects"
            >
              {projectFilters.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            {...entrance}
            variants={stagger}
          >
            {visibleProjects.map((project) => {
              const Icon = projectIcons[project.id];
              return (
                <motion.button
                  key={project.id}
                  type="button"
                  variants={rise}
                  onMouseMove={trackSpotlight}
                  onClick={() => setSelected(project)}
                  className={`spotlight ${cardClass} group flex cursor-pointer flex-col justify-between rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--accent-line)] hover:shadow-xl`}
                >
                  <span>
                    <span className="mb-6 flex items-center justify-between">
                      <span className={`rounded-2xl p-3 ${pillClass}`}>
                        <Icon className={`h-7 w-7 ${iconTone(project.category)}`} />
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${categoryTone[project.category]}`}
                      >
                        {project.category}
                      </span>
                    </span>
                    <span className={`mb-2 block text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--accent-text)] ${headingClass}`}>
                      {project.title}
                    </span>
                    <span className={`mb-4 block text-xs font-medium ${secondaryClass}`}>
                      {project.tagline}
                    </span>
                    <span className={`mb-6 block text-xs leading-relaxed ${secondaryClass}`}>
                      {project.description}
                    </span>
                  </span>
                  <span>
                    <span className="mb-6 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${pillClass}`}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 ? (
                        <span className={`px-2 py-0.5 font-mono text-[10px] ${mutedClass}`}>
                          +{project.stack.length - 4} more
                        </span>
                      ) : null}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${accentClass}`}>
                      View technical specs
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        <section id="skills" className={`mx-auto max-w-6xl border-t px-6 py-24 ${sectionRule}`}>
          <div className="mb-12">
            <h2 className={`mb-2 font-mono text-xs font-semibold tracking-widest uppercase ${accentClass}`}>
              System Capabilities
            </h2>
            <p className={`text-3xl font-bold tracking-tight md:text-4xl ${headingClass}`}>
              Technical stack and engineering architecture
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            {...entrance}
            variants={stagger}
          >
            {skillGroups.map((group) => {
              const Icon = skillIcons[group.title] ?? Sparkles;
              return (
                <motion.div
                  key={group.title}
                  variants={rise}
                  className={`${cardClass} rounded-3xl p-8`}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className={`rounded-xl p-2.5 ${pillClass}`}>
                      <Icon className={`h-5 w-5 ${accentClass}`} />
                    </span>
                    <h3 className={`text-lg font-semibold tracking-tight ${headingClass}`}>{group.title}</h3>
                  </div>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.items.map((skill) => (
                      <li key={skill} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${accentClass}`} />
                        <span className={`text-xs font-medium ${bodyClass}`}>
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section id="about" className={`mx-auto max-w-6xl border-t px-6 py-24 ${sectionRule}`}>
          <motion.div
            className="grid grid-cols-1 items-center gap-12 md:grid-cols-12"
            {...entrance}
            variants={rise}
          >
            <div className="md:col-span-7">
              <h2 className={`mb-2 font-mono text-xs font-semibold tracking-widest uppercase ${accentClass}`}>
                Background
              </h2>
              <h3 className={`mb-6 text-3xl font-bold tracking-tight md:text-4xl ${headingClass}`}>
                {profile.name}
              </h3>
              <p className={`mb-6 text-sm leading-relaxed md:text-base ${bodyClass}`}>
                {profile.tagline}
              </p>
              <p className={`mb-8 text-sm leading-relaxed md:text-base ${secondaryClass}`}>
                Outside Amdocs, the personal work is Rootlink, DebaAI, and a
                Cloud SQL sync pipeline. Certification: {profile.certification}.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className={`${cardClass} rounded-2xl p-4`}>
                  <span className={`block font-mono text-2xl font-bold ${accentClass}`}>
                    {totalTenure}
                  </span>
                  <span className={`text-xs ${mutedClass}`}>Since August 2019</span>
                </div>
                <div className={`${cardClass} rounded-2xl p-4`}>
                  <span className="block font-mono text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {profile.company}
                  </span>
                  <span className={`text-xs ${mutedClass}`}>Current employer</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className={`${cardClass} rounded-3xl p-8`}>
                <div className={`mb-4 font-mono text-xs ${accentClass}`}>
                  {"// System status"}
                </div>
                <dl className="space-y-4 font-mono text-xs">
                  <div className={`flex items-center justify-between border-b pb-2 ${sectionRule}`}>
                    <dt className={mutedClass}>Location</dt>
                    <dd className={`font-semibold ${headingClass}`}>{profile.location}</dd>
                  </div>
                  <div className={`flex items-center justify-between border-b pb-2 ${sectionRule}`}>
                    <dt className={mutedClass}>Employer</dt>
                    <dd className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {profile.company}
                    </dd>
                  </div>
                  <div className={`flex items-center justify-between border-b pb-2 ${sectionRule}`}>
                    <dt className={mutedClass}>Primary stack</dt>
                    <dd className="font-semibold text-blue-600 dark:text-blue-400">
                      Java & Spring Boot
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className={mutedClass}>Experience</dt>
                    <dd className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {totalTenure}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer
        id="contact"
        className={`border-t bg-zinc-200/70 px-6 py-16 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-zinc-100 ${sectionRule}`}
      >
        <motion.div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row"
          {...entrance}
          variants={rise}
        >
          <div>
            <h2 className={`mb-2 text-2xl font-bold tracking-tight ${headingClass}`}>
              Let&apos;s build something exceptional.
            </h2>
            <p className={`text-xs ${secondaryClass}`}>
              {profile.email} · {profile.phone}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              title="Email"
              className="accent-fill rounded-full border border-transparent p-3"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={profile.phoneHref}
              title="Phone"
              className="rounded-full border border-zinc-200 bg-white p-3 text-zinc-900 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="rounded-full border border-zinc-200 bg-white p-3 text-zinc-900 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="rounded-full border border-zinc-200 bg-white p-3 text-zinc-900 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
        <div className={`mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t pt-8 text-[11px] sm:flex-row ${mutedClass} ${sectionRule}`}>
          <p>© 2026 {profile.name}</p>
          <p className="font-mono">Next.js on Google Cloud Run</p>
        </div>
      </footer>

      {selected ? (
        <ProjectDialog key={selected.id} project={selected} onClose={() => setSelected(null)} />
      ) : null}
      {resumeOpen ? (
        <ResumeDialog
          totalTenure={totalTenure}
          roleDurations={roleDurations}
          onClose={() => setResumeOpen(false)}
        />
      ) : null}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

function iconTone(category: Project["category"]) {
  if (category === "fullstack") return "text-blue-600 dark:text-blue-400";
  if (category === "ai") return "text-purple-600 dark:text-purple-400";
  return "text-emerald-700 dark:text-emerald-400";
}

function hasLink(url: string) {
  return url.startsWith("http");
}

function AccentPicker({
  value,
  onChange,
  className = "",
}: {
  value: AccentId;
  onChange: (accent: AccentId) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label="Accent color" className={`flex items-center gap-1.5 ${className}`}>
      {accents.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${item.label} accent`}
            onClick={() => onChange(item.id)}
            className={`h-4 w-4 rounded-full ring-offset-2 ring-offset-[#f5f5f7] dark:ring-offset-[#0b0c10] ${
              selected ? "ring-2 ring-zinc-900 dark:ring-white" : "ring-1 ring-zinc-300 dark:ring-zinc-600"
            }`}
            style={{ backgroundColor: item.swatch }}
          />
        );
      })}
    </div>
  );
}

const projectTabs = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "code", label: "Code snippet" },
] as const;

type ProjectTab = (typeof projectTabs)[number]["id"];

function moveProjectTab(
  event: ReactKeyboardEvent<HTMLButtonElement>,
  current: ProjectTab,
  setTab: (tab: ProjectTab) => void,
) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  const index = projectTabs.findIndex((item) => item.id === current);
  const next =
    event.key === "ArrowRight"
      ? projectTabs[(index + 1) % projectTabs.length]
      : projectTabs[(index - 1 + projectTabs.length) % projectTabs.length];
  setTab(next.id);
  document.getElementById(`project-tab-${next.id}`)?.focus();
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<ProjectTab>("overview");

  useDialogBehavior(dialogRef, closeRef, onClose);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/80">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close project details"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-8 text-zinc-900 shadow-2xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 rounded-full p-2 text-zinc-700 transition-colors duration-300 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[10px] font-medium ${categoryTone[project.category]}`}
        >
          {project.category}
        </span>
        <h2 id={titleId} className={`mt-4 text-3xl font-bold tracking-tight ${headingClass}`}>
          {project.title}
        </h2>
        <p className={`mt-2 mb-6 text-sm font-medium ${accentClass}`}>
          {project.tagline}
        </p>
        <div role="tablist" aria-label="Project details" className="mb-6 flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {projectTabs.map((item) => {
            const selectedTab = tab === item.id;
            return (
              <button
                key={item.id}
                id={`project-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                aria-controls={`project-panel-${item.id}`}
                tabIndex={selectedTab ? 0 : -1}
                onClick={() => setTab(item.id)}
                onKeyDown={(event) => moveProjectTab(event, item.id, setTab)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${
                  selectedTab
                    ? "accent-fill"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {tab === "overview" ? (
          <div id="project-panel-overview" role="tabpanel" aria-labelledby="project-tab-overview" className="space-y-6 text-xs md:text-sm">
            <p className={`leading-relaxed ${bodyClass}`}>{project.description}</p>
            <ul className="space-y-2">
              {project.highlights.map((item) => (
                <li key={item} className={`flex items-start gap-3 ${bodyClass}`}>
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accentClass}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {hasLink(project.codeUrl) || hasLink(project.demoUrl) ? (
              <div className="flex flex-wrap gap-3">
                {hasLink(project.codeUrl) ? (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-xs font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                ) : null}
                {hasLink(project.demoUrl) ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accent-fill rounded-full px-5 py-2.5 text-xs font-semibold"
                  >
                    Live demo
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {tab === "architecture" ? (
          <div id="project-panel-architecture" role="tabpanel" aria-labelledby="project-tab-architecture" className="space-y-6 text-xs md:text-sm">
            <p className={`leading-relaxed ${bodyClass}`}>{project.architecture}</p>
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li key={tech} className={`rounded-lg px-2.5 py-1 font-mono text-xs ${pillClass}`}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {tab === "code" ? (
          <div id="project-panel-code" role="tabpanel" aria-labelledby="project-tab-code">
            <p className={`mb-3 text-xs ${mutedClass}`}>
              {project.snippet.caption}
            </p>
            <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
              <code>{project.snippet.code}</code>
            </pre>
            <p className={`mt-3 font-mono text-[10px] tracking-wide uppercase ${mutedClass}`}>
              {project.snippet.language}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResumeDialog({
  totalTenure,
  roleDurations,
  onClose,
}: {
  totalTenure: string;
  roleDurations: Record<string, string>;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogBehavior(dialogRef, closeRef, onClose);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/80">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close resume"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-8 text-zinc-900 shadow-2xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 rounded-full p-2 text-zinc-700 transition-colors duration-300 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>
        <div className={`mb-8 flex flex-col items-start gap-4 border-b pb-6 pr-12 ${sectionRule}`}>
          <div>
            <h2 id={titleId} className={`text-2xl font-bold tracking-tight ${headingClass}`}>
              {profile.name}
            </h2>
            <p className={`text-sm ${mutedClass}`}>
              {profile.role} · {totalTenure}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={profile.resumePdfHref}
              download="Debaprasad-Sahoo-Resume.pdf"
              className="accent-fill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <a
              href={profile.resumeHref}
              download="Debaprasad-Sahoo-Resume.docx"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors duration-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <FileText className="h-4 w-4" />
              Download Word (.docx)
            </a>
          </div>
        </div>
        <div className="space-y-6 text-xs md:text-sm">
          <div>
            <h3 className={`mb-2 font-mono text-xs font-bold uppercase ${accentClass}`}>
              Profile
            </h3>
            <p className={`leading-relaxed ${bodyClass}`}>{profile.tagline}</p>
          </div>
          <div>
            <h3 className={`mb-3 font-mono text-xs font-bold uppercase ${accentClass}`}>
              Experience
            </h3>
            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 p-4 text-zinc-800 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <div className="flex items-start gap-3">
                    <CompanyLogo logo={role.logo} size="sm" />
                    <div className="min-w-0">
                  <h4 className={`text-sm font-bold ${headingClass}`}>
                    {role.title}, {role.company}
                  </h4>
                  <p className={`mt-1 text-xs ${secondaryClass}`}>
                    {role.period}
                    {roleDurations[role.id] ? ` · ${roleDurations[role.id]}` : ""}
                    {" · "}
                    {role.location}
                  </p>
                  <ul className={`mt-2 space-y-1 text-xs ${bodyClass}`}>
                    {role.projects.map((project) => (
                      <li key={project.name}>
                        {project.name}: {project.summary}
                      </li>
                    ))}
                  </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className={`mb-3 font-mono text-xs font-bold uppercase ${accentClass}`}>
              Personal projects
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 p-4 text-zinc-800 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <h4 className={`text-sm font-bold ${headingClass}`}>{project.title}</h4>
                  <p className={`mt-1 text-xs ${secondaryClass}`}>{project.stack.join(", ")}</p>
                  <p className={`mt-2 text-xs ${bodyClass}`}>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className={`mb-2 font-mono text-xs font-bold uppercase ${accentClass}`}>
              Technical competencies
            </h3>
            <ul className={`space-y-2 leading-relaxed ${bodyClass}`}>
              {skillGroups.map((group) => (
                <li key={group.title}>
                  <span className="font-semibold">{group.title}: </span>
                  {group.items.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function useDialogBehavior(
  dialogRef: RefObject<HTMLDivElement | null>,
  closeRef: RefObject<HTMLButtonElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [closeRef, dialogRef, onClose]);
}
