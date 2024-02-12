import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  login_name: string;
  nickname: string;
  password_digest: string;
  published_files?: Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  login_name: { type: String, required: true },
  nickname: { type: String, required: true },
  password_digest: { type: String, required: true },
  published_files: [{ type: Schema.Types.ObjectId, ref: "PublishedFile" }],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
