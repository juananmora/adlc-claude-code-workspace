import { expect, test } from "@playwright/test";

/**
 * Criterios: Frontend — Discos heavy metal.
 *
 * Misma estrategia que catalog.spec.ts:
 *   - `data-testid="album-card"` para no enredarse con otros h3 de la página.
 *   - `data-band="<band>"` para validar filtros por banda con exactitud.
 *   - Esperamos a la respuesta HTTP de `/albums?...` antes de medir el DOM.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/albums");
  await expect(
    page.getByRole("region", { name: /Catálogo de discos/i }),
  ).toBeVisible();
  await expect
    .poll(async () => page.getByTestId("album-card").count(), { timeout: 10_000 })
    .toBeGreaterThan(0);
});

test("menú 'Discos' del header lleva a /albums y muestra al menos 12 cards", async ({
  page,
}) => {
  // Partimos de home y navegamos vía el header para validar el link del menú.
  await page.goto("/");
  await page
    .getByRole("navigation", { name: /Principal/i })
    .getByRole("link", { name: "Discos" })
    .click();

  await expect(page).toHaveURL(/\/albums$/);

  const cards = page.getByTestId("album-card");
  await expect
    .poll(async () => cards.count(), { timeout: 10_000 })
    .toBeGreaterThanOrEqual(12);
});

test("filtro por banda 'Iron Maiden' deja solo cards con data-band='Iron Maiden'", async ({
  page,
}) => {
  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/albums?") &&
      r.url().includes("band=Iron") &&
      r.status() === 200,
    { timeout: 8_000 },
  );

  await page.getByLabel("Filtrar por banda").click();
  await page.getByRole("option", { name: "Iron Maiden" }).click();
  await respPromise;

  const cards = page.getByTestId("album-card");
  await expect
    .poll(async () => cards.count(), { timeout: 5_000 })
    .toBeGreaterThan(0);

  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const band = await cards.nth(i).getAttribute("data-band");
    expect(band).toBe("Iron Maiden");
  }
});

test("buscador 'Master' encuentra al menos 1 card", async ({ page }) => {
  const search = page.getByLabel("Buscar discos");

  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/albums?") &&
      r.url().toLowerCase().includes("q=master") &&
      r.status() === 200,
    { timeout: 8_000 },
  );
  await search.fill("Master");
  await respPromise;

  const cards = page.getByTestId("album-card");
  await expect
    .poll(async () => cards.count(), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(1);
});

test("ficha desde card muestra título h1 + tracklist con <ol> y >=5 <li>", async ({
  page,
}) => {
  const firstCard = page
    .getByTestId("album-card")
    .first()
    .getByRole("link", { name: /Ver detalle de /i });
  await expect(firstCard).toBeVisible();

  const label = (await firstCard.getAttribute("aria-label")) ?? "";
  const title = label.replace(/^Ver detalle de\s+/i, "").trim();
  expect(title.length).toBeGreaterThan(0);

  await firstCard.click();

  await expect(page).toHaveURL(/\/albums\/[a-z0-9-]+/);

  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();

  // Tracklist: el <ol> debe estar bajo la sección con heading "Tracklist".
  const tracklistSection = page.locator("section", {
    has: page.getByRole("heading", { name: /Tracklist/i }),
  });
  const ol = tracklistSection.locator("ol");
  await expect(ol).toBeVisible();

  const items = ol.locator("li");
  await expect
    .poll(async () => items.count(), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(5);
});
