import { test, expect } from "@playwright/test";

/**
 * Tests E2E para la página /about (iter-8).
 *
 * Cubre los REQ-CREDITS-1..10 del delta de spec en
 * openspec/changes/about-credits/specs/credits.md.
 *
 * /about NO consume API, así que no usa waitForResponse. Espera por
 * carga DOM con waitForLoadState/getByTestId.
 */

test.describe("/about — créditos del proyecto", () => {
  test("entrada 'About' en el header navega a /about y muestra h1", async ({
    page,
  }) => {
    await page.goto("/");
    const aboutLink = page
      .getByRole("navigation", { name: /Principal/i })
      .getByRole("link", { name: "About" });
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /About IRON DECK/i }),
    ).toBeVisible();
  });

  test("/about muestra >=32 credit-entry con data-id y data-kind válidos", async ({
    page,
  }) => {
    await page.goto("/about");
    const entries = page.getByTestId("credit-entry");
    await expect.poll(async () => entries.count()).toBeGreaterThanOrEqual(32);

    const count = await entries.count();
    // Spot check: cada entry tiene data-id no vacío y data-kind ∈ {album,game}
    for (let i = 0; i < count; i++) {
      const id = await entries.nth(i).getAttribute("data-id");
      const kind = await entries.nth(i).getAttribute("data-kind");
      expect(id, `entry[${i}] data-id`).toBeTruthy();
      expect(kind, `entry[${i}] data-kind`).toMatch(/^(album|game)$/);
    }
  });

  test("distribución 22 álbumes + 10 juegos exacta", async ({ page }) => {
    await page.goto("/about");
    const albums = page.locator('[data-testid="credit-entry"][data-kind="album"]');
    const games = page.locator('[data-testid="credit-entry"][data-kind="game"]');
    await expect.poll(async () => albums.count()).toBe(22);
    await expect.poll(async () => games.count()).toBe(10);
  });

  test("cada credit-entry tiene un link 'Fuente' externo con target=_blank y rel noopener", async ({
    page,
  }) => {
    await page.goto("/about");
    const sourceLinks = page
      .getByTestId("credit-entry")
      .getByRole("link", { name: /Fuente/i });
    const linkCount = await sourceLinks.count();
    // Hay 32 entries y cada uno tiene sourceUrl → 32 enlaces esperados.
    expect(linkCount).toBeGreaterThanOrEqual(32);

    for (let i = 0; i < linkCount; i++) {
      const target = await sourceLinks.nth(i).getAttribute("target");
      const rel = (await sourceLinks.nth(i).getAttribute("rel")) ?? "";
      const href = (await sourceLinks.nth(i).getAttribute("href")) ?? "";
      expect(target, `link[${i}] target`).toBe("_blank");
      expect(rel, `link[${i}] rel`).toContain("noopener");
      expect(href, `link[${i}] href`).toMatch(/^https:\/\//);
    }
  });

  test("/about contiene secciones 'Sobre este proyecto', 'Stack' y 'Agradecimientos'", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 2, name: /Sobre este proyecto/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /^Stack$/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /Agradecimientos/i }),
    ).toBeVisible();
  });

  test("sección 'Stack' lista las tecnologías clave", async ({ page }) => {
    await page.goto("/about");
    const stackHeading = page.getByRole("heading", {
      level: 2,
      name: /^Stack$/i,
    });
    await expect(stackHeading).toBeVisible();

    // Las 6 tecnologías que la spec REQ-CREDITS-8 exige listar.
    // Usamos page-level text matching porque están en bullets.
    for (const tech of [
      "Next.js 15",
      "React 19",
      "Tailwind",
      "Fastify 5",
      "TypeScript",
      "Vitest",
    ]) {
      await expect(page.getByText(tech, { exact: false })).toBeVisible();
    }
  });

  test("sección 'Agradecimientos' menciona gentle-ai", async ({ page }) => {
    await page.goto("/about");
    const thanksSection = page
      .getByRole("region", { name: /Agradecimientos/i })
      .or(
        page.locator("section").filter({
          has: page.getByRole("heading", { name: /Agradecimientos/i }),
        }),
      );
    await expect(
      page.getByText(/gentle-ai/i).first(),
    ).toBeVisible();
  });

  test("/about no genera errores 4xx/5xx ni consola", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    const failedResponses: string[] = [];
    page.on("response", (resp) => {
      if (resp.status() >= 400 && !resp.url().includes("favicon")) {
        failedResponses.push(`${resp.status()} ${resp.url()}`);
      }
    });

    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    expect(consoleErrors, "Errores de consola").toEqual([]);
    expect(failedResponses, "Respuestas 4xx/5xx").toEqual([]);
  });
});
