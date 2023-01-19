const mongoose = require("mongoose");
const { isEmail } = require("validator");

const messageSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, "Your names are required!"],
  },
  email: {
    type: String,
    required: [true, "Please provide email!"],
    validate: [isEmail, "Provide a valid email!"],
  },
  messageContent: {
    type: String,
    required: [true, "Please provide your message!"],
  },
  messageDate: String,
});
const Message = mongoose.model("message", messageSchema);
module.exports = Message;
