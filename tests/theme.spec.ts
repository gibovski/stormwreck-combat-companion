import { test, expect } from "@playwright/test";

test("fantasy views remain usable at narrow widths and with keyboard navigation", async ({
  page,
}) => {
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to adventure" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const roster = page.getByRole("button", {
    name: "Roster & sheets",
    exact: true,
  });
  await roster.focus();
  await page.keyboard.press("Enter");
  await expect(roster).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".party-panel")).toBeVisible();
  await expect(page.locator(".encounter-panel")).toBeVisible();
  await page.locator(".scene-art").evaluateAll((imgs) =>
    Promise.all(imgs.map((img) => (img as HTMLImageElement).decode())),
  );
  await page.screenshot({
    path: `test-results/roster-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page
    .locator(".encounter-panel")
    .screenshot({
      path: `test-results/encounter-${test.info().project.name}.png`,
    });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "+ Add Kobold", exact: true }).click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Use / manage", exact: true }).click();
  await page.getByLabel("d20", { exact: true }).focus();
  await page.keyboard.type("17");
  await expect(page.getByLabel("d20", { exact: true })).toHaveValue("17");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Attack bonus", { exact: true })).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".primary")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});
