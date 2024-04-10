const express = require("express");
const router = express.Router();
const FeedbackModel = require("../models/feedback-model");
const verifyJWT = require("../middleware/verify-jwt-token.js");

router.get("/", verifyJWT, async (req, res) => {
    var moduleData = await FeedbackModel.find({});
  res.status(200).send(moduleData);
});

router.get("/:userId/:moduleId",verifyJWT, async (req,res) => {
    var moduleData = await FeedbackModel.findOne({ userId : req.params.userId , moduleId : req.params.moduleId });
    try{
        if(moduleData.rating){
        res.status(200).send({resp : "User has already submitted feedback."});
    }
    else {
        res.status(404).send({resp : "Not Found"});
    }
}catch(e) {
    res.status(404).send({resp : "Not Found"});
}
    
})

router.post("/" ,verifyJWT, async (req, res) => {
    try {
        req.body.userId = req.user
        var moduleModel = new FeedbackModel(req.body);
    await moduleModel.save();
    res.status(201).send({resp : "Module added"})
    } catch (err) {
        res.status(400).send({resp : err});
    }
});








module.exports = router;
