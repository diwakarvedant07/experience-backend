const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product-model");
const { get } = require("mongoose");
const verifyJWT = require("../middleware/verify-jwt-token.js");
const productModel = require("../models/product-model");
 
router.get("/",verifyJWT, async (req, res) => { 
    var productData = await ProductModel.find({});
  res.status(200).send(productData);
});
router.get("/:id", verifyJWT,async (req, res) => {
    var targetData = await ProductModel.findOne({_id : req.params.id});
  res.status(200).send(targetData);
});


router.post("/" ,verifyJWT, async (req, res) => {
    try{
      var serialOrder = await ProductModel.findOne({})
    //console.log(serialOrder)
    req.body.serialNumber = serialOrder.demonstratorEmail.length + 1;
    serialOrder.demonstratorEmail.push((serialOrder.demonstratorEmail.length + 1).toString())
    var order = serialOrder.save();
    } catch(e){}

    try {
        var productModel = new ProductModel(req.body);
    await productModel.save();
    res.status(201).send(productModel);
    } catch (err) {
        res.status(400).send({resp : err});
    }
    
});

router.patch("/:id" ,verifyJWT, targetData , async (req, res) => {
    if(req.body.title != null && req.body.title != "") {
        res.targetData.title = req.body.title;
      }
      if(req.body.description!= null && req.body.description != "") {
        res.targetData.description = req.body.description;
      }
      
        res.targetData.status = req.body.status;
      
      if(req.body.icon!= null && req.body.icon != "") {
        res.targetData.icon = req.body.icon;
      }
      if(req.body.demonstratorEmail!= null && req.body.demonstratorEmail != "") {
        res.targetData.demonstratorEmail = req.body.demonstratorEmail;
      }
      if(req.body.subProduct!= null  && req.body.subProduct != "") {
        res.targetData.subProduct = req.body.subProduct;
      }
      if(req.body.serialNumber!= null && req.body.serialNumber != "") {
        res.targetData.serialNumber = req.body.serialNumber;
      }
      if(req.body.mediaType!= null && req.body.mediaType != "") {
        res.targetData.mediaType = req.body.mediaType;
      }
      try {
        
        const updatedForm = await res.targetData.save()
        res.status(200).json(updatedForm)
      } catch(e) {   
        res.status(400).json({ error: e.message });
      }
});
    

router.delete("/:id",verifyJWT , async (req, res) => {
  try {
    const response = (await productModel.deleteOne({ _id : req.params.id}))
    res.status(200).send({resp : "response" });
  }catch (e){
    res.status(400).send({resp : e});
  }
  
});

async function targetData(req, res, next) {
    let targetData;
    try {
        targetData = await ProductModel.findOne({_id : req.params.id});
        if (targetData == null) {
            return res.status(404).json({ error: "No such data found" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    res.targetData = targetData;
    next();
}



module.exports = router;