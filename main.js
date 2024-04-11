const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("No website provided");
    return;
  }
  if (process.argv.length > 3) {
    console.log("Too many arguments provided");
    return;
  }

  const baseURL = process.argv[2];

  console.log(`Crawler starting for: ${baseURL}...`);

  const pages = await crawlPage(baseURL, baseURL, {});

  printReport(pages);
}

main();
