import { expect, test } from "@playwright/test";
import { collectConsoleErrors } from "./helpers/console-errors";

/**
 * Criterios: Frontend — Catálogo Consoles (iteración 10).
 *
 * Estrategia (espeja `games.spec.ts` y `albums.spec.ts`):
 *   - `data-testid="console-card"` para evitar colisión con otros artículos.
 *   - `data-console-id="<id>"` para localizar cards específicas (nintendo-64...).
 *   - `data-generation="<n>"` para validar filtros por generación con exactitud.
 *   - Esperamos a la respuesta HTTP de `/consoles?...` antes de medir el DOM.
 *
 * Sincronización:
 *   - El grid tiene debounce 250ms en el effect. `waitForResponse` se ARMA
 *     antes del `.fill()` o `.click()` para no perder el evento.
 *   - Para acciones que disparan un reset (desactivar chip), evitamos
 *     `waitForResponse` y esperamos por el cambio visible (`aria-pressed`,
 *     count del grid). Mismo razonamiento que albums/games.
 *
 * Conteos derivados de `apps/api/src/data/consoles.ts` (verificados):
 *   - Total: 10 consolas.
 *   - generation=5 → 2 consolas (playstation, nintendo-64).
 *   - "Nintendo" en name → NES (Nintendo Entertainment System) + Nintendo 64 = 2.
 *
 * Suscripción a errores de consola del navegador: cada test crea su propio
 * collector con `collectConsoleErrors(page)` y assertea cero errores reales
 * (con filtro de ruido conocido en `helpers/console-errors.ts`).
 */

test.describe("listado", () => {
  test("navegar a /consoles muestra h1 con 'Consolas' y 10 cards, cero errores de consola", async ({
    page,
  }) => {
    const consoleErrors = collectConsoleErrors(page);

    await page.goto("/consoles");

    // h1 con "Consolas" (mayúsculas en el render, comparación case-insensitive).
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/consolas/i);

    // Región del catálogo accesible por aria-label.
    await expect(
      page.getByRole("region", { name: /Catálogo de consolas/i }),
    ).toBeVisible();

    // 10 cards (el SSR puede tardar; usamos poll con timeout amplio).
    const cards = page.getByTestId("console-card");
    await expect
      .poll(async () => cards.count(), { timeout: 10_000 })
      .toBe(10);

    // Cero errores de consola del navegador. Tolerancia cero (con filtro de
    // ruido de Next devtools ya aplicado en el helper).
    expect(
      consoleErrors.errors,
      `errores de consola inesperados: ${consoleErrors.errors.join("\n")}`,
    ).toEqual([]);
    expect(
      consoleErrors.pageErrors.map((e) => e.message),
      `pageerror inesperados: ${consoleErrors.pageErrors.map((e) => e.message).join("\n")}`,
    ).toEqual([]);
  });
});

test.describe("header y navegación", () => {
  test("link 'Consolas' del header navega desde / a /consoles", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: /Principal/i })
      .getByRole("link", { name: "Consolas" })
      .click();

    await expect(page).toHaveURL(/\/consoles$/);

    const cards = page.getByTestId("console-card");
    await expect
      .poll(async () => cards.count(), { timeout: 10_000 })
      .toBe(10);
  });
});

test.describe("buscador", () => {
  test("buscar 'Nintendo' filtra a cards cuyo name lo contenga", async ({
    page,
  }) => {
    await page.goto("/consoles");
    await expect
      .poll(async () => page.getByTestId("console-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const search = page.getByTestId("console-search-input");

    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/consoles?") &&
        r.url().toLowerCase().includes("q=nintendo") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await search.fill("Nintendo");
    await respPromise;

    const cards = page.getByTestId("console-card");

    // El servidor decide qué hace match con "Nintendo". Verificamos que
    // al menos hay 1 resultado y que TODAS las cards visibles contienen
    // "nintendo" (case-insensitive) en su nombre.
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(1);

    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const name = (await cards.nth(i).locator("h3").innerText()).toLowerCase();
      expect(name, `card[${i}] name contiene 'nintendo'`).toContain("nintendo");
    }

    // Borrar el input → vuelven las 10. No esperamos a la red porque el
    // race entre fill('') y waitForResponse con debounce 250ms no es
    // estable; esperamos por el cambio visible (poll a 10).
    await search.fill("");
    await expect(search).toHaveValue("");
    await expect
      .poll(async () => cards.count(), { timeout: 8_000 })
      .toBe(10);
  });
});

test.describe("chips de generación", () => {
  test("chip Gen 5 deja solo cards con data-generation='5' y aria-pressed correcto", async ({
    page,
  }) => {
    await page.goto("/consoles");
    await expect
      .poll(async () => page.getByTestId("console-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const chip = page.getByTestId("console-gen-chip-5");
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/consoles?") &&
        r.url().includes("generation=5") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await respPromise;

    await expect(chip).toHaveAttribute("aria-pressed", "true");

    const cards = page.getByTestId("console-card");
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(2);

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const gen = await cards.nth(i).getAttribute("data-generation");
      expect(gen, `card[${i}] data-generation`).toBe("5");
    }
  });

  test("click otra vez en chip Gen 5 lo deselecciona y vuelven 10 cards", async ({
    page,
  }) => {
    await page.goto("/consoles");
    await expect
      .poll(async () => page.getByTestId("console-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const chip = page.getByTestId("console-gen-chip-5");

    // Activación: esperamos por la red para garantizar que el estado activo
    // se ha aplicado.
    const activatePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/consoles?") &&
        r.url().includes("generation=5") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await activatePromise;
    await expect(chip).toHaveAttribute("aria-pressed", "true");

    // Segunda activación: el chip vuelve a "all". `buildUrl` excluye
    // `generation` en ese caso, por lo que la nueva request NO lleva
    // `generation=`. Esperamos por el cambio visible (aria-pressed) — el
    // race click → debounce 250ms → fetch no es estable con waitForResponse.
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const todasChip = page.getByTestId("console-gen-chip-todas");
    await expect(todasChip).toHaveAttribute("aria-pressed", "true");

    const cards = page.getByTestId("console-card");
    await expect
      .poll(async () => cards.count(), { timeout: 8_000 })
      .toBe(10);
  });
});

test.describe("ficha de consola", () => {
  test("/consoles/nintendo-64 muestra h1, breadcrumb, dl con 5 metadatos y >=3 juegos icónicos", async ({
    page,
  }) => {
    await page.goto("/consoles/nintendo-64");

    // h1 con el nombre exacto.
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("Nintendo 64");

    // Breadcrumb con link a /consoles.
    const breadcrumb = page.getByRole("navigation", { name: /migas/i });
    await expect(breadcrumb).toBeVisible();
    const breadcrumbLink = breadcrumb.getByRole("link", { name: /consolas/i });
    await expect(breadcrumbLink).toHaveAttribute("href", "/consoles");

    // <dl> con exactamente 5 <dt>: FABRICANTE, AÑO, GENERACIÓN, MEDIA,
    // UNIDADES VENDIDAS. Los textos están en mayúsculas en el render.
    const dl = page.locator("dl").first();
    const dts = dl.locator("dt");
    await expect(dts).toHaveCount(5);

    // Verificamos los 5 nombres (case-insensitive por si cambia el casing
    // pero manteniendo el orden actual del render).
    const dtTexts = (await dts.allInnerTexts()).map((t) =>
      t.trim().toLowerCase(),
    );
    expect(dtTexts).toContain("fabricante");
    expect(dtTexts).toContain("año");
    expect(dtTexts).toContain("generación");
    expect(dtTexts).toContain("media");
    expect(dtTexts).toContain("unidades vendidas");

    // Sección de juegos icónicos: <ul> con >= 3 <li>.
    const iconicSection = page.locator(
      "section[aria-labelledby='iconic-games-title']",
    );
    await expect(iconicSection).toBeVisible();
    const items = iconicSection.locator("ul > li");
    await expect
      .poll(async () => items.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(3);
  });

  test("click en una card lleva a /consoles/<id> y muestra ficha completa", async ({
    page,
  }) => {
    await page.goto("/consoles");
    await expect
      .poll(async () => page.getByTestId("console-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const firstLink = page
      .getByTestId("console-card")
      .first()
      .getByRole("link", { name: /Ver detalle de/i });
    await expect(firstLink).toBeVisible();
    await firstLink.click();

    await expect(page).toHaveURL(/\/consoles\/[a-z0-9-]+/);

    // h1 visible.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // <dl> con 5 <dt>.
    const dl = page.locator("dl").first();
    await expect(dl.locator("dt")).toHaveCount(5);

    // Descripción visible.
    const descSection = page.locator(
      "section[aria-labelledby='description-title']",
    );
    await expect(descSection).toBeVisible();

    // El <p> bajo description-title debe tener >= 200 chars (criterio del
    // PRD: descripciones largas, no placeholders).
    const descText = await descSection.locator("p").first().innerText();
    expect(descText.trim().length).toBeGreaterThanOrEqual(200);
  });
});

test.describe("404", () => {
  test("/consoles/unknown-id-xxx renderiza not-found con link a /consoles", async ({
    page,
  }) => {
    await page.goto("/consoles/unknown-id-xxx");

    // El not-found.tsx muestra h1 "Consola no encontrada".
    await expect(
      page.getByRole("heading", { level: 1, name: /consola no encontrada/i }),
    ).toBeVisible();

    // Link "Volver a Consolas" apunta a /consoles.
    const link = page.getByRole("link", { name: /volver a consolas/i });
    await expect(link).toHaveAttribute("href", "/consoles");
  });
});
