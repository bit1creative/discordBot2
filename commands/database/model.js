var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  { discordID: String, count: Number, registrationDate: Date },
  { versionKey: false }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;
