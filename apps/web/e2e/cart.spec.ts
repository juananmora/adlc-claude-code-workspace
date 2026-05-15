import { expect, test } from "@playwright/test";

/**
 * Criterios: Carrito — añadir, drawer, página /cart, persistencia.
 *
 * El estado del carrito persiste en `localStorage` (key `byteforge-cart`).
 * Cada test parte de localStorage limpio para evitar interferencia entre
 * casos. Usamos `data-testid` consistentes:
 *   cart-button, cart-count, cart-drawer, cart-line, cart-line-qty,
 *   cart-line-remove, cart-total, add-to-cart.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("byteforge-cart"));
  await page.reload();

  // Esperamos a que el catálogo esté listo (mismo patrón que catalog.spec.ts).
  await expect
    .poll(async () => page.getByTestId("product-card").count(), { timeout: 10_000 })
    .toBeGreaterThan(0);
});

async function clickFirstAvailableAddToCart(page: import("@playwright/test").Page) {
  const buttons = page.getByTestId("add-to-cart").filter({ hasNotText: /Sin stock/i });
  await expect(buttons.first()).toBeVisible();
  await buttons.first().click();
}

test("añadir un producto desde una card actualiza el contador del header", async ({ page }) => {
  await clickFirstAvailableAddToCart(page);

  const count = page.getByTestId("cart-count");
  await expect(count).toBeVisible({ timeout: 5_000 });
  await expect(count).toHaveText("1");
});

test("abrir el drawer muestra el producto añadido", async ({ page }) => {
  await clickFirstAvailableAddToCart(page);
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  await page.getByTestId("cart-button").first().click();

  const drawer = page.getByTestId("cart-drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByTestId("cart-line")).toHaveCount(1);
});

test("ir a /cart y aumentar cantidad actualiza el total", async ({ page }) => {
  await clickFirstAvailableAddToCart(page);
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  await page.goto("/cart");

  const line = page.getByTestId("cart-line").first();
  await expect(line).toBeVisible();

  const initialTotal = await page.getByTestId("cart-total").innerText();

  await line.getByRole("button", { name: /Aumentar cantidad/i }).click();
  await expect(line.getByTestId("cart-line-qty")).toHaveText("2");

  await expect
    .poll(async () => (await page.getByTestId("cart-total").innerText()) !== initialTotal, {
      timeout: 3_000,
    })
    .toBe(true);
});

test("eliminar línea deja el carrito vacío", async ({ page }) => {
  await clickFirstAvailableAddToCart(page);
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  await page.goto("/cart");
  await page.getByTestId("cart-line-remove").first().click();

  await expect(page.getByText(/Tu carrito está vacío/i)).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveCount(0);
});

test("recargar tras añadir 2 productos mantiene el carrito (localStorage)", async ({ page }) => {
  const availableButtons = page
    .getByTestId("add-to-cart")
    .filter({ hasNotText: /Sin stock/i });

  await availableButtons.nth(0).click();
  // Damos un margen mínimo para que Zustand persiste antes de la segunda acción.
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  await availableButtons.nth(1).click();
  await expect(page.getByTestId("cart-count")).toHaveText("2");

  await page.reload();

  await expect(page.getByTestId("cart-count")).toHaveText("2", { timeout: 5_000 });

  await page.goto("/cart");
  await expect(page.getByTestId("cart-line")).toHaveCount(2);
});
