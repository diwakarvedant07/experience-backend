const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required : true
  },
  emailId: {
    type: String,
    required : true
  },
  orgName: {
    type: String,
    required : true
  },
  password: {
    type: String
  },
  userType: {
    type: Number,
    default: 1
  },
  status : {
    type: String,
    default: 'active'
  },
  demo : [
    {   
      moduleId: {
        type: String
      },
      demoTime: {
        type: String
      },
      remarks: {
        type: String
      },
      phoneNumber: {
        type: String
      },
    }
  ],


});

module.exports = mongoose.model("Register", registerSchema, "Registered Users");
