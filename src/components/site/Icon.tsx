import type { IconName } from "@/content/site/types";

/** 24×24 line icons, stroked with currentColor. */
const PATHS: Record<IconName, string> = {
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6 8-6s8 2 8 6",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c0-3.4 2.9-5.2 6.5-5.2s6.5 1.8 6.5 5.2 M16 4.6a3.5 3.5 0 0 1 0 6.8 M18.5 15.2c1.9.6 3 2.1 3 4.8",
  id: "M3 5h18v14H3z M7 15c.5-1.5 1.6-2.2 2.5-2.2s2 .7 2.5 2.2 M9.5 11a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z M14.5 9h3.5 M14.5 12.5h3.5",
  shield: "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z M9 12l2 2 4-4",
  calendar: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4 M8 13h3 M8 16h6",
  copy: "M8 8h12v12H8z M16 8V4H4v12h4",
  building: "M4 21V5l8-2v18 M12 7l8 2v12 M8 8h.01 M8 12h.01 M8 16h.01 M16 12h.01 M16 16h.01 M3 21h18",
  file: "M7 3h8l4 4v14H7z M15 3v4h4 M10 12h6 M10 16h6",
  fileCheck: "M7 3h8l4 4v14H7z M15 3v4h4 M10 14l2 2 4-4",
  tooth: "M7.5 3.5C5 3.5 4 5.5 4 8c0 3 1.5 4.5 2 8 .4 2.6 1 4.5 2 4.5 1.2 0 1.4-2.2 2-4 .4-1.2.9-2 2-2s1.6.8 2 2c.6 1.8.8 4 2 4 1 0 1.6-1.9 2-4.5.5-3.5 2-5 2-8 0-2.5-1-4.5-3.5-4.5-1.8 0-2.6 1-4.5 1s-2.7-1-4.5-1z",
  clip: "M20 11.5 12.2 19.3a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8",
  send: "M21 3 3 10.5l7 2.5 2.5 7z M10 13 21 3",
  inbox: "M3 13h5l1.5 3h5L16 13h5 M5 5h14l2 8v6H3v-6z",
  refresh: "M4 12a8 8 0 0 1 14-5.3 M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4 M6 21v-4h4",
  alert: "M12 4 21 20H3z M12 10v4.5 M12 17h.01",
  scale: "M12 4v16 M7 20h10 M5 8h14 M5 8l-3 6c0 1.7 1.3 2.5 3 2.5S8 15.7 8 14z M19 8l-3 6c0 1.7 1.3 2.5 3 2.5s3-.8 3-2.5z M12 4l-2-1h4z",
  coins: "M9 8c3.9 0 7-1.3 7-3s-3.1-3-7-3-7 1.3-7 3 3.1 3 7 3z M2 5v4c0 1.7 3.1 3 7 3s7-1.3 7-3V5 M2 9v4c0 1.7 3.1 3 7 3 M16 11c3.4.2 6 1.4 6 3 0 1.7-3.1 3-7 3s-7-1.3-7-3 M8 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4",
  chart: "M3 20h18 M6 20v-7 M11 20V8 M16 20v-5 M21 20V5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  lock: "M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3 M12 14.5v2.5",
  key: "M8 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M11 11l10 0 M17 11v3 M20 11v2",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  link: "M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1 M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1",
  layers: "M12 3 2 8l10 5 10-5z M2 13l10 5 10-5 M2 17.5l10 5 10-5",
  chat: "M4 5h16v11H9l-5 4z M8 9h8 M8 12.5h5",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  download: "M12 3v12 M7 10l5 5 5-5 M4 20h16",
  book: "M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z M4 20.5A1.5 1.5 0 0 0 5.5 22H20 M8 7h8",
  check: "M4 12.5l5 5L20 6.5",
  flag: "M5 21V4 M5 4h11l-2 4 2 4H5",
  steth: "M6 3v6a4 4 0 0 0 8 0V3 M10 13v3a5 5 0 0 0 10 0v-1 M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  clipboard: "M8 4h8v3H8z M6 5H5v16h14V5h-1 M8.5 12h7 M8.5 16h5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-5-5",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  stamp: "M9 3h6v4.5c0 1.5 3 2.5 3 5.5H6c0-3 3-4 3-5.5z M5 16h14v3H5z M4 21h16",
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
