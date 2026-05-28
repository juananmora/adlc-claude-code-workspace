import { expect, test } from "@playwright/test";
import { collectConsoleErrors } from "./helpers/console-errors";

/**
 * Criterios: Frontend — Catálogo Tours (iteración 12).
 *
 * Estrategia (espeja `consoles.spec.ts` línea a línea):
 *   - `data-testid="tour-card"` para localizar cards.
 *   - `data-tour-id="<id>"` para cards específicas.
 *   - `data-decade="<n>"` para validar el filtro por década con exactitud.
 *   - Esperamos a la respuesta HTTP de `/tours?...` antes de medir el DOM.
 *
 * Sincronización:
 *   - El grid tiene debounce 250ms en el effect. `waitForResponse` se ARMA
 *     antes del `.fill()` o `.click()` para no perder el evento.
 *   - Para acciones que disparan reset (desactivar chip), evitamos
 *     `waitForResponse` y esperamos por el cambio visible (`aria-pressed`,
 *     count del grid). Mismo razonamiento que consoles/albums/games.
 *
 * Conteos derivados de `apps/api/src/data/tours.ts` (verificados):
 *   - Total: 10 tours.
 *   - decade=1990 → 5 tours (clash-of-the-titans, cowboys-from-hell-tour,
 *     use-your-illusion-tour, black-album-tour, ozzfest-1996).
 *   - "Justice" en name → solo "Damaged Justice Tour" (1 match).
 *
 * Suscripción a errores de consola del navegador: cada test crea su propio
 * collector con `collectConsoleErrors(page)` y assertea cero errores reales
 * (con filtro de ruido conocido en `helpers/console-errors.ts`).
 */

test.describe("listado", () => {
  test("navegar a /tours muestra h1 con 'Tours' y 10 cards, cero errores de consola", async ({
    page,
  }) => {
    const consoleErrors = collectConsoleErrors(page);

    await page.goto("/tours");

    // h1 con "Tours" (mayúsculas en el render, comparación case-insensitive).
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/tours/i);

    // Región del catálogo accesible por aria-label.
    await expect(
      page.getByRole("region", { name: /Catálogo de tours/i }),
    ).toBeVisible();

    // 10 cards (el SSR puede tardar; usamos poll con timeout amplio).
    const cards = page.getByTestId("tour-card");
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
  test("link 'Tours' del header navega desde / a /tours", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: /Principal/i })
      .getByRole("link", { name: "Tours" })
      .click();

    await expect(page).toHaveURL(/\/tours$/);

    const cards = page.getByTestId("tour-card");
    await expect
      .poll(async () => cards.count(), { timeout: 10_000 })
      .toBe(10);
  });
});

test.describe("buscador", () => {
  test("buscar 'Justice' filtra a cards cuyo name lo contenga", async ({
    page,
  }) => {
    await page.goto("/tours");
    await expect
      .poll(async () => page.getByTestId("tour-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const search = page.getByTestId("tour-search-input");

    // CRÍTICO: armar waitForResponse ANTES de .fill() — debounce 250ms.
    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/tours?") &&
        r.url().toLowerCase().includes("q=justice") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await search.fill("Justice");
    await respPromise;

    const cards = page.getByTestId("tour-card");

    // "Justice" matchea Damaged Justice Tour. >=1 resultado y todas con
    // "justice" (case-insensitive) en el h3.
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(1);

    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const name = (await cards.nth(i).locator("h3").innerText()).toLowerCase();
      expect(name, `card[${i}] name contiene 'justice'`).toContain("justice");
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

test.describe("chips de década", () => {
  test("chip 90s deja solo cards con data-decade='1990' y aria-pressed correcto", async ({
    page,
  }) => {
    await page.goto("/tours");
    await expect
      .poll(async () => page.getByTestId("tour-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const chip = page.getByTestId("tour-decade-chip-1990");
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/tours?") &&
        r.url().includes("decade=1990") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await respPromise;

    await expect(chip).toHaveAttribute("aria-pressed", "true");

    const cards = page.getByTestId("tour-card");
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(2);

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const decade = await cards.nth(i).getAttribute("data-decade");
      expect(decade, `card[${i}] data-decade`).toBe("1990");
    }
  });

  test("click otra vez en chip 90s lo deselecciona y vuelven 10 cards", async ({
    page,
  }) => {
    await page.goto("/tours");
    await expect
      .poll(async () => page.getByTestId("tour-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const chip = page.getByTestId("tour-decade-chip-1990");

    // Activación: esperamos por la red para garantizar que el estado activo
    // se ha aplicado.
    const activatePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/tours?") &&
        r.url().includes("decade=1990") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await activatePromise;
    await expect(chip).toHaveAttribute("aria-pressed", "true");

    // Segunda activación: el chip vuelve a "all". La nueva request NO lleva
    // `decade=`. Esperamos por el cambio visible (aria-pressed) — el
    // race click → debounce 250ms → fetch no es estable con waitForResponse.
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const todasChip = page.getByTestId("tour-decade-chip-todas");
    await expect(todasChip).toHaveAttribute("aria-pressed", "true");

    const cards = page.getByTestId("tour-card");
    await expect
      .poll(async () => cards.count(), { timeout: 8_000 })
      .toBe(10);
  });
});

test.describe("ficha de tour", () => {
  test("/tours/world-slavery-tour muestra h1, breadcrumb, dl con 5 metadatos y descripción >=200 chars", async ({
    page,
  }) => {
    await page.goto("/tours/world-slavery-tour");

    // h1 con el nombre exacto.
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("World Slavery Tour");

    // Breadcrumb con link a /tours.
    const breadcrumb = page.getByRole("navigation", { name: /migas/i });
    await expect(breadcrumb).toBeVisible();
    const breadcrumbLink = breadcrumb.getByRole("link", { name: /tours/i });
    await expect(breadcrumbLink).toHaveAttribute("href", "/tours");

    // <dl> con exactamente 5 <dt>: BANDA, AÑO, DÉCADA, ÁLBUM PROMOCIONADO,
    // FECHAS. Los textos están en mayúsculas en el render.
    const dl = page.locator("dl").first();
    const dts = dl.locator("dt");
    await expect(dts).toHaveCount(5);

    // Verificamos los 5 nombres (case-insensitive).
    const dtTexts = (await dts.allInnerTexts()).map((t) =>
      t.trim().toLowerCase(),
    );
    expect(dtTexts).toContain("banda");
    expect(dtTexts).toContain("año");
    expect(dtTexts).toContain("década");
    expect(dtTexts).toContain("álbum promocionado");
    expect(dtTexts).toContain("fechas");

    // Descripción visible.
    const descSection = page.locator(
      "section[aria-labelledby='description-title']",
    );
    await expect(descSection).toBeVisible();

    // El <p> bajo description-title debe tener >= 200 chars.
    const descText = await descSection.locator("p").first().innerText();
    expect(descText.trim().length).toBeGreaterThanOrEqual(200);
  });

  test("/tours/black-album-tour renderiza ficha completa con metadatos esperados", async ({
    page,
  }) => {
    await page.goto("/tours/black-album-tour");

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("Wherever I May Roam");

    const dl = page.locator("dl").first();
    await expect(dl.locator("dt")).toHaveCount(5);

    const descSection = page.locator(
      "section[aria-labelledby='description-title']",
    );
    const descText = await descSection.locator("p").first().innerText();
    expect(descText.trim().length).toBeGreaterThanOrEqual(200);
  });

  test("click en una card lleva a /tours/<id> y muestra ficha completa", async ({
    page,
  }) => {
    await page.goto("/tours");
    await expect
      .poll(async () => page.getByTestId("tour-card").count(), {
        timeout: 10_000,
      })
      .toBe(10);

    const firstLink = page
      .getByTestId("tour-card")
      .first()
      .getByRole("link", { name: /Ver detalle de/i });
    await expect(firstLink).toBeVisible();
    await firstLink.click();

    await expect(page).toHaveURL(/\/tours\/[a-z0-9-]+/);

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

    // El <p> bajo description-title debe tener >= 200 chars.
    const descText = await descSection.locator("p").first().innerText();
    expect(descText.trim().length).toBeGreaterThanOrEqual(200);
  });
});

test.describe("404", () => {
  test("/tours/unknown-xxx renderiza not-found con link a /tours", async ({
    page,
  }) => {
    await page.goto("/tours/unknown-xxx");

    // El not-found.tsx muestra h1 "Tour no encontrado".
    await expect(
      page.getByRole("heading", { level: 1, name: /tour no encontrado/i }),
    ).toBeVisible();

    // Link "Volver a Tours" apunta a /tours.
    const link = page.getByRole("link", { name: /volver a tours/i });
    await expect(link).toHaveAttribute("href", "/tours");
  });
});
