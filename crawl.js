const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);

  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  pages[normalizedURL] = 1;

  console.log(`Crawling URL: ${currentURL}`);
  let htmlBody = "";
  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.log(`HTTP Status Error: Status Code ${resp.status}`);
      return pages;
    }

    const contentType = resp.headers.get("Content-Type");
    if (!contentType.includes("text/html")) {
      console.log(`Non-HTML Response: ${contentType}`);
      return pages;
    }

    htmlBody = await resp.text();
  } catch (err) {
    console.log(`Error fetching ${currentURL}: ${err.message}`);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const anchors = dom.window.document.querySelectorAll("a");

  for (const anchor of anchors) {
    if (anchor.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(anchor.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${anchor.href}`);
      }
    } else {
      try {
        urls.push(new URL(anchor.href).href);
      } catch (err) {
        console.log(`${err.message}: ${anchor.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  const parsedURL = new URL(url);
  return `${parsedURL.host}${parsedURL.pathname}`.replace(/\/$/, "");
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
