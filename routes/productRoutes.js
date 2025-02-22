const express = require('express');
const Product = require('../models/product');
const scrapeProductData = require('../scraper/scrape');
const router = express.Router();


router.post('/', async (req, res) => {
//   const { name,price,description,ratings} = req.body; 
const  url  = req.body
// const  url  = "https://www.amazon.com/s?k=kitchen+and+dining&rh=p_36%3A-5000&s=date-desc-rank&_encoding=UTF8&content-id=amzn1.sym.82545daf-9a90-4f78-b3cc-f9f3e191c9ad&pd_rd_r=e1264c14-0663-4826-bf38-96254022862e&pd_rd_w=Oa3jH&pd_rd_wg=0ZVcA&pf_rd_p=82545daf-9a90-4f78-b3cc-f9f3e191c9ad&pf_rd_r=844Y1KAN37N2XC71A6GD&ref=pd_hp_d_atf_unk"
  console.log( "reqBody",url)
//   const url = "https://www.amazon.com/"
  try {
    const productData = await scrapeProductData(url)
    console.log("productData",productData)
    // const newProduct = new Product({name,price,description,ratings})
     const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ message: 'Failed to scrape and save product', error });
  }
});

router.get('/', async (req, res) => {

    console.log("entering the get the data")
    const { name, price, category } = req.query;

    const filters = {};
    if (name) filters.name = { $regex: name, $options: 'i' }
    if (price) filters.price = { $lte: price }
    if (category) filters.category = category
  
    try {
      const products = await Product.find(filters)
      console.log("products",products.length,products)
      res.json(products);
    } catch (error) {
        console.log("error",error)
      res.status(500).json({ error: 'Failed to retrieve products' })
    }
})

router.get('/:id', async (req, res) => {
    console.log("get by id")
    const { id } = req.params
    console.log("id",id)
    try {
      
      const products = await Product.findById(id)
      console.log("product",product)

      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products', error })
    }
  });

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name,price, description, ratings } = req.body
  console.log("reqBody",req.body)
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true })
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error })
  }
});

router.delete('/:id', async (req, res) => {
    console.log("deleting the data by id")
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id)
     console.log("deletedProduct",deletedProduct)

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
});

module.exports = router;
