import styles from "./FloodLayer.module.css";

/**
 * The layers that turn a card light on hover: a white disc that grows from
 * where the pointer entered, a soft light under the pointer and a teal line
 * along the top edge. The card needs `data-flood`, `data-glow` (pointer light)
 * and setFloodOrigin on pointer enter/leave, plus position: relative,
 * overflow: hidden and isolation: isolate.
 */
export function FloodLayer() {
  return (
    <>
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.edge} aria-hidden="true" />
    </>
  );
}
