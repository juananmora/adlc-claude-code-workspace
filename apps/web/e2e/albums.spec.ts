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

/**
 * Iteración 4 — Sección de crítica en `/albums/[id]`.
 *
 * Validamos contra dos fichas distintas para confirmar que la estructura
 * aplica a todo el dataset y no solo al primer álbum sembrado.
 *
 * Estructura esperada en la página:
 *   <section aria-labelledby="review-title">
 *     <h2 id="review-title">Crítica</h2>
 *     ... badge "X.X / 10"
 *     <h3>Contexto histórico</h3>
 *     <h3>Sonido y producción</h3>
 *     <h3>Legado y recepción</h3>
 *     ... highlights con <strong>{track}</strong>
 *     ... <figure><blockquote/><figcaption><cite/><a target="_blank" rel="noopener noreferrer">Fuente</a></figcaption></figure>
 *   </section>
 *
 * El tracklist sigue intacto: <h2 id="tracklist-title">Tracklist</h2>.
 */

const REVIEW_ALBUM_IDS = [
  "metallica-master-of-puppets",
  "iron-maiden-number-of-the-beast",
] as const;

test.describe("ficha de álbum — sección de crítica", () => {
  test("review section visible en /albums/metallica-master-of-puppets", async ({
    page,
  }) => {
    await page.goto("/albums/metallica-master-of-puppets");

    await expect(
      page.getByRole("heading", { level: 2, name: /crítica/i }),
    ).toBeVisible();
  });

  test("3 subsecciones h3: contexto histórico, sonido y producción, legado y recepción", async ({
    page,
  }) => {
    await page.goto("/albums/metallica-master-of-puppets");

    await expect(
      page.getByRole("heading", { level: 3, name: /contexto histórico/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 3, name: /sonido y producción/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 3, name: /legado y recepción/i }),
    ).toBeVisible();
  });

  test("badge de puntuación con formato X.X / 10", async ({ page }) => {
    await page.goto("/albums/metallica-master-of-puppets");

    const reviewSection = page.locator("section[aria-labelledby='review-title']");
    await expect(reviewSection).toBeVisible();

    // El badge se renderiza en dos spans (el score y el "/ 10"). Buscamos
    // sobre el texto completo de la sección con un regex tolerante a
    // espacios alrededor del slash.
    const text = (await reviewSection.innerText()).replace(/\s+/g, " ");
    expect(text).toMatch(/\d(?:\.\d)?\s*\/\s*10/);
  });

  test(">=2 quotes con cite y enlaces Fuente bien securizados", async ({
    page,
  }) => {
    await page.goto("/albums/metallica-master-of-puppets");

    const reviewSection = page.locator(
      "section[aria-labelledby='review-title']",
    );

    const figures = reviewSection.locator("figure");
    const blockquotes = figures.locator("blockquote");
    const cites = figures.locator("figcaption cite");

    await expect
      .poll(async () => blockquotes.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(async () => cites.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(2);

    // Cada <a> en figcaption debe tener target="_blank" y rel con noopener.
    const sourceLinks = figures.locator("figcaption a");
    const linkCount = await sourceLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < linkCount; i++) {
      const link = sourceLinks.nth(i);
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");
      const href = await link.getAttribute("href");

      expect(target, `figure[${i}] target`).toBe("_blank");
      expect(rel ?? "", `figure[${i}] rel`).toContain("noopener");
      expect(href ?? "", `figure[${i}] href`).toMatch(/^https?:\/\//);
    }
  });

  test("tracklist sigue intacto junto a la sección de crítica", async ({
    page,
  }) => {
    await page.goto("/albums/metallica-master-of-puppets");

    const tracklistHeading = page.locator("h2#tracklist-title");
    await expect(tracklistHeading).toBeVisible();
    await expect(tracklistHeading).toHaveText(/tracklist/i);
  });

  for (const albumId of REVIEW_ALBUM_IDS) {
    test(`crítica completa también renderiza en /albums/${albumId}`, async ({
      page,
    }) => {
      await page.goto(`/albums/${albumId}`);

      // 1. Heading "Crítica" visible.
      await expect(
        page.getByRole("heading", { level: 2, name: /crítica/i }),
      ).toBeVisible();

      // 2. Las 3 subsecciones h3.
      await expect(
        page.getByRole("heading", { level: 3, name: /contexto histórico/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 3, name: /sonido y producción/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 3, name: /legado y recepción/i }),
      ).toBeVisible();

      // 3. Badge X.X / 10.
      const reviewSection = page.locator(
        "section[aria-labelledby='review-title']",
      );
      const text = (await reviewSection.innerText()).replace(/\s+/g, " ");
      expect(text).toMatch(/\d(?:\.\d)?\s*\/\s*10/);

      // 4. >=2 figures con blockquote + cite, y enlaces "Fuente" seguros.
      const figures = reviewSection.locator("figure");
      const blockquotes = figures.locator("blockquote");
      const cites = figures.locator("figcaption cite");
      await expect
        .poll(async () => blockquotes.count(), { timeout: 5_000 })
        .toBeGreaterThanOrEqual(2);
      await expect
        .poll(async () => cites.count(), { timeout: 5_000 })
        .toBeGreaterThanOrEqual(2);

      const sourceLinks = figures.locator("figcaption a");
      const linkCount = await sourceLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < linkCount; i++) {
        const link = sourceLinks.nth(i);
        expect(await link.getAttribute("target")).toBe("_blank");
        expect((await link.getAttribute("rel")) ?? "").toContain("noopener");
      }

      // 5. Tracklist sigue presente.
      await expect(page.locator("h2#tracklist-title")).toBeVisible();
    });
  }
});
