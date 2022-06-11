const {validates} = require("../models/product")
function validateProduct(req,res,next){
    let { error } = validates(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    next();
}
module.exports = validateProduct;