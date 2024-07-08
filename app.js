const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let searchQuery = ''; // Initialize searchQuery variable

const askQuestion = () => {
  return new Promise((resolve) => {
    rl.question('Enter your search query: ', (answer) => {
      searchQuery = answer.trim(); // Store user input as searchQuery
      resolve();
    });
  });
};

const numResults = 10;
let outputFile = ''; // Initialize outputFile variable

const setupOutputFile = () => {
  outputFile = `${searchQuery.replace(/ /g, '_')}_results.txt`; // Dynamically generate output file name
};

const searchGoogle = async (query, numResults) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
    waitUntil: 'load',
    timeout: 0
  });

  const links = await page.evaluate((numResults) => {
    const results = [];
    const items = document.querySelectorAll('a');
    items.forEach((item) => {
      const link = item.href;
      if (link.startsWith('https://') && !link.includes('google')) {
        results.push(link);
      }
    });
    return results.slice(0, numResults);
  }, numResults); // Pass numResults as an argument

  await browser.close();
  return links;
};

const scrapeContent = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'load',
    timeout: 0
  });

  const content = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return content;
};

const appendContentToFile = (content, url) => {
  const data = `URL: ${url}\n\n${content}\n\n\n`;
  fs.appendFileSync(outputFile, data, 'utf8');
};

const main = async () => {
  await askQuestion(); // Ask user for search query
  setupOutputFile(); // Setup output file based on searchQuery

  try {
    const links = await searchGoogle(searchQuery, numResults);
    for (let i = 0; i < links.length; i++) {
      const content = await scrapeContent(links[i]);
      appendContentToFile(content, links[i]);
      console.log(`Appended content from: ${links[i]}`);
    }
    console.log(`All content saved to ${outputFile}`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close(); // Close readline interface
  }
};

main();
