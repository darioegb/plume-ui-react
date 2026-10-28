import type { ReactNode } from "react";
import { Heading, Text } from "plume-ui-react";
import styles from "./page-header.module.css";

export function PageHeader({
  description,
  title,
}: Readonly<{ description: string; title: string }>): ReactNode {
  return (
    <header className={styles.header}>
      <Heading level={1} size={3}>
        {title}
      </Heading>
      <Text muted>{description}</Text>
    </header>
  );
}
