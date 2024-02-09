import mongoose from "mongoose";

const terminalSchema = new mongoose.Schema({
  history: [String],
  current: String,
});

const graphicSchema = new mongoose.Schema({
  content: String,
});

const fileSchema = new mongoose.Schema({
  name: String,
  content: String,
  terminal: terminalSchema,
  graphic: graphicSchema,
  user_id: mongoose.Schema.Types.ObjectId,
});

const File = mongoose.model("File", fileSchema);

export default File;