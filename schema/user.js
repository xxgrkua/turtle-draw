import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login_name: String,
  nickname: String,
  password: String,
  // password_digest: String,
  // salt: String,
});

const User = mongoose.model("User", userSchema);

export default User;
