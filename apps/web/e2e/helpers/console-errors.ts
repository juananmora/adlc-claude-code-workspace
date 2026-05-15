import type { ConsoleMessage, Page } from "@playwright/test";

/**
 * Patrones de errores que Next dev/devtools emiten como "ruido" y no indican
 * bugs reales del producto. Filtramos para que el assertion sea estricto
 * sobre errores genuinos sin volverse falso-positivo en local.
 */
const NOISE_PATTERNS: RegExp[] = [
  /segment-explorer-node/i,
  /react devtools/i,
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  /webpack-hmr/i,
  // Imágenes externas (Unsplash) que ocasionalmente devuelven 4xx; no es bug nuestro.
  /Failed to load resource.*unsplash/i,
];

export interface ConsoleErrorCollector {
  errors: string[];
  pageErrors: Error[];
}

export function collectConsoleErrors(page: Page): ConsoleErrorCollector {
  const collector: ConsoleErrorCollector = { errors: [], pageErrors: [] };

  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (NOISE_PATTERNS.some((re) => re.test(text))) return;
    collector.errors.push(text);
  });

  page.on("pageerror", (err: Error) => {
    if (NOISE_PATTERNS.some((re) => re.test(err.message))) return;
    collector.pageErrors.push(err);
  });

  return collector;
}
