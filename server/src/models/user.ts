import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  username: string;
  nickname: string;
  password_digest: string;
  published_files?: Types.ObjectId[];
  deleted: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  nickname: { type: String, required: true },
  password_digest: { type: String, required: true },
  published_files: [{ type: Schema.Types.ObjectId, ref: "PublishedFile" }],
  deleted: { type: Boolean, required: true, default: false },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
