"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { getLenis } from "@/components/motion/SmoothScroll";
import { DEMO_LINK, LOGIN_URL, MAIN_NAV, type NavGroup, type NavLink } from "@/content/navigation";
import { INDUSTRIES, PIPELINE, TECHNOLOGY } from "@/content/home";
import pages from "@/content/generated/pages.json";
import styles from "./Header.module.css";

/** Dropdown intros reuse approved homepage headings; notes reuse approved card copy. */
const INTRO: Record<string, { title: string; body: string; overview?: string }> = {
  Services: { title: PIPELINE.heading, body: firstSentence(PIPELINE.intro), overview: "Services overview" },
  Industries: { title: INDUSTRIES.heading, body: firstSentence(INDUSTRIES.intro) },
  Technology: { title: TECHNOLOGY.heading, body: firstSentence(TECHNOLOGY.intro), overview: "Technology overview" },
};

const NOTES = new Map<string, string>([
  ...(PIPELINE.pipeline ?? []).map((c) => [c.url ?? "", c.body] as [string, string]),
  ...(INDUSTRIES.cards ?? []).map((c) => [c.url ?? "", c.body] as [string, string]),
  ...pages.map((p) => [p.route, firstSentence(p.seo.description ?? "")] as [string, string]),
]);

function firstSentence(text: string) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

const DROPDOWNS = MAIN_NAV.filter((g) => g.children.length > 0);
type MenuKey = string;

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const close = useCallback(() => setOpen(null), []);

  // Solid background after leaving the top; hide while reading downwards.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 480);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes (state adjusted during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  // Escape + outside click for desktop menus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const trigger = headerRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${CSS.escape(open)}"]`);
        setOpen(null);
        trigger?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Mobile sheet: pause smooth scroll, lock the page, trap focus.
  useEffect(() => {
    if (!mobileOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const first = sheetRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const items = [toggleRef.current, ...sheetRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
        (el): el is HTMLElement => !!el && el.offsetParent !== null,
      );
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [mobileOpen]);

  const openWithIntent = (key: MenuKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const closeWithIntent = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const onTriggerKey = (key: MenuKey) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(key);
      requestAnimationFrame(() => document.getElementById(`${id}-${slug(key)}`)?.querySelector<HTMLElement>("a")?.focus());
    }
  };

  const solid = scrolled || open !== null;

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-solid={solid || undefined}
      data-hidden={(hidden && !open && !mobileOpen) || undefined}
      data-menu-open={open !== null || undefined}
      data-mobile-open={mobileOpen || undefined}
    >
      <div className={`container ${styles.bar}`}>
        <SmartLink href="/" className={styles.brand} aria-label="ConvergeFlow home">
          <Logo tone={solid && !mobileOpen ? "dark" : "light"} width={196} priority />
        </SmartLink>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {MAIN_NAV.map((group) =>
              group.children.length > 0 ? (
                <li key={group.label} onMouseEnter={() => openWithIntent(group.label)} onMouseLeave={closeWithIntent}>
                  <button
                    type="button"
                    className={styles.navItem}
                    aria-expanded={open === group.label}
                    aria-controls={`${id}-${slug(group.label)}`}
                    data-menu-trigger={group.label}
                    onClick={() => setOpen(open === group.label ? null : group.label)}
                    onKeyDown={onTriggerKey(group.label)}
                  >
                    {group.label}
                    <Chevron />
                  </button>
                </li>
              ) : group.href ? (
                <li key={group.label}>
                  <SmartLink href={group.href} className={styles.navItem} onClick={close}>
                    {group.label}
                  </SmartLink>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={LOGIN_URL} className={styles.login}>
            Login
          </a>
          <SmartLink href={DEMO_LINK.href} className={`btn btn-primary ${styles.cta}`} onClick={close}>
            <span>{DEMO_LINK.label}</span>
          </SmartLink>
          <button
            ref={toggleRef}
            type="button"
            className={styles.burger}
            aria-expanded={mobileOpen}
            aria-controls={`${id}-sheet`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {DROPDOWNS.map((group) => {
        const intro = INTRO[group.label];
        return (
          <div
            key={group.label}
            id={`${id}-${slug(group.label)}`}
            className={styles.mega}
            data-open={open === group.label || undefined}
            hidden={open !== group.label}
            onMouseEnter={() => openWithIntent(group.label)}
            onMouseLeave={closeWithIntent}
          >
            <div className={`container ${styles.megaInner}`}>
              <div className={styles.megaIntro}>
                <p className="eyebrow">{group.label}</p>
                {intro && <p className={styles.megaTitle}>{intro.title}</p>}
                {intro && <p className={styles.megaBody}>{intro.body}</p>}
                {group.href && (
                  <SmartLink href={group.href} className="link-arrow" onClick={close}>
                    {intro?.overview ?? `All ${group.label.toLowerCase()}`} <span aria-hidden="true">→</span>
                  </SmartLink>
                )}
              </div>
              <ul className={styles.megaList}>
                {group.children.map((link, i) => (
                  <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                    <SmartLink href={link.href} className={styles.megaLink} onClick={close}>
                      <span className={`${styles.megaIndex} num`}>{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className={styles.megaLabel}>{link.label}</span>
                        {NOTES.get(link.href) && <span className={styles.megaNote}>{NOTES.get(link.href)}</span>}
                      </span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      <div id={`${id}-sheet`} ref={sheetRef} className={styles.sheet} hidden={!mobileOpen} data-lenis-prevent>
        <div className={`container ${styles.sheetInner}`}>
          {MAIN_NAV.map((group) =>
            group.children.length > 0 ? (
              <MobileGroup key={group.label} group={group} onNavigate={() => setMobileOpen(false)} />
            ) : group.href ? (
              <SmartLink key={group.label} href={group.href} className={styles.sheetLink} onClick={() => setMobileOpen(false)}>
                {group.label}
              </SmartLink>
            ) : null,
          )}
          <a href={LOGIN_URL} className={styles.sheetLink}>
            Login
          </a>
          <div className={`${styles.sheetCta} on-dark`}>
            <SmartLink href={DEMO_LINK.href} className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              <span>{DEMO_LINK.label}</span>
            </SmartLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const links: NavLink[] = [...(group.href ? [{ label: INTRO[group.label]?.overview ?? `All ${group.label.toLowerCase()}`, href: group.href }] : []), ...group.children];
  return (
    <div className={styles.group}>
      <button type="button" className={styles.sheetLink} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded((v) => !v)}>
        {group.label}
        <span className={styles.plus} aria-hidden="true" />
      </button>
      <ul id={id} className={styles.groupList} hidden={!expanded}>
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} onClick={onNavigate}>
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
