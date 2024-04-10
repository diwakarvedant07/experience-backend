const express = require("express");
const router = express.Router();
const { get } = require("mongoose");
const RegisterModel = require("../models/register-model");
const verifyJWT = require("../middleware/verify-jwt-token.js");
const verifyApiKey = require("../middleware/verify-api-key.js");

router.get("/", verifyApiKey, verifyJWT , async (req, res) => {
  var user = await RegisterModel.findOne({ _id : req.user._id });
  if(user.fullName){
    res.status(200).send(user);
  }
  else{
    res.status(404).send({message : "User not found"})
  }
});


module.exports = router;