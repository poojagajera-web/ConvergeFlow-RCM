"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getLenis } from "@/components/motion/SmoothScroll";
import styles from "./VideoDialog.module.css";

/** Trigger button + native modal dialog that lazy-loads the Vimeo player. */
export function VideoDialog({ label, title, src }: { label: string; title: string; src: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      getLenis()?.stop();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      getLenis()?.start();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {label}
      </Button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={title}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className={styles.frame}>
          <div className={styles.bar}>
            <p>{title}</p>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close video">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className={styles.player}>
            {open && <iframe title={title} src={src} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
          </div>
        </div>
      </dialog>
    </>
  );
}
