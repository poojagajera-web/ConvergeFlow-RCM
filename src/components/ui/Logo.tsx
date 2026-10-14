import Image from "next/image";

/** Brand wordmark. `tone="light"` is the white-text version for dark grounds. */
export function Logo({ tone = "dark", width = 176, priority = false }: { tone?: "dark" | "light"; width?: number; priority?: boolean }) {
  const src = tone === "light" ? "/assets/logos/convergeflow-dark.png" : "/assets/logos/convergeflow-light.png";
  return (
    <Image
      src={src}
      alt="ConvergeFlow"
      width={1024}
      height={177}
      priority={priority}
      sizes={`${width}px`}
      style={{ width, height: "auto" }}
    />
  );
}
