const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  mediaId: {
    type: String,
    default: "-1"
  },
  moduleId: {
    type: String,
    required : true
  },
  userId: {
    type: String,
    required : true
  },
  rating: {
    type: String
  },
  remarks: {
    type: String
  },
  client: {
    type: String
  }

});

module.exports = mongoose.model("Feedback", feedbackSchema, "User Feedback");