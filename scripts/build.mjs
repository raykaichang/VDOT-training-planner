import { access, cp, mkdir, rm } from "node:fs/promises";

const dist = "dist";

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp("index.html", `${dist}/index.html`);
await cp("en", `${dist}/en`, { recursive: true });
await cp("web", `${dist}/web`, { recursive: true });
await cp("src", `${dist}/src`, { recursive: true });
await copyIfExists("public", dist);
await copyIfExists("Gpx", `${dist}/Gpx`);

console.log("Static build written to dist/");

async function copyIfExists(from, to) {
  try {
    await access(from);
    await cp(from, to, { recursive: true });
  } catch {
    // Optional static asset folder.
  }
}
