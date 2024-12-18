import * as fs from "fs";
import * as yaml from "js-yaml";
import scrapeMeetup from "./scrapers/meetup";
import scrapeMeetabit from "./scrapers/meetabit";

const file = fs.readFileSync("_data/input.yml", "utf8");
const input = yaml.load(file);
const future: any[] = [];
const past: any[] = [];
(async function main() {
  for (const meetup of input as any[]) {
    const { url } = meetup;
    let scraped: any;
    if (url.startsWith("https://www.meetup.com/")) {
      scraped = await scrapeMeetup(url);
    } else if (url.startsWith("https://www.meetabit.com/")) {
      scraped = await scrapeMeetabit(url);
    }
    if (scraped) {
      const members = scraped.members;
      if (scraped.future) {
        future.push({
          ...meetup,
          members,
          date: scraped.future.date,
          event: scraped.future.link,
        });
      } else if (scraped.past) {
        past.push({
          ...meetup,
          members,
          date: scraped.past.date,
          event: scraped.past.link,
        });
      }
    }
  }
  fs.writeFileSync(
    "_data/output.yml",
    yaml.dump({
      future: future.sort(
        (a, b) =>
          +a.date.split("/").reverse().join("") -
          +b.date.split("/").reverse().join("")
      ),
      past: past.sort(
        (a, b) =>
          +b.date.split("/").reverse().join("") -
          +a.date.split("/").reverse().join("")
      ),
    })
  );
})();
