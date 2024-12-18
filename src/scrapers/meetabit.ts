import * as cheerio from "cheerio";

function parseDate(dayNumber, monthName) {
  const months = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const monthLower = monthName.toLowerCase().trim();
  const day = dayNumber.padStart(2, "0");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const eventDate = new Date(
    currentYear,
    parseInt(months[monthLower]) - 1,
    parseInt(day)
  );

  if (
    eventDate < currentDate &&
    eventDate.getMonth() > currentDate.getMonth()
  ) {
    return `${day}/${months[monthLower]}/${currentYear - 1}`;
  } else if (
    eventDate > currentDate &&
    eventDate.getMonth() < currentDate.getMonth()
  ) {
    return `${day}/${months[monthLower]}/${currentYear + 1}`;
  }

  return `${day}/${months[monthLower]}/${currentYear}`;
}

export default async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const upcomingEvent = $('.col-sm-7 h3:contains("Upcoming Event")')
    .next("ul")
    .find("li")
    .first();

  const future = upcomingEvent.length
    ? {
        date: parseDate(
          upcomingEvent.find(".day-number").text(),
          upcomingEvent.find(".month-name").text()
        ),
        link: "https://www.meetabit.com" + upcomingEvent.find("a").attr("href"),
      }
    : undefined;

  const previousEvent = $('.col-sm-7 h3:contains("Previous Event")')
    .next("ul")
    .find("li")
    .first();

  const past = previousEvent.length
    ? {
        date: parseDate(
          previousEvent.find(".day-number").text(),
          previousEvent.find(".month-name").text()
        ),
        link: "https://www.meetabit.com" + previousEvent.find("a").attr("href"),
      }
    : undefined;

  return { future, past };
}
