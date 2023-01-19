const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please type post title!"],
  },
  category: {
    type: String,
    required: [true, "Post category is required!"],
  },
  content: {
    type: String,
    required: [true, "Please provide post description!"],
  },
  postDate: {
    type: String,
  },
  postImage: {
    type: String,
  },
});

postSchema.pre("save", async function (next) {
  const date = new Date();
  this.postDate = date.toGMTString();
  next();
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;
