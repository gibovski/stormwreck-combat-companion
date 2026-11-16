import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = [
  "./",
  "./index.html",
  "./icon.svg",
  "./manifest.webmanifest",
  ...(await readdir("dist/assets")).map((f) => "./assets/" + f),
];
const digest = createHash("sha256")
  .update(await readFile("dist/index.html"))
  .digest("hex")
  .slice(0, 12);
let sw = await readFile("public/sw.js", "utf8");
sw = sw
  .replace(
    /const CACHE = .*?;/,
    `const CACHE = ${JSON.stringify("stormwreck-" + digest)};`,
  )
  .replace(/c\.addAll\(\[[\s\S]*?\]\)/, `c.addAll(${JSON.stringify(files)})`);
if (!sw.includes("./assets/"))
  throw Error("Service worker precache generation failed");
await writeFile("dist/sw.js", sw);
