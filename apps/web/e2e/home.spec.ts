import { expect, test } from "@playwright/test";
import { collectConsoleErrors } from "./helpers/console-errors";

/**
 * Criterio: Frontend — La landing carga.
 *
 * Regresión cubierta: el usuario reportó errores en navegador causados
 * por caché `.next` corrupta tras el desacoplamiento del backend.
 * Este test falla si vuelve a aparecer cualquier `console.error` o
 * `pageerror` no clasificado como ruido de devtools.
 */
test("home carga sin errores de consola", async ({ page }) => {
  const collector = collectConsoleErrors(page);

  const response = await page.goto("/");
  expect(response, "navegación a / debe devolver respuesta").not.toBeNull();
  expect(response!.status(), "home debe responder 200").toBe(200);

  // Selector clave: H1 del hero. Texto canónico IRON DECK
  // ("EQUIPOS QUE RINDEN. ENTREGADOS." — mayúsculas tras el rebrand).
  await expect(
    page.getByRole("heading", { level: 1, name: /Equipos que rinden/i }),
  ).toBeVisible();

  // Damos un margen para que se asienten posibles errores asíncronos.
  await page.waitForLoadState("networkidle");

  expect(
    collector.pageErrors,
    `pageerror inesperado: ${collector.pageErrors.map((e) => e.message).join(" | ")}`,
  ).toHaveLength(0);
  expect(
    collector.errors,
    `console.error inesperado: ${collector.errors.join(" | ")}`,
  ).toHaveLength(0);
});
