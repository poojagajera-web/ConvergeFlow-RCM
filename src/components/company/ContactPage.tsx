"use client";

import { useRef, useState } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import { DEMO_LINK, LOGIN_LABEL, LOGIN_URL } from "@/content/navigation";
import { CONTACT } from "@/content/site/company";
import type { IconName, Section, SitePage } from "@/content/site/types";
import { Aurora } from "@/components/fx/Aurora";
import { FloodLayer } from "@/components/fx/FloodLayer";
import { setFloodOrigin } from "@/components/fx/flood";
import { Icon } from "@/components/site/Icon";
import { SiteSection } from "@/components/site/Sections";
import { SectionHead } from "@/components/site/Title";
import { HeroCopy, useHeroIntro } from "@/components/services/InnerPage";
import { pad } from "@/components/services/stageMeta";
import inner from "@/components/services/InnerPage.module.css";
import styles from "./ContactPage.module.css";

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;

const flood = { "data-flood": "", "data-glow": "", onPointerEnter: setFloodOrigin, onPointerLeave: setFloodOrigin };

const FIRST = CONTACT.name.split(" ")[0];
const INITIALS = CONTACT.name
  .split(" ")
  .map((w) => w[0])
  .join("");
const SUBJECT = "Managed RCM enquiry";
const MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(SUBJECT)}`;

/** Where each door leads: practices write to the contact, clients sign in, patients go to their practice. */
const DOOR_ACTION: Partial<Record<IconName, { label: string; href: string; newTab?: boolean }>> = {
  building: { label: `Email ${FIRST}`, href: MAILTO },
  users: { label: LOGIN_LABEL, href: LOGIN_URL, newTab: true },
};

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

/** A copy-to-clipboard button that says "Copied" for a moment. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={styles.copy}
      data-done={done || undefined}
      aria-label={done ? `${label} copied` : `Copy ${label}`}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1800);
        });
      }}
    >
      <Icon name={done ? "check" : "copy"} />
      <span aria-hidden="true">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ hero */

type Channel = { key: string; icon: IconName; kicker: string; value: string; sub: string; action: { label: string; href: string }; copy?: { value: string; label: string } };

const CHANNELS: Channel[] = [
  {
    key: "email",
    icon: "mail",
    kicker: "Email",
    value: CONTACT.email,
    sub: "Questions about managed RCM, scope and proposals.",
    action: { label: `Write to ${FIRST}`, href: MAILTO },
    copy: { value: CONTACT.email, label: "email address" },
  },
  {
    key: "phone",
    icon: "phone",
    kicker: "Phone",
    value: CONTACT.phone,
    sub: `Talk to ${FIRST} directly about your practice.`,
    action: { label: "Call now", href: `tel:${CONTACT.tel}` },
    copy: { value: CONTACT.phone, label: "phone number" },
  },
  {
    key: "demo",
    icon: "calendar",
    kicker: "Walkthrough",
    value: "Request a demo",
    sub: "We'll walk through how the team would handle your revenue cycle.",
    action: { label: DEMO_LINK.label, href: DEMO_LINK.href },
  },
];

/**
 * Contact hero: the headline centred, then
 * three ways to reach the team as large tiles (email, phone, a walkthrough),
 * each with its own action and a copy button, and a strip naming who you'll
 * talk to. Tiles turn light when pointed at.
 */
function ContactHero({ page }: { page: SitePage }) {
  const ref = useRef<HTMLElement>(null);
  useHeroIntro(ref);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.from(root.querySelectorAll("[data-tile]"), { opacity: 0, y: 70, rotateX: 14, duration: 1.5, stagger: 0.12, clearProps: "opacity,transform" }, 0.8).from(
      root.querySelector("[data-strip]"),
      { opacity: 0, y: 20, duration: 1, clearProps: "opacity,transform" },
      1.3,
    );
    return onSiteReady(() => tl.play());
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="page-title">
      <div className={inner.heroBg} aria-hidden="true">
        <span className={inner.heroAurora} data-aurora>
          <Aurora green={0.5} />
        </span>
        <span className={inner.heroGrid} />
      </div>

      <div className="container">
        <div className={styles.heroCopy}>
          <HeroCopy page={page} center actions={false} />
        </div>

        <ul className={styles.tiles} aria-label="Ways to reach the team">
          {CHANNELS.map((c, k) => (
            <li key={c.key} className={styles.tile} data-tile data-key={c.key} {...flood}>
              <FloodLayer />
              <div className={styles.tileTop}>
                <span className={styles.tileIcon} aria-hidden="true">
                  <Icon name={c.icon} />
                </span>
                <span className={styles.tileNum} aria-hidden="true">
                  {pad(k + 1)}
                </span>
              </div>
              <p className={styles.tileKicker}>{c.kicker}</p>
              <p className={styles.tileValue}>{c.value}</p>
              <p className={styles.tileSub}>{c.sub}</p>
              <div className={styles.tileActions}>
                <a href={c.action.href} className={styles.tileGo}>
                  {c.action.label}
                  <Arrow />
                </a>
                {c.copy && <CopyButton value={c.copy.value} label={c.copy.label} />}
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.strip} data-strip>
          <span className={styles.avatar} aria-hidden="true">
            {INITIALS}
          </span>
          <p className={styles.stripText}>
            <span>Your contact</span>
            <b>{CONTACT.name}</b>
          </p>
          <span className={styles.stripRole}>Managed revenue cycle services</span>
          <p className={styles.stripWarn}>
            <Icon name="lock" />
            Please don&rsquo;t include patient data
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- three doors */

/**
 * "The right door for your question": three doors in lit frames. Pointing at
 * or focusing a door swings it fully open, a soft glow spreads across the
 * floor, and the room behind shows who it is for and where to go. On touch
 * screens and narrow ones the doorways stand open.
 */
function Doors({ s }: { s: Of<"cards"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap.from(root.querySelectorAll("[data-door]"), {
      opacity: 0,
      y: 60,
      duration: 1.3,
      stagger: 0.14,
      ease: "expo.out",
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: root.querySelector("[data-doors]"), start: "top 80%", once: true },
    });
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.doors}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="center" />
        <ul className={styles.doorRow} data-doors>
          {s.items.map((item, k) => {
            const action = item.icon ? DOOR_ACTION[item.icon] : undefined;
            return (
              <li key={item.title} className={styles.door} data-door>
                <span className={styles.lamp} aria-hidden="true" />
                <div className={styles.frame}>
                  <div className={styles.room}>
                    <span className={styles.roomIcon} aria-hidden="true">
                      {item.icon && <Icon name={item.icon} />}
                    </span>
                    <h3 className={styles.roomTitle}>{item.title}</h3>
                    <p className={styles.roomBody}>{item.body}</p>
                    {action ? (
                      <a href={action.href} className={styles.roomGo} {...(action.newTab ? { target: "_blank", rel: "noopener" } : {})}>
                        {action.label}
                        <Arrow />
                        {action.newTab && <span className="visually-hidden"> (opens in a new tab)</span>}
                      </a>
                    ) : (
                      <span className={styles.roomNote}>Please contact your practice</span>
                    )}
                  </div>
                  {/* the door leaf, hinged on the left */}
                  <span className={styles.leaf} aria-hidden="true">
                    <span className={styles.hinge} />
                    <span className={styles.hinge} />
                    <span className={styles.plate}>
                      <b>{pad(k + 1)}</b>
                      {item.title}
                    </span>
                    <span className={styles.knob} />
                  </span>
                </div>
                <span className={styles.spill} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Contact: the channel tiles and the three doors. */
export function ContactPage({ page }: { page: SitePage }) {
  return (
    <>
      <ContactHero page={page} />
      {page.sections.map((s, k) => {
        if (s.kind === "cards") return <Doors key={k} s={s} />;
        return <SiteSection key={k} s={s} />;
      })}
    </>
  );
}
