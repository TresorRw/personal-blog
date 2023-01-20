const jwt = require("jsonwebtoken");
const Comment = require("../models/commentModel");
const Like = require("../models/likeModel");
const Message = require("../models/messageModel");
const Post = require("../models/postModel");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
// Error handler function
const errorHandler = (err) => {
  const errors = {
    email: "",
    username: "",
    password: ""
  };

  // Signup error handler
  if (err.code == 11000) {
    errors.email = "Email Aleady exists!";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }
  // Sign in handler
  if (
    err.message.includes("Email provided does not connected with any accounts!")
  ) {
    errors.email = "Email does not connected with any accounts!";
    delete errors.username;
  }
  if (err.message.includes("Incorrect password!")) {
    errors.password = "Incorrect password!";
    delete errors.username;
  }
  return errors;
};
// Message error handler
const messageErrorHandler = (err) => {
  const errors = {
    names: "",
    email: "",
    messageContent: ""
  };
  if (err.message.includes("message validation failed")) {
    Object.values(err.errors).forEach((er) => {
      errors[er.properties.path] = er.properties.message;
    });
    return errors;
  }
};

const postErrorHandler = (err) => {
  let errors = {
    title: "",
    category: "",
    content: ""
  };
  if (err.message.includes("post validation failed")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.properties.path] = error.properties.message;
    });
    return errors;
  }
};
const profileErrorHandler = err => {
  const error = {
    names: '',
    profession: '',
    skills: '',
    profAddress: '',
    experience: '',
    socialMedia: ''
  }
  if (err.message.includes('profile validation failed')) {
    Object.values(err.errors).forEach(erro => {
      error[erro.properties.path] = erro.properties.message;
    });
    return error;
  }
}
// Dates
const date_today = () => {
  const date = new Date();
  const commentDate = date.toDateString() + " " + date.toLocaleTimeString();
  return commentDate;
};

// Create token
const duration = 5 * 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({
    id
  }, "personal-brand-app", {
    expiresIn: duration,
  });
};

// Routes handler
module.exports.signup_get = (req, res) => {
  res.render("sign-up");
};

// Handle sign up
module.exports.signup_post = async (req, res) => {
  const {
    email,
    username,
    password
  } = req.body;
  try {
    const newUser = await User.create({
      email,
      username,
      password
    });
    const token = createToken(newUser._id);
    res.cookie("pbtkn", token, {
      maxAge: duration * 1000
    });
    res.status(201).json({
      user: newUser,
      token
    });
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({
      status: 400,
      message: "Please review your inputs",
      errors
    });
  }
};

// Post saving handler
module.exports.postBlog = async (req, res) => {
  const {
    title,
    category,
    content,
    postImage
  } = req.body;
  try {
    const postDate = new Date();
    const timestamp = postDate.toLocaleString();
    const newPost = await Post.create({
      title,
      category,
      content,
      timestamp,
      postImage,
    });
    res.status(201).json({
      status: 201,
      message: "Your blog is posted.",
      data: newPost
    });
  } catch (err) {
    const errors = postErrorHandler(err);
    res.status(400).json({
      status: 400,
      message: "You have errors",
      errors
    });
  }
};

// Handle login
module.exports.login_post = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  try {
    const login = await User.login(email, password);
    const authToken = createToken(login._id);
    const userRole = login.userRole;
    const user_id = login._id;
    res.cookie("uipid", user_id, {
      maxAge: duration * 1000
    });
    res.cookie("pbtkn", authToken, {
      maxAge: duration * 1000
    });
    res.status(200).json({
      user: login._id,
      userRole,
      authToken
    });
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({
      status: 400,
      message: "Incorrect credentials",
      errors
    });
  }
};

// Rendering posts handler
module.exports.renderPosts = async (req, res) => {
  // fetching from mongo
  try {
    const results = await Post.find();
    if (results.length == 0) {
      res.status(404).json({
        status: 404,
        message: "No stored posts"
      });
    } else {
      res
        .status(200)
        .json({
          status: 200,
          message: "All stored posts",
          results
        });
    }
  } catch (err) {
    console.log(err);
  }
};

// render single post
module.exports.singleView = async (req, res) => {
  res.render("single", {
    post: req.query.post,
  });
};

module.exports.single = async (req, res) => {
  try {
    const request = await Post.findOne({
      _id: req.query.post
    });
    res.status(200).json({
      status: 200,
      request
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      error: "Post not found"
    });
  }
};

/* Like and commenting */

// Liking
module.exports.like_post = async (req, res) => {
  const {
    post_id
  } = req.body;
  const u_id = req.cookies.pbtkn;
  try {
    const checkAv = await Post.findOne({
      _id: post_id
    });
    const result = await checkAv;
    jwt.verify(u_id, "personal-brand-app", async (err, decodedToken) => {
      if (err) {
        res.status(400).json({
          status: 400,
          message: "Bad request",
          err
        });
      } else {
        const user_id = decodedToken.id;
        const date = new Date();
        const likeDate = date.toDateString() + " " + date.toLocaleTimeString();

        const newLike = {
          postID: post_id,
          userID: user_id,
          likeDate,
        };
        // Checking if like exists and delete it
        const check = await Like.findOne({
          postID: post_id,
          userID: user_id
        });
        const t = await check;
        if (t == null) {
          const saveLike = await Like.create(newLike);
          res
            .status(201)
            .json({
              status: 201,
              message: "Your like added successfully",
              info: [saveLike],
            });
        } else {
          const likeID = t._id;
          try {
            const deleteLike = await Like.deleteOne({
              _id: likeID
            });
            const result = await deleteLike;
            res
              .status(200)
              .json({
                status: 200,
                message: "You disliked the post."
              });
          } catch (errr) {
            res.status(400).json({
              errr
            });
          }
        }
      }
    });
  } catch (er) {
    res.status(400).json({
      status: 400,
      message: "Invalid post id"
    });
  }
};
module.exports.getLikes = async (req, res) => {
  // fetching from mongo
  const {
    post
  } = req.query;
  try {
    const results = await Like.find({
      postID: post
    });
    if (results.length == 0) {
      res.status(404).json({
        status: 404,
        message: "No Likes"
      });
    } else {
      res
        .status(200)
        .json({
          status: 200,
          message: "All Liked post",
          results
        });
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports.getComments = async (req, res) => {
  const {
    post
  } = req.query;
  try {
    const resultsComments = await Comment.find({
      postID: post
    });
    let rs = [];
    let resAll = [];
    for (let cm of resultsComments) {
      const resultUsers = await User.find({
        _id: cm.userID
      });
      rs.push(resultUsers[0]);
    }
    rs.map(async (ev, ix) => {
      resAll.push({
        names: ev.username
      });
    });
    for (let i = 0; i < await resultsComments.length; i++) {
      resAll[i].message = await resultsComments[i].commentText;
    }
    res.status(200).json({
      status: 200,
      text: "All messages",
      comments: resAll
    });
  } catch (err) {
    console.log(err);
  }
}

// Commenting
module.exports.comment_post = async (req, res) => {
  const {
    post_id,
    commentText
  } = req.body;
  const u_id = req.cookies.pbtkn;
  try {
    const checkAv = await Post.findOne({
      _id: post_id
    });
    const result = await checkAv;
    if (!post_id || !commentText || !u_id) {
      res
        .status(400)
        .json({
          status: 400,
          message: "Please provide all required data."
        });
    } else {
      jwt.verify(u_id, "personal-brand-app", async (err, decodedToken) => {
        if (err) {
          res.status(400).json({
            status: 400,
            message: "Bad request",
            err
          });
        } else {
          const user_id = decodedToken.id;
          const commentDate = date_today();
          const newComment = {
            postID: post_id,
            userID: user_id,
            commentText,
            commentDate,
          };
          try {
            const comment = await Comment.create(newComment);
            res
              .status(201)
              .json({
                status: 201,
                message: "Your comment is saved!",
                data: [comment],
              });
          } catch (error) {
            console.log(error);
            res.status(400).json({
              status: 400,
              message: "Bad Request",
              error
            });
          }
        }
      });
    }
  } catch (er) {
    res.status(400).json({
      status: 400,
      message: "Invalid post id"
    });
  }
};

/* modifying a post */
// Deleting post
module.exports.deletePost = async (req, res) => {
  const post_id = req.body.post;
  if (!post_id) {
    res.status(400).json({
      status: 400,
      message: "Please provide post id."
    });
  } else {
    try {
      const dele = await Post.deleteOne({
        _id: post_id
      });
      res
        .status(202)
        .json({
          status: 202,
          message: "Post deleted!",
          deletedCount: dele.deletedCount,
        });
    } catch (err) {
      res
        .status(400)
        .json({
          status: 400,
          message: "Can not delete due to unknown post id.",
        });
    }
  }
};

// Updating a post
module.exports.updatePost = async (req, res) => {
  const {
    title,
    category,
    content
  } = req.body;
  const post = req.query.post;
  if (post) {
    if (!title || !category || !content) {
      res
        .status(400)
        .json({
          status: 400,
          message: "Please provide post details title, category, content",
        });
    } else {
      try {
        const check = await Post.findOne({
          _id: post
        });
        const update = await check.updateOne({
          title,
          category,
          content
        });
        res.status(202).json({
          status: 202,
          message: "Post updated!"
        });
      } catch (error) {
        const errors = errorHandler(error);
        res
          .status(400)
          .json({
            status: 400,
            message: "Something went wrong! Check your post id.",
          });
      }
    }
  } else {
    res
      .status(400)
      .json({
        status: 400,
        message: "Invalid post id or is missing."
      });
  }
};

/* Messages and queries */
// Sending queries
module.exports.sendQuery = async (req, res) => {
  const {
    names,
    email,
    message
  } = req.body;
  const messageDate = date_today();
  try {
    const request = await Message.create({
      names,
      email,
      messageContent: message,
      messageDate,
    });
    res.status(200).json({
      status: 200,
      message: "All good",
      request
    });
  } catch (err) {
    const errors = messageErrorHandler(err);
    res
      .status(400)
      .json({
        status: 400,
        message: "Please verify your inputs!",
        errors
      });
  }
};

// Viewing all queries
module.exports.viewMessages = async (req, res) => {
  try {
    const msgs = await Message.find().sort({messageDate: -1}).limit(5);
    res.status(200).json({
      status: 200,
      message: "All visitor's messages.",
      messages: msgs
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Can not process your request!"
    });
  }
}

// profile
module.exports.profile = async (req, res) => {
  try {
    const getProfile = await Profile.find();
    if (getProfile.length == 0) {
      res.status(200).json({
        status: 200,
        message: "No admin profile found!"
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Profile",
        profileInformation: getProfile
      })
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Invalid request",
      error
    });
  }
}

// Saving profile 
module.exports.saveProfile = async (req, res) => {
  const {
    names,
    profession,
    profAddress,
    skills,
    experience,
    socialMedia
  } = req.body;
  let profileImg = req.body.profileImg;
  if (!profileImg) {
    profileImg = 'https://icons8.com/icon/108652/user';
  }
  try {
    const prof = await Profile.create({
      names,
      profileImg,
      profession,
      profAddress,
      skills,
      experience,
      socialMedia
    });
    res.status(201).json({
      status: 201,
      message: "Profile saved!",
      data: prof
    });
  } catch (error) {
    const errors = profileErrorHandler(error);
    res.status(400).json({
      status: 400,
      message: "You have errors",
      errors
    });
  }
}