import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login_name: String,
  display_name: String,
  password: String,
  // password_digest: String,
  // salt: String,
});

const User = mongoose.model("User", userSchema);

export default User;
