"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { getLenis } from "@/components/motion/SmoothScroll";
import {
  INDUSTRIES_OVERVIEW,
  INDUSTRY_LINKS,
  PRIMARY_NAV,
  RESOURCE_LINKS,
  SERVICES_OVERVIEW,
  SERVICE_LINKS,
  resolveHref,
  type NavLink,
} from "@/content/navigation";
import styles from "./Header.module.css";

type MenuKey = "services" | "industries" | "resources";

const MEGA: Record<Exclude<MenuKey, "resources">, { label: string; title: string; body: string; overview: NavLink; links: NavLink[] }> = {
  services: {
    label: "Services",
    title: "Eight pillars. One closed loop.",
    body: "From intake to zero-balance reconciliation, every RCM step runs on the same orchestration engine.",
    overview: SERVICES_OVERVIEW,
    links: SERVICE_LINKS,
  },
  industries: {
    label: "Industries",
    title: "Built around how your practice bills.",
    body: "Dental, medical, specialty and enterprise workflows — integrated with the PMS and EHR you already run.",
    overview: INDUSTRIES_OVERVIEW,
    links: INDUSTRY_LINKS,
  },
};

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function href(link: NavLink) {
  return resolveHref(link) ?? "/";
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
        const trigger = headerRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${open}"]`);
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
      requestAnimationFrame(() => document.getElementById(`${id}-${key}`)?.querySelector<HTMLElement>("a")?.focus());
    }
  };

  const solid = scrolled || open !== null;
  const tone = solid ? "dark" : "light";

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-solid={solid || undefined}
      data-hidden={(hidden && !open && !mobileOpen) || undefined}
      data-mobile-open={mobileOpen || undefined}
    >
      <div className={`container ${styles.bar}`}>
        <SmartLink href="/" className={styles.brand} aria-label="ConvergeFlow home">
          <Logo tone={mobileOpen ? "light" : tone} width={164} priority />
        </SmartLink>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {(["services", "industries"] as const).map((key) => (
              <li key={key} onMouseEnter={() => openWithIntent(key)} onMouseLeave={closeWithIntent}>
                <button
                  type="button"
                  className={styles.navItem}
                  aria-expanded={open === key}
                  aria-controls={`${id}-${key}`}
                  data-menu-trigger={key}
                  onClick={() => setOpen(open === key ? null : key)}
                  onKeyDown={onTriggerKey(key)}
                >
                  {MEGA[key].label}
                  <Chevron />
                </button>
              </li>
            ))}
            <li>
              <SmartLink href={href(PRIMARY_NAV.technology)} className={styles.navItem} onClick={close}>
                {PRIMARY_NAV.technology.label}
              </SmartLink>
            </li>
            <li>
              <SmartLink href={href(PRIMARY_NAV.outcomes)} className={styles.navItem} onClick={close}>
                {PRIMARY_NAV.outcomes.label}
              </SmartLink>
            </li>
            <li className={styles.dropdownHost} onMouseEnter={() => openWithIntent("resources")} onMouseLeave={closeWithIntent}>
              <button
                type="button"
                className={styles.navItem}
                aria-expanded={open === "resources"}
                aria-controls={`${id}-resources`}
                data-menu-trigger="resources"
                onClick={() => setOpen(open === "resources" ? null : "resources")}
                onKeyDown={onTriggerKey("resources")}
              >
                Resources
                <Chevron />
              </button>
              <div id={`${id}-resources`} className={styles.dropdown} data-open={open === "resources" || undefined} hidden={open !== "resources"}>
                <ul>
                  {RESOURCE_LINKS.map((link, i) => (
                    <li key={link.label} style={{ "--i": i } as React.CSSProperties}>
                      <SmartLink href={href(link)} className={styles.dropLink} onClick={close}>
                        <span className={styles.dropLabel}>{link.label}</span>
                        <span className={styles.dropNote}>{link.note}</span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <SmartLink href={href(PRIMARY_NAV.demo)} className={`btn btn-primary ${styles.cta}`} onClick={close}>
            <span>{PRIMARY_NAV.demo.label}</span>
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

      {(["services", "industries"] as const).map((key) => {
        const menu = MEGA[key];
        return (
          <div
            key={key}
            id={`${id}-${key}`}
            className={styles.mega}
            data-open={open === key || undefined}
            hidden={open !== key}
            onMouseEnter={() => openWithIntent(key)}
            onMouseLeave={closeWithIntent}
          >
            <div className={`container ${styles.megaInner}`}>
              <div className={styles.megaIntro}>
                <p className="eyebrow">{menu.label}</p>
                <p className={styles.megaTitle}>{menu.title}</p>
                <p className={styles.megaBody}>{menu.body}</p>
                <SmartLink href={href(menu.overview)} className="link-arrow" onClick={close}>
                  {menu.overview.label} <span aria-hidden="true">→</span>
                </SmartLink>
              </div>
              <ul className={styles.megaList}>
                {menu.links.map((link, i) => (
                  <li key={link.label} style={{ "--i": i } as React.CSSProperties}>
                    <SmartLink href={href(link)} className={styles.megaLink} onClick={close}>
                      <span className={`${styles.megaIndex} num`}>{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className={styles.megaLabel}>{link.label}</span>
                        <span className={styles.megaNote}>{link.note}</span>
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
          <MobileGroup title="Services" links={[SERVICES_OVERVIEW, ...SERVICE_LINKS]} onNavigate={() => setMobileOpen(false)} />
          <MobileGroup title="Industries" links={[INDUSTRIES_OVERVIEW, ...INDUSTRY_LINKS]} onNavigate={() => setMobileOpen(false)} />
          <SmartLink href={href(PRIMARY_NAV.technology)} className={styles.sheetLink} onClick={() => setMobileOpen(false)}>
            {PRIMARY_NAV.technology.label}
          </SmartLink>
          <SmartLink href={href(PRIMARY_NAV.outcomes)} className={styles.sheetLink} onClick={() => setMobileOpen(false)}>
            {PRIMARY_NAV.outcomes.label}
          </SmartLink>
          <MobileGroup title="Resources" links={RESOURCE_LINKS} onNavigate={() => setMobileOpen(false)} />
          <div className={`${styles.sheetCta} on-dark`}>
            <SmartLink href={href(PRIMARY_NAV.demo)} className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              <span>{PRIMARY_NAV.demo.label}</span>
            </SmartLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ title, links, onNavigate }: { title: string; links: NavLink[]; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <div className={styles.group}>
      <button type="button" className={styles.sheetLink} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded((v) => !v)}>
        {title}
        <span className={styles.plus} aria-hidden="true" />
      </button>
      <ul id={id} className={styles.groupList} hidden={!expanded}>
        {links.map((link) => (
          <li key={link.label}>
            <SmartLink href={href(link)} onClick={onNavigate}>
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
