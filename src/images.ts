import path from "path";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import sharp from "sharp";

interface Community {
  name: string;
  logo?: string;
  [key: string]: any;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function process(url: string, file: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const output = await sharp(await response.arrayBuffer())
    .resize(128, 128, { fit: "cover" })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, output);
}

(async function main() {
  const yamlContent = await fs.readFile("data/communities.yml", "utf8");
  const communities = yaml.load(yamlContent) as Community[];

  for (const community of communities) {
    if (!community.logo || !community.name) continue;

    const logoUrl = community.logo.trim();
    if (!logoUrl.startsWith("http://") && !logoUrl.startsWith("https://"))
      continue;

    const slug = slugify(community.name);
    const file = `site/assets/logos/${slug}.png`;

    console.log(`${slug}.png`);
    await process(logoUrl, file);
    community.logo = `${slug}.png`;
  }

  await fs.writeFile("data/communities.yml", yaml.dump(communities), "utf8");
})();
