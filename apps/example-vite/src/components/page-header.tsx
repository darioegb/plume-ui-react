import type { ReactNode } from "react";
import styles from "./page-header.module.css";

export function PageHeader({
  description,
  title,
}: Readonly<{ description: string; title: string }>): ReactNode {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
