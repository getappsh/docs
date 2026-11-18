import React from 'react';

// Small stroke icon set (24×24, currentColor) used by the landing and products pages.
const PATHS = {
  store: (
    <>
      <path d="M4 9h16l-1.2-4.2A1 1 0 0 0 17.8 4H6.2a1 1 0 0 0-1 .8L4 9Z" />
      <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  git: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2v7.6" />
      <path d="M18 11.2c0 3-3 4-9.8 5.3" />
    </>
  ),
  rules: (
    <>
      <path d="M4 6h10" />
      <path d="M4 12h6" />
      <path d="M4 18h10" />
      <circle cx="17" cy="6" r="2" />
      <circle cx="13" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M19 6h1M15 12h5M19 18h1" />
    </>
  ),
  fleet: (
    <>
      <rect x="3" y="4" width="7" height="6" rx="1" />
      <rect x="14" y="4" width="7" height="6" rx="1" />
      <rect x="3" y="14" width="7" height="6" rx="1" />
      <rect x="14" y="14" width="7" height="6" rx="1" />
    </>
  ),
  sliders: (
    <>
      <path d="M6 4v6M6 14v6M12 4v2M12 10v10M18 4v10M18 18v2" />
      <path d="M4 12h4M10 8h4M16 16h4" />
    </>
  ),
  agent: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
      <path d="m9 10.5 2 2 4-4" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="3" width="6" height="5" rx="1" />
      <rect x="15" y="10" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <path d="M6 8v8M9 5.5h3a3 3 0 0 1 3 3V10M9 18.5h3a3 3 0 0 0 3-3V15" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2v8.6M10.6 6.7 6.4 16.1M13.4 6.7l4.2 9.4" />
    </>
  ),
  usb: (
    <>
      <rect x="8" y="2" width="8" height="6" rx="1" />
      <path d="M7 8h10v9a5 5 0 0 1-10 0V8Z" />
      <path d="M10.5 4.5h0M13.5 4.5h0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.8 12.2 8.2-8.2M16 7l2.5 2.5M14 9l2 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="m8 15 3.5-4 3 2.5L19 8" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.2" />
      <rect x="4" y="14" width="16" height="6" rx="1.2" />
      <path d="M8 7h0M8 17h0" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
      <path d="M12 19.5h0" />
    </>
  ),
};

export default function Icon({ name, size = 22, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
