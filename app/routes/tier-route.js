const express = require("express");
const router = express.Router();
const TierModel = require("../models/tier-model");
const { get } = require("mongoose");
const verifyJWT = require("../middleware/verify-jwt-token.js");
 
router.get("/",verifyJWT, async (req, res) => { 
    var tierData = await TierModel.find({});
  res.status(200).send(tierData);
});

router.get("/:id", verifyJWT,async (req, res) => {
    var targetData = await TierModel.findOne({_id : req.params.id});
  res.status(200).send(targetData);
});


router.post("/" ,verifyJWT, async (req, res) => {
    try {
    var tierModel = new TierModel(req.body);
    await tierModel.save();
    res.status(201).send(tierModel);
    } catch (err) {
        res.status(400).send({resp : err});
    }
    
});

router.patch("/:id" ,verifyJWT, targetData , async (req, res) => {
    if(req.body.title != null && req.body.title != "") {
        res.targetData.title = req.body.title;
      }
      if(req.body.color!= null && req.body.color != "") {
        res.targetData.color = req.body.color;
      }
      
        res.targetData.status = req.body.status;
      
      if(req.body.icon!= null && req.body.icon != "") {
        res.targetData.icon = req.body.icon;
      }
      if(req.body.parent!= null  && req.body.parent != "") {
        res.targetData.parent = req.body.parent;
      }

      try {
        
        const updatedForm = await res.targetData.save()
        res.status(200).json(updatedForm)
      } catch(e) {   
        console.log(e)
        res.status(400).json({ error: e.message });
      }
});
    

router.delete("/:id",verifyJWT , async (req, res) => {
  res.status(200).send({resp : "Cannot delete a tier, contact the administrator"});
});

async function targetData(req, res, next) {
    let targetData;
    try {
        targetData = await TierModel.findOne({_id : req.params.id});
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