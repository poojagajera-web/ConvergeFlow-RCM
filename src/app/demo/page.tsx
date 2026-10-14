import type { Metadata } from "next";
import { DemoRequest } from "@/components/sections/DemoRequest";
import { MotionScope } from "@/components/motion/MotionScope";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Schedule a Demo | ConvergeFlow",
  description:
    "Book a 30-minute consultation with an RCM automation engineer. Get a free revenue cycle audit and see live PMS writeback on your payer mix.",
};

export default function DemoPage() {
  return (
    <div className={styles.page}>
      <div className={`${styles.band} on-dark`} aria-hidden="true" />
      <MotionScope>
        <DemoRequest headingLevel={1} index="" />
      </MotionScope>
    </div>
  );
}
