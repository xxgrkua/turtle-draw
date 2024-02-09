import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
  name: String,
  files: [mongoose.Schema.Types.ObjectId],
  opened_files: [mongoose.Schema.Types.ObjectId],
  active_file: mongoose.Schema.Types.ObjectId,
});

const workbenchSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  workspaces: [workspaceSchema],
  active_workspace: mongoose.Schema.Types.ObjectId,
});

const Workbench = mongoose.model("Workbench", workbenchSchema);

export default Workbench;
