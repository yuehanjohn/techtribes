import * as fs from "fs";
import * as yaml from "js-yaml";

const DATA_FILE = "data/communities.yml";

(async function main() {
  const file = fs.readFileSync(DATA_FILE, "utf8");
  const input = yaml.load(file) as any[];

  const names = new Set<string>();
  input.forEach((item) => {
    if (names.has(item.name)) {
      console.error(`Duplicate name found: ${item.name}`);
    }
    names.add(item.name);
  });

  const sorted = input.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(DATA_FILE, yaml.dump(sorted));
})();
