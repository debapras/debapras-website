"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white"
    >
      Save as PDF
    </button>
  );
}
