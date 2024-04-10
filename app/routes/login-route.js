const express = require("express");
const config = require('../../config/config');
const router = express.Router();
const RegisterModel = require("../models/register-model");
const verifyJWT = require("../middleware/verify-jwt-token.js");
const verifyApiKey = require("../middleware/verify-api-key.js");
const jwt = require("jsonwebtoken");
let token;

router.get("/", async (req, res) => {
  res.status(200).send({resp : "ok"});
});
router.get("/:id", verifyJWT, (req, res) => {
  res.status(200).send({resp : targetData});
});

router.post("/", verifyApiKey , async (req, res) => {
    let targetUser;
    try {
        targetUser = await RegisterModel.findOne({emailId : req.body.loginEmailId});
        if (targetUser == null) {
            return res.status(404).json({ error: "You have not registered yet" });
        }
        else if (targetUser.password != req.body.password) {
            return res.status(401).json({ error: "Wrong Password" });
        }
        else if(targetUser.status == "active"){
            //user verified send token made with id.
            try {
                token = jwt.sign(
                    {
                        _id : targetUser._id,
                    },
                        process.env.MS_EXPERIENCE_TOKEN_KEY, 
                    {
                        expiresIn: config.jwtTokenExpiration,
                    }
                );
                if(targetUser.userType == -1) {
                    return res.status(202).send({ resp: token });
                }
                return res.status(200).send({ resp: token });
            } catch (e) {
                console.error(e);
                return res.status(500).json({ error: e.message });
            }
            
        }
        else if (targetUser.status == "inActive"){
            return res.status(403).json({ error: "Your account has been inactivated, contact the administrator to get access"})
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch("/:id" ,verifyJWT  , async (req, res) => {
    res.status(400).json({ error: "no need to patch login" });rs
});


router.delete("/:id",verifyJWT , async (req, res) => {
  res.status(200).send({resp : "ok"});
});







module.exports = router;
