import mongoose, { Schema, Types } from "mongoose";

// const terminalSchema = new mongoose.Schema({
//   _id: false,
//   history: [String],
//   current: String,
// });

interface IGraphic {
  content?: string;
}

const graphicSchema = new Schema<IGraphic>(
  {
    content: { type: String },
  },
  { _id: false },
);

interface IFile {
  name: string;
  content?: string;
  // terminal: ITerminal;
  graphic: IGraphic;
  user_id: Types.ObjectId;
  username: string;
  published: boolean;
  deleted: boolean;
}

const fileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  content: { type: String },
  // terminal: terminalSchema,
  graphic: { type: graphicSchema, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  username: { type: String, required: true },
  published: { type: Boolean, required: true, default: false },
  deleted: { type: Boolean, required: true, default: false },
});

const File = mongoose.model<IFile>("File", fileSchema);

export default File;
