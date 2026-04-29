"use client";

import { useEffect } from "react";

/**
 * Strips attributes injected into the DOM by common browser extensions
 * (Bitdefender, Grammarly, etc.) that run before React hydrates and cause
 * hydration mismatches. Mounts as a no-op client component so it runs
 * AFTER initial hydration, avoiding self-inflicted mismatches.
 */
const ATTR_NAMES = [
  "bis_skin_checked",
  "bis_register",
  "__processed_",
  "data-gr-ext-installed",
  "data-new-gr-c-s-check-loaded",
  "cz-shortcut-listen",
];

const ATTR_PREFIXES = ["bis_", "__processed", "data-gr", "data-new-gr"];

function stripKnownAttrs(el: Element) {
  for (const attr of Array.from(el.attributes)) {
    if (
      ATTR_NAMES.includes(attr.name) ||
      ATTR_PREFIXES.some((p) => attr.name.startsWith(p))
    ) {
      el.removeAttribute(attr.name);
    }
  }
}

export function ExtensionAttrCleaner() {
  useEffect(() => {
    document.querySelectorAll("*").forEach(stripKnownAttrs);
    const observer = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && m.target instanceof Element) {
          const name = m.attributeName ?? "";
          if (
            ATTR_NAMES.includes(name) ||
            ATTR_PREFIXES.some((p) => name.startsWith(p))
          ) {
            m.target.removeAttribute(name);
          }
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
