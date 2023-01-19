const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please fill your email!"],
    unique: [true, "Email is already registered!"],
    lowercase: true,
    validate: [isEmail, "Please fill valid email!"],
  },
  username: {
    type: String,
    required: [true, "Your username is required!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: [6, "Password should be at least 6 characters!"],
  },
  userRole: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const userPrm = await user.userRole;
    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (isPasswordTrue) {
      return user;
    } else {
      throw Error("Incorrect password!");
    }
  } else {
    throw Error("Email provided does not connected with any accounts!");
  }
};

const User = mongoose.model("user", userSchema);
module.exports = User;
