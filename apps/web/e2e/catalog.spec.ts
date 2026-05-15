import { expect, test } from "@playwright/test";

/**
 * Criterios: Frontend — Se muestran productos / Buscador funciona / Filtros funcionan.
 *
 * Estrategia anti-flakiness:
 *   - Selector `[data-testid="product-card"]` para evitar ambigüedad con otros h3
 *     o badges sueltos en la página.
 *   - Esperamos a la respuesta HTTP a `/products?...` antes de medir el DOM, en
 *     lugar de polling sobre texto: cubre la ventana del debounce + render.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: /Catálogo de productos/i }),
  ).toBeVisible();
  await expect
    .poll(async () => page.getByTestId("product-card").count(), { timeout: 10_000 })
    .toBeGreaterThan(0);
});

test("listado muestra al menos 10 productos", async ({ page }) => {
  const cards = page.getByTestId("product-card");
  await expect
    .poll(async () => cards.count(), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(10);
});

test("buscador filtra por 'ThinkPad'", async ({ page }) => {
  const search = page.getByLabel("Buscar productos");

  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/products?") &&
      r.url().toLowerCase().includes("q=thinkpad") &&
      r.status() === 200,
    { timeout: 8_000 },
  );
  await search.fill("ThinkPad");
  await respPromise;

  const cards = page.getByTestId("product-card");
  await expect
    .poll(async () => cards.count(), { timeout: 5_000 })
    .toBeGreaterThanOrEqual(1);

  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).innerText()).toLowerCase();
    expect(text, "cada card visible debería referenciar ThinkPad").toContain(
      "thinkpad",
    );
  }
});

test("filtro por categoría 'Portátiles' devuelve solo portátiles", async ({ page }) => {
  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/products?") &&
      r.url().includes("category=Portatiles") &&
      r.status() === 200,
    { timeout: 8_000 },
  );

  await page.getByLabel("Filtrar por categoría").click();
  await page.getByRole("option", { name: "Portátiles" }).click();
  await respPromise;

  const cards = page.getByTestId("product-card");
  const count = await cards.count();
  expect(count, "debería haber productos de la categoría Portátiles").toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const cat = await cards.nth(i).getAttribute("data-category");
    expect(cat).toBe("Portatiles");
  }
});

test("estado vacío permite limpiar filtros", async ({ page }) => {
  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/products?") &&
      r.url().toLowerCase().includes("q=xyzzy") &&
      r.status() === 200,
    { timeout: 8_000 },
  );
  await page.getByLabel("Buscar productos").fill("xyzzy-no-existe-zzz");
  await respPromise;

  await expect(
    page.getByText(/No hay productos que coincidan/i),
  ).toBeVisible({ timeout: 5_000 });

  const clear = page.getByRole("button", { name: /Limpiar filtros/i });
  await expect(clear).toBeVisible();

  await clear.click();

  await expect
    .poll(
      async () => page.getByTestId("product-card").count(),
      { timeout: 8_000 },
    )
    .toBeGreaterThanOrEqual(10);
});
