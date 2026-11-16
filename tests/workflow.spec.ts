import { test, expect } from "@playwright/test";

test("mobile DM loop: direct damage, temp HP, conditions, zero HP, heal, recovery and round", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Setup", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "+ Add Zombie", exact: true })
      .click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  for (let i = 1; i <= 3; i++)
    await page.getByLabel(`Zombie ${i} initiative`).fill(String(20 - i));
  await page.getByRole("button", { name: "Start battle →" }).click();
  const first = page.locator(".actor").filter({
    has: page.getByRole("heading", { name: "Zombie 1", exact: true }),
  });
  await page
    .getByRole("button", { name: "Damage Zombie 1", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Enter an HP amount first",
  );
  await first.getByText("Conditions, notes & details", { exact: true }).click();
  await page.getByLabel("Conditions for Zombie 1").selectOption("Prone");
  await expect(first.locator(".tags")).toContainText("Prone");
  await first.getByRole("button", { name: "Attack / temp HP" }).click();
  await page.getByLabel("HP amount", { exact: true }).fill("3");
  await page.getByRole("button", { name: "Set temp HP", exact: true }).click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  await page.getByLabel("Zombie 1 HP amount").fill("5");
  await page
    .getByRole("button", { name: "Damage Zombie 1", exact: true })
    .click();
  await expect(first.locator(".vitals")).toContainText("20 / 22 HP");
  await expect(first.locator(".vitals")).toContainText("0 temp HP");
  await page.getByLabel("Zombie 1 HP amount").fill("20");
  await page
    .getByRole("button", { name: "Damage Zombie 1", exact: true })
    .click();
  await expect(first.locator(".zero-hp")).toContainText("Check traits");
  await page.getByLabel("Zombie 1 HP amount").fill("30");
  await page
    .getByRole("button", { name: "Heal Zombie 1", exact: true })
    .click();
  await expect(first.locator(".vitals")).toContainText("22 / 22 HP");
  await page
    .getByRole("button", { name: "Undo last change", exact: true })
    .click();
  await expect(first.locator(".vitals")).toContainText("0 / 22 HP");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next turn →" }).click();
  await expect(page.locator(".turn-context")).toContainText("ROUND 2");
  await page.reload();
  await expect(first.locator(".vitals")).toContainText("0 / 22 HP");
  await expect(first.locator(".tags")).toContainText("Prone");
  await expect(page.locator(".turn-context")).toContainText("ROUND 2");
});

test("touch reflow, keyboard dialog trap/escape/return and destructive recovery", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Setup", exact: true }).click();
  const add = page.getByRole("button", {
    name: "+ Add party member",
    exact: true,
  });
  await add.click();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(add).toBeFocused();
  await page
    .getByRole("button", { name: "+ Add Skeleton", exact: true })
    .click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  for (const width of [320, 375, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const box = await page
      .getByRole("button", { name: "Start battle →" })
      .boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  await page.getByText("Conditions, notes & details", { exact: true }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.locator(".actor")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Undo last change", exact: true })
    .click();
  await expect(page.locator(".actor")).toHaveCount(1);
});
