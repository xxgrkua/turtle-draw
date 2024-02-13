import mongoose, { Schema, Types } from "mongoose";

interface IWorkspace {
  name: string;
  files: Types.ObjectId[];
  opened_files: Types.ObjectId[];
  active_file: Types.ObjectId;
  deleted: boolean;
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  files: [{ type: Schema.Types.ObjectId, required: true, ref: "File" }],
  opened_files: [{ type: Schema.Types.ObjectId, required: true, ref: "File" }],
  active_file: { type: Schema.Types.ObjectId, required: true, ref: "File" },
  deleted: { type: Boolean, required: true, default: false },
});

interface IWorkbench {
  user_id: Types.ObjectId;
  workspaces: IWorkspace[];
  active_workspace: Types.ObjectId;
  deleted: boolean;
}

const workbenchSchema = new Schema<IWorkbench>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  workspaces: [{ type: workspaceSchema, required: true }],
  active_workspace: { type: Schema.Types.ObjectId, required: true },
  deleted: { type: Boolean, required: true, default: false },
});

const Workbench = mongoose.model<IWorkbench>("Workbench", workbenchSchema);

export default Workbench;
