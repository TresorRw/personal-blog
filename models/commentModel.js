const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  postID: String,
  userID: String,
  commentText: String,
  commentDate: String,
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
