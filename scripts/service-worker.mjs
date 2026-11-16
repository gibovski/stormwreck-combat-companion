import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = [
  "./",
  "./index.html",
  "./icon.svg",
  "./dragon.svg",
  ...(await readdir("dist/art")).map((f) => "./art/" + f),
  "./manifest.webmanifest",
  ...(await readdir("dist/assets")).map((f) => "./assets/" + f),
];
const digest = createHash("sha256")
  .update(await readFile("dist/index.html"))
  .update(
    await Promise.all(
      files.filter((f) => /\.(svg|webp)$/.test(f)).map((f) => readFile("dist/" + f)),
    ).then((parts) => Buffer.concat(parts)),
  )
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
