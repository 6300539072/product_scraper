
const puppeteer = require('puppeteer');

async function scrapeProductData(url) {
  const browser = await puppeteer.launch({
    headless:false,
    defaultViewport:false,
    userDataDir:"./temp"
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // product details from the Amazon page
  const productDetails = await page.evaluate(() => {
    const products = [];
    const productElements = document.querySelectorAll('.s-main-slot .s-result-item');

    productElements.forEach((item) => {
        // item.querySelector('h2 .a-text-normal')
      const product = {
        name: item.querySelector('h2 .a-text-normal') ? item.querySelector('h2 .a-text-normal').innerText : 'Unknown',
        price: item.querySelector('.a-price .a-offscreen') 
                ? item.querySelector('.a-price .a-offscreen').innerText.replace(/[^0-9.-]+/g, '') // Extract numeric part
                : null,
        description: item.querySelector('.a-text-normal') ? item.querySelector('.a-text-normal').innerText : 'No description available',
        ratings: item.querySelector('.a-icon-alt') 
                ? parseFloat(item.querySelector('.a-icon-alt').innerText.replace(/[^0-9.-]+/g, '')) // Extract numeric part
                : null,
        url: item.querySelector('h2 a') ? 'https://www.amazon.com' + item.querySelector('h2 a').getAttribute('href') : '',
      };

    
      if (product.price && isNaN(product.price)) {
        product.price = null;
      }
      if (product.ratings && isNaN(product.ratings)) {
        product.ratings = null;
      }

      products.push(product);
    });

    return products;
  });

  await browser.close();
  return productDetails;
}

module.exports = scrapeProductData;

