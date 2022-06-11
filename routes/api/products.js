const { validate } = require("@hapi/joi/lib/base");
const express = require("express");
const res = require("express/lib/response");
let router = express.Router();
const validateProduct = require("../../middleware/validateProduct");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
var { Product } = require("../../models/product");
const { token } = require("morgan");

// Get Products
router.get("/", async (req,res) => {
    console.log(req.user);
    let page = Number(req.query.page? req.query.page:1);
    let perPage = Number(req.query.perPage? req.query.perPage:10);
        let skipRecords = perPage * (page-1);
    let products = await Product.find().skip(skipRecords).limit(perPage);
    return res.send(products);
});
// GET Single Record
router.get("/:id", async (req,res) => {
    try{
        let product = await Product.findById(req.params.id);
        if(!product) return res.status(400).send("Product with given id is not present");
        return res.send(product);
    } catch (err){
        return res.status(400).send("INVALID ID");
    }
});

// Update the record
router.put("/:id",validateProduct , async(req,res) => {
    let product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});

// DELETE a product
// router.delete("/:id", auth, admin, async(req,res) => {
router.delete("/:id", async(req,res) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    return res.send(product);
});

// INSERT a new product
// router.post("/", auth, validateProduct , async(req,res) => {
router.post("/", validateProduct , async(req,res) => {
    let product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});
module.exports = router;