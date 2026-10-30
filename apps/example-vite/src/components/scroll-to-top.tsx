import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "plume-ui-react";
import { ArrowUpIcon } from "./icons";
import styles from "./scroll-to-top.module.css";

const THRESHOLD = 400;

export function ScrollToTop(): ReactNode {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = (): void => setVisible(window.scrollY > THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  const scrollToTop = (): void => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ behavior: reduce ? "auto" : "smooth", top: 0 });
  };

  return (
    <Button
      aria-label={t("preferences.scrollToTop")}
      className={styles.button}
      colorScheme="primary"
      onClick={scrollToTop}
      shape="pill"
      type="button"
    >
      <ArrowUpIcon />
    </Button>
  );
}
