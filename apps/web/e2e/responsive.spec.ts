import { expect, test } from "@playwright/test";

/**
 * Criterio: Frontend — Diseño responsive básico.
 * Smoke test: viewport móvil 375x812, el header sigue siendo accesible
 * (logo visible y enlace a inicio funcional).
 */
test("header accesible en viewport móvil (375px)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  // El logo/enlace "Inicio IRON DECK" debe seguir visible.
  const homeLink = page.getByLabel("Inicio IRON DECK");
  await expect(homeLink).toBeVisible();

  // La nav desktop está oculta (md:flex) — no es bug si no aparece;
  // lo importante es que el header global (header role banner) sí esté.
  await expect(page.getByRole("banner")).toBeVisible();

  // Hero h1 visible (puede romper línea pero debe verse).
  await expect(
    page.getByRole("heading", { level: 1, name: /Equipos que rinden/i }),
  ).toBeVisible();
});
