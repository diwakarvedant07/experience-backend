const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  tier: {
    type: String
  },
  productId: {
    type: String,
  },
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

  subModule: [{
    title: String,
    tier: String,
    mediaType: {
      type: Number,
    }, 
    media: [{ 
      tier: String,
      link: String,
      caption: String
    }],
    status: {
      type: Boolean,
      default: true
    },
    description: String,
    serialNumber: {
      type: Number,
    }
  }],
  serialNumber: {
    type: Number,
  }
  
});

module.exports = mongoose.model("Module", moduleSchema, "Modules");
