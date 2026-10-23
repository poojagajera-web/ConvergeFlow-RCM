"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { ButtonLink } from "@/components/ui/Button";
import { getLenis } from "@/components/motion/SmoothScroll";
import { DEMO_LINK, LOGIN_LABEL, LOGIN_URL, MAIN_NAV, type NavGroup, type NavLink } from "@/content/navigation";
import { Icon } from "@/components/site/Icon";
import { STAGE_ICONS } from "@/components/services/stageMeta";
import { STAGES } from "@/content/site/services";
import type { IconName } from "@/content/site/types";
import styles from "./Header.module.css";

const hasMenu = (g: NavGroup) => g.columns.some((c) => c.links.length > 0);
const DROPDOWNS = MAIN_NAV.filter(hasMenu);

/** An icon for each menu link: the stage icons for services, then the audiences and the delivery pages. */
const LINK_ICONS: Record<string, IconName> = {
  ...Object.fromEntries(STAGES.map((st, i) => [st.href, STAGE_ICONS[i]])),
  "/industries/dental/": "tooth",
  "/industries/dso/": "building",
  "/industries/medical/": "steth",
  "/how-it-works/": "route",
  "/technology/": "link",
  "/technology/opendental/": "layers",
  "/technology/security/": "lock",
};
type MenuKey = string;

/** An up-right arrow, for the links in the mega menu. */
function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  );
}

/** A right arrow, for the overview and footer links. */
function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

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
          <Logo tone="light" width={188} priority />
        </SmartLink>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {MAIN_NAV.map((group) =>
              hasMenu(group) ? (
                <li key={group.label} onMouseEnter={() => openWithIntent(group.label)} onMouseLeave={closeWithIntent}>
                  <button
                    type="button"
                    className={styles.navItem}
                    data-current={inGroup(group, pathname) || undefined}
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
                  <SmartLink href={group.href} className={styles.navItem} data-current={inGroup(group, pathname) || undefined} aria-current={pathname === group.href ? "page" : undefined} onClick={close}>
                    {group.label}
                  </SmartLink>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* opens in a new tab, so the site stays open behind it */}
          <a href={LOGIN_URL} className={styles.login} target="_blank" rel="noopener">
            {LOGIN_LABEL}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <ButtonLink href={DEMO_LINK.href} size="sm" className={styles.cta} onClick={close}>
            {DEMO_LINK.label}
          </ButtonLink>
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
        const intro = group.intro;
        const columns = group.columns.filter((c) => c.links.length > 0);
        let n = 0;
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
              <div className={styles.megaPanel}>
                <div className={styles.megaIntro}>
                  <span className={styles.megaGlow} aria-hidden="true" />
                  <p className={styles.megaKicker}>{group.label}</p>
                  {intro && <p className={styles.megaTitle}>{intro.title}</p>}
                  {intro && <p className={styles.megaBody}>{intro.body}</p>}
                  <p className={styles.megaCount} aria-hidden="true">
                    <b>{String(columns.reduce((t, c) => t + c.links.length, 0)).padStart(2, "0")}</b>
                    {group.label === "Services" ? "stages" : "pages"}
                  </p>
                  {/* the overview link, unless a link below already goes there (How It Works) */}
                  {group.href && !columns.some((c) => c.links.some((l) => l.href === group.href)) && (
                    <SmartLink href={group.href} className={styles.megaOverview} onClick={close}>
                      {intro?.overview ?? `All ${group.label.toLowerCase()}`}
                      <span className={styles.megaArrow} aria-hidden="true">
                        <ArrowRight />
                      </span>
                    </SmartLink>
                  )}
                </div>
                <div className={styles.megaCols} data-cols={columns.length}>
                  {columns.map((col, ci) => (
                    <div key={col.label} className={styles.megaCol}>
                      <p className={styles.megaColLabel}>
                        {columns.length > 1 && <span>{String(ci + 1).padStart(2, "0")}</span>}
                        {col.label}
                      </p>
                      <ul className={styles.megaList}>
                        {col.links.map((link) => {
                          n += 1;
                          return (
                            <li key={link.href} style={{ "--i": n } as React.CSSProperties}>
                              <SmartLink href={link.href} className={styles.megaLink} aria-current={link.href === pathname ? "page" : undefined} onClick={close}>
                                <span className={styles.megaIcon} aria-hidden="true">
                                  <Icon name={LINK_ICONS[link.href] ?? "check"} />
                                </span>
                                <span className={styles.megaText}>
                                  <span className={styles.megaLabel}>{link.label}</span>
                                  {link.note && <span className={styles.megaNote}>{link.note}</span>}
                                </span>
                                {/* two arrows: on hover the first flies out up-right and the second slides in */}
                                <span className={styles.megaGo} aria-hidden="true">
                                  <ArrowUpRight />
                                  <ArrowUpRight />
                                </span>
                              </SmartLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className={styles.megaFoot}>
                  <p>Not sure where to start? We&rsquo;ll walk through your workflow.</p>
                  <SmartLink href={DEMO_LINK.href} className={styles.megaFootLink} onClick={close}>
                    {DEMO_LINK.label}
                    <span className={styles.megaArrow} aria-hidden="true">
                      <ArrowRight />
                    </span>
                  </SmartLink>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div id={`${id}-sheet`} ref={sheetRef} className={styles.sheet} hidden={!mobileOpen} data-lenis-prevent>
        <div className={`container ${styles.sheetInner}`}>
          {MAIN_NAV.map((group) =>
            hasMenu(group) ? (
              <MobileGroup key={group.label} group={group} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            ) : group.href ? (
              <SmartLink
                key={group.label}
                href={group.href}
                className={styles.sheetLink}
                data-current={inGroup(group, pathname) || undefined}
                aria-current={pathname === group.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {group.label}
              </SmartLink>
            ) : null,
          )}
          <a href={LOGIN_URL} className={styles.sheetLink} target="_blank" rel="noopener">
            {LOGIN_LABEL}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <div className={`${styles.sheetCta} on-dark`}>
            <ButtonLink href={DEMO_LINK.href} onClick={() => setMobileOpen(false)}>
              {DEMO_LINK.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ group, pathname, onNavigate }: { group: NavGroup; pathname: string; onNavigate: () => void }) {
  const current = inGroup(group, pathname);
  // the current page's group starts open
  const [expanded, setExpanded] = useState(current);
  const id = useId();
  const links: NavLink[] = [
    ...(group.href ? [{ label: group.intro?.overview ?? `All ${group.label.toLowerCase()}`, href: group.href }] : []),
    ...group.columns.flatMap((c) => c.links).filter((l) => l.href !== group.href),
  ];
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.sheetLink}
        data-current={current || undefined}
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
      >
        {group.label}
        <span className={styles.plus} aria-hidden="true" />
      </button>
      <ul id={id} className={styles.groupList} hidden={!expanded}>
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} aria-current={link.href === pathname ? "page" : undefined} onClick={onNavigate}>
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** True when the current page is the group's own page or one of the pages in its menu. */
function inGroup(group: NavGroup, pathname: string) {
  if (group.href && (pathname === group.href || pathname.startsWith(group.href))) return true;
  return group.columns.some((c) => c.links.some((l) => l.href === pathname));
}

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
