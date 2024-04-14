const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, "Please provide your names!"],
  },
  profileImg: String,
  profession: {
    type: String,
    required: [true, "What is your profession?"],
  },
  profAddress: {
    type: String,
    required: [true, "Please specify your address!"],
  },
  skills: {
    type: String,
    required: [true, "Please specify at least two skills!"],
  },
  experience: {
    type: String,
    required: [true, "Please tell us a bit about your recent work!"],
  },
  socialMedia: {
    type: String,
    required: [true, "Share at least one social media handle!"],
  },
});

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;
