import mongoose from "mongoose";

interface IUser {
  login_name: string;
  nickname: string;
  password_digest: string;
}

const userSchema = new mongoose.Schema<IUser>({
  login_name: { type: String, required: true },
  nickname: { type: String, required: true },
  password_digest: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
