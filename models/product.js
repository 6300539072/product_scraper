const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: { type: Number, default: null },  
  description: String,
  ratings: { type: Number, default: null }, 
  url: String,
  lastScraped: { type: Date, default: Date.now },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
