const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const productRoutes = require('./routes/productRoutes');
dotenv.config();
const Product = require('./models/product');
const scrapeProductData = require('./scraper/scrape')
const app = express();
app.use(express.json());

//process.env.MONGO_URI
mongoose.connect("mongodb://localhost:27017/productDb", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;


cron.schedule('0 * * * *', async () => {
    console.log('Starting periodic scrape...');
    
    const amazonSearchUrl = 'https://www.amazon.com/s?k=kitchen+and+dining&rh=p_36%3A-5000&s=date-desc-rank';
  
    try {
      const products = await scrapeProductData(amazonSearchUrl);
      console.log("products",products)
      // Insert products into DB
      await Product.insertMany(products);
    } catch (error) {
      console.error('Error during scheduled scraping:', error);
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
