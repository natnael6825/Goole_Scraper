const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const readline = require('readline');

const numResults = 10;
const outputDir = 'scraper_results';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const setupOutputFile = (name) => {
  return path.join(outputDir, `${name.replace(/ /g, '_')}_results.txt`); // Dynamically generate output file name
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
  }, numResults);

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

const appendContentToFile = (content, url, outputFile) => {
  const data = `URL: ${url}\n\n${content}\n\n\n`;
  fs.appendFileSync(outputFile, data, 'utf8');
};

const processName = async (name) => {
  console.log(`Processing: ${name}`); // Add logging

  if (!name) {
    console.error('Name is undefined');
    return;
  }

  const outputFile = setupOutputFile(name); // Setup output file based on name

  try {
    // Scrape first 10 links
    const links = await searchGoogle(name, numResults);
    for (let i = 0; i < links.length; i++) {
      const content = await scrapeContent(links[i]);
      appendContentToFile(content, links[i], outputFile);
      console.log(`Appended content from: ${links[i]}`);
    }
    
    // Scrape next 10 links for inspirational quotes
    const quoteQuery = `inspirational quotes said by ${name}`;
    const quoteLinks = await searchGoogle(quoteQuery, numResults);
    for (let i = 0; i < quoteLinks.length; i++) {
      const content = await scrapeContent(quoteLinks[i]);
      appendContentToFile(content, quoteLinks[i], outputFile);
      console.log(`Appended content from: ${quoteLinks[i]}`);
    }

    console.log(`All content saved to ${outputFile}`);
  } catch (error) {
    console.error(`An error occurred with ${name}:`, error);
  }
};

const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
};

const main = async () => {
  const columnName = await askQuestion('Enter the column name to use: ');
  const startIndex = parseInt(await askQuestion('Enter the start index: '), 10);
  const stopIndex = parseInt(await askQuestion('Enter the stop index: '), 10);

  let processedCount = 0;
  const names = [];

  fs.createReadStream('CSV File/Finale top 100.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (processedCount < stopIndex) {
        names.push(row[columnName]);
        processedCount++;
      }
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');
      const selectedNames = names.slice(startIndex - 1, stopIndex);
      console.log(`Names to process from index ${startIndex} to ${stopIndex}:`);
      console.log(`Start element: ${selectedNames[0]}`);
      console.log(`End element: ${selectedNames[selectedNames.length - 1]}`);
      
      for (const name of selectedNames) {
        if (!name) continue;
        await processName(name);
      }
      
      console.log('Processing complete.');
    })
    .on('error', (error) => {
      console.error('Error reading the CSV file:', error);
    });
};

main();
