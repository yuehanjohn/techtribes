import * as fs from "fs";
import * as yaml from "js-yaml";
import scrapeMeetup from "./scrapers/meetup";
import scrapeMeetabit from "./scrapers/meetabit";

const file = fs.readFileSync("_data/input.yml", "utf8");
const input = yaml.load(file) as any[];
const future: any[] = [];
const past: any[] = [];

async function scrape(meetup: { name: string; url: string }) {
  const { url } = meetup;
  let scraped: any;
  if (url.startsWith("https://www.meetup.com/")) {
    scraped = await scrapeMeetup(url);
  } else if (url.startsWith("https://www.meetabit.com/")) {
    scraped = await scrapeMeetabit(url);
  }
  if (scraped) {
    const members = scraped.members;
    const target = scraped.future ? future : past;
    const data = scraped.future || scraped.past;
    if (!scraped.future) {
      const [day, month, year] = scraped.past.date.split("/");
      if (
        new Date(+year, +month - 1, +day).getTime() <
        Date.now() - 31536000000
      ) {
        console.warn(`Inactive: ${meetup.name} (${scraped.past.date})`);
        return;
      }
    }
    target.push({
      ...meetup,
      members,
      date: data.date,
      event: data.link,
    });
  }
}

(async function main() {
  const date = (event: any) => +event.date.split("/").reverse().join("");
  await Promise.all(input.map(scrape));
  fs.writeFileSync(
    "_data/output.yml",
    yaml.dump({
      future: future.sort((a, b) => date(a) - date(b)),
      past: past.sort((a, b) => date(b) - date(a)),
    })
  );
})();
