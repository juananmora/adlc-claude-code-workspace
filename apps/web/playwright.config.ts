import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config para el catálogo de ordenadores.
 *
 * El usuario arranca API (:4000) y Web (:3001) a mano por ahora,
 * así que `webServer` queda comentado para no chocar con procesos vivos.
 * En CI lo gestionamos desde el workflow `e2e.yml`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // catálogo único, evita ruido de race conditions en logs
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // webServer: {
  //   command: "npm run dev",
  //   port: 3001,
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
});
