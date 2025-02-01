import scrapeJson from "./json";

(async function () {
  console.log(
    await scrapeJson(
      "https://gist.githubusercontent.com/olegp/f34469b65286c057964414c4aaf5bf47/raw"
    )
  );
})();
