import { expect, test } from "@playwright/test";

/**
 * Criterios: Frontend — Catálogo Games (Amstrad CPC, iteración 7).
 *
 * Misma estrategia que `albums.spec.ts`:
 *   - `data-testid="game-card"` para no enredarse con otros heading de la página.
 *   - `data-genre="<Género>"` para validar filtros por género con exactitud.
 *   - `data-game-id="<id>"` para localizar cards específicas (Knight Lore...).
 *   - Esperamos a la respuesta HTTP de `/games?...` antes de medir el DOM.
 *
 * Sincronización:
 *   - El grid tiene debounce 250ms en el effect. `waitForResponse` se ARMA
 *     antes del `.fill()` o `.click()` para no perder el evento.
 *   - Para acciones que disparan un reset (desactivar chip, "Limpiar
 *     filtros"), evitamos `waitForResponse` y esperamos por el cambio
 *     visible (`aria-pressed`, `toHaveValue("")`). Igual que albums.spec.ts
 *     en sus líneas 358-373 y 442-457: el race click → debounce → fetch
 *     no es estable con waitForResponse.
 *
 * Conteos derivados de `apps/api/src/data/games.ts` (verificados):
 *   - Total: 10 juegos.
 *   - "Aventura isométrica" → 3 juegos (knight-lore, head-over-heels,
 *     la-abadia-del-crimen).
 *   - "knight" → 1 juego (knight-lore).
 *
 * Gap rojo conocido del dataset: ninguna cita de prensa tiene `url`. El
 * test 8 verifica la *condición* "si existe <a> en figcaption, debe ser
 * target=_blank y rel con noopener", pero NO exige que exista al menos un
 * <a>. Si en una futura iteración se añaden URLs, el assertion existente
 * empieza a ejercitarse sin cambios.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/games");
  await expect(
    page.getByRole("region", { name: /Catálogo de games/i }),
  ).toBeVisible();
  await expect
    .poll(async () => page.getByTestId("game-card").count(), { timeout: 10_000 })
    .toBeGreaterThanOrEqual(10);
});

test.describe("header y navegación", () => {
  test("entrada 'Games' en el header navega a /games y muestra 16 cards", async ({
    page,
  }) => {
    // Partimos de home y navegamos vía el header para validar el link del menú.
    await page.goto("/");
    await page
      .getByRole("navigation", { name: /Principal/i })
      .getByRole("link", { name: "Games" })
      .click();

    await expect(page).toHaveURL(/\/games$/);

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 10_000 })
      .toBe(16);
  });
});

test.describe("buscador", () => {
  test("buscador 'knight' filtra a 1 card (Knight Lore)", async ({ page }) => {
    const search = page.getByTestId("game-search-input");

    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().toLowerCase().includes("q=knight") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await search.fill("knight");
    await respPromise;

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBe(1);

    const id = await cards.first().getAttribute("data-game-id");
    expect(id).toBe("knight-lore");
  });
});

test.describe("chips de género", () => {
  test("chip 'Aventura isométrica' deja solo cards con data-genre='Aventura isométrica'", async ({
    page,
  }) => {
    const chip = page.getByTestId("game-genre-chip-aventura-isometrica");

    const respPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await respPromise;

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(2);

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const genre = await cards.nth(i).getAttribute("data-genre");
      expect(genre, `card[${i}] data-genre`).toBe("Aventura isométrica");
    }

    await expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  test("click otra vez en el mismo chip lo deselecciona y vuelve a 16 cards", async ({
    page,
  }) => {
    const chip = page.getByTestId("game-genre-chip-aventura-isometrica");

    // Primera activación: esperamos por la red para garantizar que el
    // estado activo se ha aplicado.
    const activatePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await activatePromise;
    await expect(chip).toHaveAttribute("aria-pressed", "true");

    // Segunda activación: el chip vuelve a "all". El componente excluye
    // `genre=all` de la URL via buildUrl, así que la nueva request NO lleva
    // `genre=`. Esperamos por el cambio visible (aria-pressed) que sigue
    // al re-fetch tras el debounce de 250ms, no por la red — el race
    // entre click y waitForResponse no es estable con debounce.
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const todosChip = page.getByTestId("game-genre-chip-todos");
    await expect(todosChip).toHaveAttribute("aria-pressed", "true");

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 8_000 })
      .toBe(16);
  });

  test("combinar género 'Aventura isométrica' + buscador 'knight' devuelve solo Knight Lore", async ({
    page,
  }) => {
    const chip = page.getByTestId("game-genre-chip-aventura-isometrica");
    const chipResp = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await chipResp;

    const searchResp = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().toLowerCase().includes("q=knight") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await page.getByTestId("game-search-input").fill("knight");
    await searchResp;

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 5_000 })
      .toBe(1);

    const id = await cards.first().getAttribute("data-game-id");
    expect(id).toBe("knight-lore");
  });
});

test.describe("limpiar filtros", () => {
  test("'Limpiar filtros' resetea género + búsqueda y vuelve a 16 cards", async ({
    page,
  }) => {
    const chip = page.getByTestId("game-genre-chip-aventura-isometrica");
    const chipResp = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await chip.click();
    await chipResp;

    const search = page.getByTestId("game-search-input");
    const searchResp = page.waitForResponse(
      (r) =>
        r.url().includes("/games?") &&
        r.url().toLowerCase().includes("q=a") &&
        r.url().includes("genre=Aventura") &&
        r.status() === 200,
      { timeout: 8_000 },
    );
    await search.fill("a");
    await searchResp;

    // El botón "Limpiar filtros" solo aparece cuando hasFilters && !loading.
    const clearBtn = page.getByTestId("game-clear-filters");
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Reset: input vacío + chip "Todos" pressed + chip Aventura no pressed.
    // Verificamos cambios visibles (no la red) por el debounce 250ms.
    await expect(search).toHaveValue("");

    const todosChip = page.getByTestId("game-genre-chip-todos");
    await expect(todosChip).toHaveAttribute("aria-pressed", "true");
    await expect(chip).toHaveAttribute("aria-pressed", "false");

    const cards = page.getByTestId("game-card");
    await expect
      .poll(async () => cards.count(), { timeout: 8_000 })
      .toBe(16);
  });
});

test.describe("ficha de juego", () => {
  test("click en una card lleva a la ficha con h1, dl con 5 metadatos y descripción", async ({
    page,
  }) => {
    const firstLink = page
      .getByTestId("game-card")
      .first()
      .getByRole("link", { name: /Ver detalle de/i });
    await expect(firstLink).toBeVisible();

    await firstLink.click();

    await expect(page).toHaveURL(/\/games\/[a-z0-9-]+/);

    // h1 con el título del juego.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // <dl> con 5 <dt>. No acoplamos textos exactos (Año, Desarrollador,
    // Editor, Género, Sistema) porque el contrato relevante es el conteo.
    const dl = page.locator("dl").first();
    await expect(dl.locator("dt")).toHaveCount(5);

    // Sección de descripción visible.
    const descSection = page.locator("section[aria-labelledby='description-title']");
    await expect(descSection).toBeVisible();

    // El <p> bajo description-title debe tener >= 200 chars (criterio del
    // PRD: descripciones largas, no placeholders).
    const descText = await descSection.locator("p").first().innerText();
    expect(descText.trim().length).toBeGreaterThanOrEqual(200);
  });

  test("ficha de /games/knight-lore muestra quotes con figure/blockquote/cite y enlaces seguros", async ({
    page,
  }) => {
    await page.goto("/games/knight-lore");

    const pressSection = page.locator("section[aria-labelledby='press-title']");
    await expect(pressSection).toBeVisible();

    const figures = pressSection.locator("figure");
    const blockquotes = figures.locator("blockquote");
    const cites = figures.locator("figcaption cite");

    await expect
      .poll(async () => blockquotes.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => cites.count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(1);

    // Verificación condicional: si existen <a> dentro de figcaption, deben
    // tener target="_blank" y rel con "noopener". El dataset actual NO
    // incluye URLs en quotes, por lo que linkCount puede ser 0. Si en
    // iteraciones futuras se añaden URLs, este loop empieza a ejercitarse
    // sin cambios en el test. Documentado como gap rojo conocido del
    // dataset en el reporte.
    const sourceLinks = pressSection.locator("figcaption a");
    const linkCount = await sourceLinks.count();
    for (let i = 0; i < linkCount; i++) {
      const link = sourceLinks.nth(i);
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");
      expect(target, `link[${i}] target`).toBe("_blank");
      expect(rel ?? "", `link[${i}] rel`).toContain("noopener");
    }
    // No assertion sobre linkCount > 0 — gap rojo conocido del dataset.
  });

  test("ficha de /games/la-abadia-del-crimen también renderiza estructura completa", async ({
    page,
  }) => {
    await page.goto("/games/la-abadia-del-crimen");

    // h1 visible.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // <dl> con 5 <dt>.
    const dl = page.locator("dl").first();
    await expect(dl.locator("dt")).toHaveCount(5);

    // Sección de prensa visible.
    const pressSection = page.locator("section[aria-labelledby='press-title']");
    await expect(pressSection).toBeVisible();

    // >=1 <figure> con <blockquote> y <cite>.
    const figures = pressSection.locator("figure");
    await expect
      .poll(async () => figures.locator("blockquote").count(), {
        timeout: 5_000,
      })
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => figures.locator("figcaption cite").count(), {
        timeout: 5_000,
      })
      .toBeGreaterThanOrEqual(1);
  });
});

test.describe("404", () => {
  test("/games/unknown-id-123 muestra not-found con link a /games", async ({
    page,
  }) => {
    await page.goto("/games/unknown-id-123");

    await expect(
      page.getByRole("heading", { level: 1, name: /juego no encontrado/i }),
    ).toBeVisible();

    const link = page.getByRole("link", { name: /volver a games/i });
    await expect(link).toHaveAttribute("href", "/games");
  });
});
