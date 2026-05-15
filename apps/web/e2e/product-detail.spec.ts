import { expect, test } from "@playwright/test";

/**
 * Criterios: Frontend — Ficha individual.
 */

test("navegar de catálogo a ficha muestra nombre, precio, specs y botón", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.getByRole("link", { name: /Ver detalle de /i }).first();
  await expect(firstCard).toBeVisible();

  // El aria-label tiene la forma "Ver detalle de <nombre>" → extraemos el nombre
  // para verificar luego en la ficha.
  const label = (await firstCard.getAttribute("aria-label")) ?? "";
  const productName = label.replace(/^Ver detalle de\s+/i, "").trim();
  expect(productName.length).toBeGreaterThan(0);

  await firstCard.click();

  await expect(page).toHaveURL(/\/products\/[a-z0-9-]+/);

  // Nombre como h1.
  await expect(
    page.getByRole("heading", { level: 1, name: productName }),
  ).toBeVisible();

  // Precio (con símbolo €) — formato es-ES, p.ej. "2.899,00 €".
  await expect(page.getByText(/€/).first()).toBeVisible();

  // Sección de especificaciones.
  await expect(
    page.getByRole("heading", { name: /Especificaciones/i }),
  ).toBeVisible();

  // Botón añadir al carrito (o "Sin stock" si está agotado, pero como botón).
  await expect(
    page.getByRole("button", { name: /Añadir al carrito|Sin stock/i }),
  ).toBeVisible();
});

test("producto inexistente renderiza página not-found", async ({ page }) => {
  await page.goto("/products/no-existe");
  await expect(
    page.getByRole("heading", { name: /Producto no encontrado/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Volver al cat[áa]logo/i }),
  ).toBeVisible();
});
