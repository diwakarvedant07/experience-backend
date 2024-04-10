const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ""
  },
  demonstratorEmail: {
    type: [String],
    default: []
  },
  serialNumber: {
    type: Number,
  }
  
});

module.exports = mongoose.model("Product", productSchema, "Products");
