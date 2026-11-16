import { test, expect } from "@playwright/test";
test("duplicates, combat, critical damage, undo, resume and offline", async ({
  page,
  context,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Roster & sheets", exact: true })
    .click();
  await page.getByRole("button", { name: "+ Add Kobold", exact: true }).click();
  await page.getByRole("button", { name: "+ Add Kobold", exact: true }).click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  await page.getByLabel("Kobold 1 initiative").fill("18");
  await page.getByLabel("Kobold 2 initiative").fill("10");
  await page.getByRole("button", { name: "Start battle →" }).click();
  await expect(page.locator(".actor.active")).toContainText("Kobold 1");
  await page
    .getByLabel("Attacker", { exact: true })
    .selectOption({ label: "Kobold 1" });
  await page
    .getByLabel("Target", { exact: true })
    .selectOption({ label: "Kobold 2 · AC 12" });
  await page.getByLabel("d20", { exact: true }).fill("20");
  await page.getByRole("button", { name: "Check hit", exact: true }).click();
  await expect(page.locator("output")).toContainText("critical hit");
  await page.getByLabel("Individual dice results").fill("2, 1");
  await page.getByRole("button", { name: "Apply damage", exact: true }).click();
  await expect(
    page
      .locator(".actor")
      .filter({
        has: page.getByRole("heading", { name: "Kobold 2", exact: true }),
      })
      .locator(".vitals"),
  ).toContainText("0 / 5 HP");
  await page.getByRole("button", { name: /↶ Undo/ }).click();
  await expect(
    page
      .locator(".actor")
      .filter({
        has: page.getByRole("heading", { name: "Kobold 2", exact: true }),
      })
      .locator(".vitals"),
  ).toContainText("5 / 5 HP");
  await page.getByRole("button", { name: "Next turn →" }).click();
  await expect(page.locator(".actor.active")).toContainText("Kobold 2");
  await page.reload();
  await expect(page.locator(".actor.active")).toContainText("Kobold 2");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".actor.active")).toContainText("Kobold 2");
  await expect(
    page.getByRole("heading", { name: "Your table, in turn." }),
  ).toBeVisible();
  await context.setOffline(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator(".scene-art").evaluateAll((imgs) =>
    Promise.all(imgs.map((img) => (img as HTMLImageElement).decode())),
  );
  await page.screenshot({
    path: `test-results/battle-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("official placeholders require values; custom hero and conditions", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Roster & sheets", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Open official five-sheet PDF ↗" }),
  ).toHaveAttribute("href", /dnd_starterset_characters.pdf/);
  await page.getByRole("button", { name: "Enter cleric", exact: true }).click();
  await page.getByLabel("Armor class", { exact: true }).fill("16");
  await page.getByLabel("Max HP", { exact: true }).fill("10");
  await page
    .getByRole("button", { name: "Save combatant", exact: true })
    .click();
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  await page.getByRole("button", { name: "Use / manage", exact: true }).click();
  await page.getByLabel("Toggle condition").selectOption("Prone");
  await expect(page.locator(".tags")).toContainText("Prone");
  await page.getByLabel("HP amount").fill("4");
  await page.getByRole("button", { name: "Damage", exact: true }).click();
  await expect(page.locator(".vitals")).toContainText("6 / 10 HP");
  await page.getByRole("button", { name: "Heal", exact: true }).click();
  await expect(page.locator(".vitals")).toContainText("10 / 10 HP");
});

test("export/import validation, undo and cancelled advantage", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Roster & sheets", exact: true })
    .click();
  await page
    .getByRole("button", { name: "+ Add Skeleton", exact: true })
    .click();
  await page.getByRole("button", { name: "+ Add Zombie", exact: true }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export backup", exact: true })
    .click();
  const backup = await download;
  const stream = await backup.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const data = Buffer.concat(chunks);
  await page.locator("input[type=file]").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByRole("status")).toContainText("Invalid version-1");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "New battle", exact: true }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "battle.json",
    mimeType: "application/json",
    buffer: data,
  });
  await page.getByRole("button", { name: "Battle", exact: true }).click();
  await expect(page.locator(".actor")).toHaveCount(2);
  await page
    .getByLabel("Attacker", { exact: true })
    .selectOption({ label: "Skeleton 1" });
  await page
    .getByLabel("Target", { exact: true })
    .selectOption({ label: "Zombie 1 · AC 8" });
  await page.getByLabel("Advantage", { exact: true }).check();
  await page.getByLabel("Disadvantage", { exact: true }).check();
  await expect(page.getByLabel("Second d20", { exact: true })).toHaveCount(0);
  await page.getByLabel("d20", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Check hit", exact: true }).click();
  await expect(page.locator("output")).toContainText("MISS");
  await expect(page.locator("output")).toContainText("cancel");
  await expect(
    page.getByRole("button", { name: "Apply damage", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /↶ Undo/ }).click();
  await page.getByRole("button", { name: /↶ Undo/ }).click();
  await expect(page.locator(".actor")).toHaveCount(0);
});

test("first-visit precache provides offline shell and assets", async ({
  page,
  context,
}) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your table, in turn." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Roster & sheets", exact: true }),
  ).toBeVisible();
  const artNames = [
    "wreck",
    "tide-dragon",
    "dice-dragon",
    "roll-guardian",
    "statue-garden",
    "sailors",
    "watch-lantern",
  ];
  for (const name of artNames) {
    expect(
      await page.evaluate(async (name) => {
        const img = new Image();
        img.src = `./art/${name}.webp`;
        await img.decode();
        return img.naturalWidth > 0;
      }, name),
    ).toBe(true);
  }
  await page
    .getByRole("button", { name: "Roster & sheets", exact: true })
    .click();
  for (const img of await page.locator(".scene-art").all()) {
    await expect(img).not.toHaveJSProperty("naturalWidth", 0);
  }
  await expect(page.locator(".dragon-art")).toHaveJSProperty("complete", true);
  await expect(page.locator(".dragon-art")).not.toHaveJSProperty(
    "naturalWidth",
    0,
  );
});
