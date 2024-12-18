import scrapeMeetup from "./meetup";

(async function () {
  console.log(await scrapeMeetup("https://www.meetup.com/helpy-meetups/"));
})();
