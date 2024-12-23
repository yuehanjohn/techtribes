import * as fs from "fs";
import * as yaml from "js-yaml";
import scrapeMeetup from "./scrapers/meetup.ts";
import scrapeMeetabit from "./scrapers/meetabit.ts";

const file = fs.readFileSync("data/communities.yml", "utf8");
const input = yaml.load(file) as any[];
const future: any[] = [];
const past: any[] = [];

async function scrape(community: { name: string; events: string }) {
  try {
    const { events: events } = community;
    let scraped: any;
    if (events.startsWith("https://www.meetup.com/")) {
      scraped = await scrapeMeetup(events);
    } else if (events.startsWith("https://www.meetabit.com/")) {
      scraped = await scrapeMeetabit(events);
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
          console.warn(`Inactive: ${community.name} (${scraped.past.date})`);
          return;
        }
      }
      target.push({
        ...community,
        members,
        date: data.date,
        event: data.link,
      });
    }
  } catch (error) {
    console.warn(`Error scraping "${community.name}":`, error);
  }
}

(async function main() {
  const date = (event: any) => +event.date.split("/").reverse().join("");
  await Promise.all(input.map(scrape));
  fs.writeFileSync(
    "site/_data/output.yml",
    yaml.dump({
      future: future.sort((a, b) => date(a) - date(b)),
      past: past.sort((a, b) => date(b) - date(a)),
    })
  );
})();
