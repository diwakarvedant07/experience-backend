const mongoose = require("mongoose");

const tierSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true
  },
  icon: {
    type: String,
    default: ""
  },
  color : {
    type: String,
    default: ""
  },
  parent: {
    type: String,
    default: "-1"
  },
  status: {
    type: Boolean,
    default: true
  },
  
});

module.exports = mongoose.model("Tier", tierSchema, "Tiers");