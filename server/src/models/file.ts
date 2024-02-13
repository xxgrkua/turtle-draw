import mongoose, { Schema, Types } from "mongoose";

// const terminalSchema = new mongoose.Schema({
//   _id: false,
//   history: [String],
//   current: String,
// });

interface IGraphic {
  content: string;
}

const graphicSchema = new Schema<IGraphic>(
  {
    content: { type: String, required: true },
  },
  { _id: false },
);

interface IFile {
  name: string;
  content: string;
  // terminal: ITerminal;
  graphic: IGraphic;
  user_id: Types.ObjectId;
  published: boolean;
}

const fileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  content: { type: String, required: true },
  // terminal: terminalSchema,
  graphic: { type: graphicSchema, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  published: { type: Boolean, required: true, default: false },
});

const File = mongoose.model<IFile>("File", fileSchema);

export default File;
