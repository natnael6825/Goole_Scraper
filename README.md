# Puppeteer Google Search Scraper

This project uses Puppeteer to automate a Google search, scrape the content from the search results, and save the content into files named after the search queries from a CSV file.

## Prerequisites

- Node.js (version 14 or later)
- npm (Node package manager)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/natnael6825/Goole_Scraper.git
    cd Goole_Scraper
    ```

2. Install the required packages:

    ```bash
    npm install
    ```

## Usage

1. Prepare your CSV file:

    Ensure your CSV file is named `Finale top 100.csv` and placed in the root directory of the project. The CSV file should contain a column with the names/keywords you want to scrape. 

2. Run the application:

    ```bash
    node app.js
    ```

3. Follow the prompts:

    - Enter the column name to use:
      ```
      Enter the column name to use: [column name here]
      ```
    - Enter the start index:
      ```
      Enter the start index: [start index here]
      ```
    - Enter the stop index:
      ```
      Enter the stop index: [stop index here]
      ```

    The script will process the names/keywords from the specified range in the CSV file, perform Google searches using those names/keywords, scrape the content from the top search results, and save the content into files. Each file will be named after the corresponding search query with underscores replacing spaces, followed by `_results.txt`.

4. View the results:

    The results will be saved in the `scraper_results` directory.

## Example

If your CSV file has a column `Keyword` with the name `Albert Einstein` in the specified range, the output file will be named `Albert_Einstein_results.txt`.


