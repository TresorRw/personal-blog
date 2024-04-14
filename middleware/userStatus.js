const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Checking user auth key
const authUser = async (req, res, next) => {
  const token = req.cookies.pbtkn;
  if (token) {
    jwt.verify(token, "personal-brand-app", async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ status: 400, message: err.message });
      } else {
        const user_id = decodedToken.id;
        // checking user permissions
        const user_check = await User.findOne({ _id: user_id });
        const resp = await user_check;
        if (resp.userRole == 1) {
          next();
        } else {
          res.status(403).json({
            status: 403,
            message: "Insufficient Permissions. Login to continue!",
          });
        }
      }
    });
  } else {
    res.status(403).json({
      status: 403,
      message: "Insufficient Permissions or invalid token!",
    });
  }
};

// Limiting liking and commenting on not logged in user
const allowUser = async (req, res, next) => {
  const token = req.cookies.pbtkn;
  if (token) {
    next();
  } else {
    res.status(403).json({
      status: 403,
      message:
        "Permissions denied. you have to login to like or comment on a post.",
    });
  }
};
module.exports = { authUser, allowUser };
