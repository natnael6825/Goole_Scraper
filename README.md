# Puppeteer Google Search Scraper

This project uses Puppeteer to automate a Google search, scrape the content from the search results, and save the content into a file named after the search query.

## Prerequisites

- Node.js (version 14 or later)
- npm (Node package manager)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/natnael6825/Goole_Scraper.git
    cd puppeteer-google-search-scraper
    ```

2. Install the required packages:

    ```bash
    npm install
    ```

## Usage

1. Run the application:

    ```bash
    node app.js
    ```

2. Enter your search query when prompted:

    ```
    Enter your search query: [your search query here]
    ```

3. The script will perform a Google search using the query you provided, scrape the content from the top search results, and save all the content into a single file. The file will be named after your search query with underscores replacing spaces and followed by `_results.txt`.

## Example

If you enter `Albert Einstein` as the search query, the output file will be named `Albert_Einstein_results.txt`.

## Troubleshooting

If you encounter any issues, ensure that you have the necessary permissions to write to the directory and that your network connection is stable.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
