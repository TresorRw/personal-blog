const mongoose = require("mongoose");
const dislikeSchema = new mongoose.Schema({
  postID: String,
  userID: String,
  dislikeDate: String,
});

const disLike = mongoose.model("dislike", dislikeSchema);
module.exports = disLike;
