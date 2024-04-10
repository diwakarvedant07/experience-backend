const express = require("express");
const config = require("../../config/config");
const router = express.Router();
const RegisterModel = require("../models/register-model");
const ModuleModel = require("../models/modules-model");
const verifyJWT = require("../middleware/verify-jwt-token.js");
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto');
const verifyApiKey = require("../middleware/verify-api-key.js");
const handlebars = require('handlebars');
const path = require('path')
const fs = require('fs');
const registerModel = require("../models/register-model");

const salesTeamEmail = config.salesTeam
router.get('/',verifyJWT, async function (req, res) {
  var users = await RegisterModel.find({})
  var result = [];
  users.map( function(user) {

  //if(user.userType != -1){
    {
      var myobj = {
      _id: user._id,
      fullName: user.fullName,
      orgName: user.orgName,
      emailId: user.emailId,
      status: user.status,
      userType: user.userType
    };
  result.push(myobj);
  }
  })
  res.status(200).send(result)
})


router.post("/", verifyApiKey , async (req, res) => {
  var user = await RegisterModel.findOne({ emailId : req.body.emailId })

  if(user!= null) {
    res.status(400).json({ error: "User already exists" });
  }
  else {
    try {
    const registerModel = new RegisterModel(req.body);
    await registerModel.save();
    try {
      sendOTP(1,req.body);
    }catch (e) {}
    
    res.status(201).json(registerModel);
  } catch (err) {
    res.status(400).json({ error: err });
  }}

});

router.patch("/:id" ,verifyJWT , targetData , async (req, res) => {
  if(req.body.fullName != null && req.body.fullName != "") {
    res.targetData.fullName = req.body.fullName;
  }
  if(req.body.emailId!= null) {
    res.targetData.emailId = req.body.emailId;
  }
  if(req.body.orgName!= null && req.body.orgName != "") {
    res.targetData.orgName = req.body.orgName;
  }
  if(req.body.status!= null && req.body.status != "") {
    res.targetData.status = req.body.status;
  }
  if(req.body.userType!= null && req.body.userType != "") {
    res.targetData.userType = req.body.userType;
  }
  
  try {
    const updatedForm = await res.targetData.save()
    res.json(updatedForm)
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/reset",verifyApiKey , async (req, res) => {
  var user = await RegisterModel.findOne({ emailId : req.body.emailId })
  if(user) {
    
    try {
      sendOTP(2,user);
    }catch (e) {}
    res.status(200).send({resp : "A new password has been sent to your email address!!"});
  }
  else{
    res.status(400).send({resp : "User not found"});
  }
  
})

router.patch("/bookDemo/:id", verifyJWT, targetData, async (req, res) => {
  if(req.body.demo != null && req.body.demo!= "") {
    res.targetData.demo.push(req.body.demo);
  }
  try {
    const updatedForm = await res.targetData.save()
    var moduleName = await ModuleModel.findOne({_id : req.body.demo.moduleId})
    demoMail(1, res.targetData, moduleName.title, req.body.demo)
    salesTeamEmail.forEach(member => {
      demoMail(member, res.targetData, moduleName.title, req.body.demo)
    })
    res.status(200).json(updatedForm)
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
})

router.get("/demoData", verifyJWT, async (req, res) => {
  var demoData = await registerModel.find({})
  var result = [];
  demoData.map( function(user) {

  //if(user.userType != -1){
    {
      var myobj = {
      _id: user._id,
      emailId: user.emailId,
      fullName: user.fullName,
      demo: user.demo
    };
  result.push(myobj);
  }
  })
  res.status(200).send(result);
})

async function targetData(req, res, next) {
    let targetData;
    try {
        targetData = await RegisterModel.findOne({_id : req.params.id});
        if (!targetData) {
            return res.status(404).json({ error: "No such data found" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    res.targetData = targetData;
    next();
}

async function sendOTP(mailType, user){
  
  var name = user.fullName.split(' ')[0]
  var otp
  if(mailType == 1){
    
    otp = await generateOTP(config.otpLength, config.otpCharacterExcluded);

  const emailVariable = {
    User : name,
    Email : user.emailId,
    Password : otp,
  }
  const templatePath = path.resolve(__dirname, '..', 'templates', 'EmailTemplateForOnboardCredential.html');
  const templateHtmlContent = fs.readFileSync(templatePath, 'utf8');

  const compiledTemplate = handlebars.compile(templateHtmlContent);
  const compiledTemplateWithData = compiledTemplate(emailVariable);

  sgMail.setApiKey(process.env.MS_EXPERIENCE_SENDGRID_API_KEY)
  const msg = {
    to: user.emailId, 
    from: config.mailFrom,
    subject: config.mailSubjectForRegisteration, 
    html: compiledTemplateWithData,
  }
  
  sgMail
  .send(msg)
  .then((response) => {
  })
  .catch((error) => {
    //console.error(error)
  })
  }
  else if(mailType == 2) {
    
    otp = await generateOTP(config.otpLength, config.otpCharacterExcluded);
  //send otp to email

  const emailVariable = {
    User : name,
    Email : user.emailId,
    Password : otp,
  }
  
  const templatePath = path.resolve(__dirname, '..', 'templates', 'EmailTemplateForResetPassword.html');
  const templateHtmlContent = fs.readFileSync(templatePath, 'utf8');

  const compiledTemplate = handlebars.compile(templateHtmlContent);
  const compiledTemplateWithData = compiledTemplate(emailVariable);

  sgMail.setApiKey(process.env.MS_EXPERIENCE_SENDGRID_API_KEY)
  const msg = {
    to: user.emailId, 
    from: config.mailFrom, 
    subject: `${name}, your password was successfully reset`, 
    html: compiledTemplateWithData,
  }

  sgMail
  .send(msg)
  .then((response) => {
  })
  .catch((error) => {
    //console.error(error)
  })
  }

  let targetUser;
    try {
        targetUser = await RegisterModel.findOne({emailId : user.emailId});
        if (targetUser == null) {
            return res.status(400).json({ error: "You are not registered" });
        }

        targetUser.password = otp;
        const userPassword = new RegisterModel(targetUser);
        await userPassword.save();

    } catch (err) {
      console.error(err)
        //res.status(500).json({ error: err.message });
    }


}

async function demoMail(mailType, user, moduleName, demo){
  if (mailType == 1) {
    const emailVariable = {
      UserName : user.fullName,
      Module : moduleName,
      Email : user.emailId,
      PhoneNumber : demo.phoneNumber,
      Organization : user.orgName,
      DemoTime: demo.demoTime,
      Remarks: demo.remarks
    }
    const templatePath = path.resolve(__dirname, '..', 'templates', 'EmailTemplateForCustomerDemo.html');
    const templateHtmlContent = fs.readFileSync(templatePath, 'utf8');
  
    const compiledTemplate = handlebars.compile(templateHtmlContent);
    const compiledTemplateWithData = compiledTemplate(emailVariable);
  
    sgMail.setApiKey(process.env.MS_EXPERIENCE_SENDGRID_API_KEY)
    const msg = {
      to: user.emailId, 
      from: config.mailFrom,
      subject: config.mailSubjectForDemoToUser, 
      html: compiledTemplateWithData,
    }
    
    sgMail
    .send(msg)
    .then((response) => {
     
    })
    .catch((error) => {
      //console.error(error)
    })
  }
  if (mailType != 1) {
    const emailVariable = {
      UserName : user.fullName,
      Module : moduleName,
      Email : user.emailId,
      PhoneNumber : demo.phoneNumber,
      Organization : user.orgName,
      DemoTime: demo.demoTime,
      Remarks: demo.remarks
    }
    const templatePath = path.resolve(__dirname, '..', 'templates', 'EmailTemplateForSalesTeam.html');
    const templateHtmlContent = fs.readFileSync(templatePath, 'utf8');
  
    const compiledTemplate = handlebars.compile(templateHtmlContent);
    const compiledTemplateWithData = compiledTemplate(emailVariable);
  
    sgMail.setApiKey(process.env.MS_EXPERIENCE_SENDGRID_API_KEY)
    const msg = {
      to: mailType, 
      from: config.mailFrom, 
      subject: config.mailSubjectForDemoToSalesTeam, 
      html: compiledTemplateWithData,
    }
    
    sgMail
    .send(msg)
    .then((response) => {
    })
    .catch((error) => {
      //console.error(error)
    })
  }
}

// Function to generate a random OTP with excluded characters
function generateOTP(length, excludedChars) {
  const characters = config.otpCharacterIncluded;
  
  // Remove excluded characters from the character set
  const allowedCharacters = characters.replace(new RegExp(`[${excludedChars}]`, 'g'), '');
  
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allowedCharacters.length);
    otp += allowedCharacters.charAt(randomIndex);
  }
  
  return otp;
}



module.exports = router;
