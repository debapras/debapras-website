"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { navigation, profile } from "@/lib/content";

type Command = {
  id: string;
  group: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void | Promise<void>;
};

export function CommandPalette({
  open,
  onClose,
  onToggleTheme,
}: {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
}) {
  const titleId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const filteredRef = useRef<Command[]>([]);
  const activeRef = useRef(0);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const commands = useMemo<Command[]>(() => {
    const jump = navigation.map((item) => ({
      id: `go-${item.href}`,
      group: "Jump",
      label: item.label === "Personal" ? "Projects" : item.label,
      hint: item.href,
      keywords: `${item.label} section`,
      run: () => {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
        onClose();
      },
    }));

    return [
      ...jump,
      {
        id: "resume-pdf",
        group: "Resume",
        label: "Download resume PDF",
        hint: "PDF",
        keywords: "cv download pdf",
        run: () => {
          download(profile.resumePdfHref, "Debaprasad-Sahoo-Resume.pdf");
          onClose();
        },
      },
      {
        id: "resume-word",
        group: "Resume",
        label: "Download resume Word",
        hint: "DOCX",
        keywords: "cv download docx word",
        run: () => {
          download(profile.resumeHref, "Debaprasad-Sahoo-Resume.docx");
          onClose();
        },
      },
      {
        id: "theme",
        group: "Preferences",
        label: "Toggle dark and light mode",
        hint: "Theme",
        keywords: "theme dark light appearance",
        run: () => {
          onToggleTheme();
        },
      },
      {
        id: "email",
        group: "Contact",
        label: copied ? "Email copied" : "Copy email address",
        hint: profile.email,
        keywords: "email mail contact copy",
        run: async () => {
          const copiedEmail = await copyText(profile.email);
          setCopied(copiedEmail);
        },
      },
    ];
  }, [copied, onClose, onToggleTheme]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint} ${command.keywords}`.toLowerCase().includes(needle),
    );
  }, [commands, query]);

  filteredRef.current = filtered;
  activeRef.current = Math.min(active, Math.max(filtered.length - 1, 0));

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      const items = filteredRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((index) => (items.length === 0 ? 0 : (index + 1) % items.length));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) => (items.length === 0 ? 0 : (index - 1 + items.length) % items.length));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const index = Math.min(activeRef.current, Math.max(items.length - 1, 0));
        items[index]?.run();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
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
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const selectedIndex = Math.min(active, Math.max(filtered.length - 1, 0));
  const activeId = filtered[selectedIndex] ? `command-${filtered[selectedIndex].id}` : undefined;

  return (
    <div className="animate-fade-in fixed inset-0 z-[70] flex items-start justify-center bg-black/80 p-4 pt-[12vh] backdrop-blur-md">
      <button type="button" className="absolute inset-0" aria-label="Close command palette" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 text-zinc-900 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100"
      >
        <h2 id={titleId} className="sr-only">
          Command palette
        </h2>
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-label="Search commands"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Jump, download resume, toggle theme…"
          className="w-full border-b border-zinc-200 bg-transparent px-4 py-4 text-base outline-none placeholder:text-zinc-500 dark:border-zinc-700"
        />
        <ul id={listId} role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matching commands</li>
          ) : (
            filtered.map((command, index) => (
              <li key={command.id}>
                <button
                  id={`command-${command.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === selectedIndex}
                  tabIndex={-1}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => command.run()}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                    index === selectedIndex ? "bg-[var(--accent-soft)] text-[var(--accent-text)]" : ""
                  }`}
                >
                  <span>
                    <span className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
                      {command.group}
                    </span>
                    {command.label}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-500">{command.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const copiedValue = document.execCommand("copy");
    area.remove();
    return copiedValue;
  }
}

function download(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
}
