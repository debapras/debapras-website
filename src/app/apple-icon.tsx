import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the badge is drawn full-bleed with an inset border.
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180">
  <rect width="32" height="32" fill="#0b0c10"/>
  <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="#06b6d4" stroke-width="1" stroke-opacity="0.8"/>
  <path d="M11 9.5v13h3.5a6.5 6.5 0 0 0 0-13z" fill="none" stroke="#22d3ee" stroke-width="2.75" stroke-linejoin="round"/>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        width={180}
        height={180}
        src={`data:image/svg+xml;base64,${Buffer.from(monogram).toString("base64")}`}
      />
    ),
    size,
  );
}
