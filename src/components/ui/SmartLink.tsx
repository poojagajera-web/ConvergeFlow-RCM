"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToId } from "@/components/motion/SmoothScroll";

type SmartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link that turns same-page hash links ("/#pipeline", "#pipeline") into
 * smooth, header-aware scrolls and lets other links navigate normally.
 */
export function SmartLink({ href, onClick, ...rest }: SmartLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const [path, hash] = href.split("#");
    if (!hash) return;
    const samePage = path === "" || path === pathname;
    if (samePage && scrollToId(hash)) {
      event.preventDefault();
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
