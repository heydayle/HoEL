"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * Registry component that collects styled-components styles during SSR
 * and injects them into the HTML head to prevent FOUC (Flash of Unstyled Content).
 * Must wrap the application in the root layout.
 * @param props - Registry props
 * @param props.children - The child components to render within the style context
 * @returns The children wrapped in a StyleSheetManager
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  /**
   * Lazily initialize the ServerStyleSheet to avoid re-creation on each render.
   * Using a lazy initializer ensures it's only created once per component lifecycle.
   */
  const [styledComponentsStyleSheet] = useState(
    () => new ServerStyleSheet()
  );

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
