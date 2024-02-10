import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login_name: String,
  nickname: String,
  password_digest: String,
});

const User = mongoose.model("User", userSchema);

export default User;
