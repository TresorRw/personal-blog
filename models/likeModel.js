const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({
  postID: String,
  userID: String,
  likeDate: String,
});

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
