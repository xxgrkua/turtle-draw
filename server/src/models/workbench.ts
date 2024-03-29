import mongoose, { Schema, Types } from "mongoose";

interface IFileRef {
  _id: Types.ObjectId;
  name: string;
}

const fileRefSchema = new Schema<IFileRef>({
  _id: { type: Schema.Types.ObjectId, required: true, ref: "File" },
  name: { type: String, required: true },
});

interface IWorkspace {
  _id: Types.ObjectId;
  name: string;
  files: Types.DocumentArray<IFileRef>;
  opened_files: Types.Array<Types.ObjectId>;
  active_file?: Types.ObjectId;
  deleted: boolean;
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  files: [{ type: fileRefSchema }],
  opened_files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  active_file: { type: Schema.Types.ObjectId, ref: "File" },
  deleted: { type: Boolean, required: true, default: false },
});

interface IWorkbench {
  user_id: Types.ObjectId;
  username: string;
  workspaces: Types.DocumentArray<IWorkspace>;
  active_workspace?: Types.ObjectId;
  deleted: boolean;
}

const workbenchSchema = new Schema<IWorkbench>({
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  username: { type: String, required: true },
  workspaces: [{ type: workspaceSchema }],
  active_workspace: { type: Schema.Types.ObjectId },
  deleted: { type: Boolean, required: true, default: false },
});

const Workbench = mongoose.model<IWorkbench>("Workbench", workbenchSchema);

export default Workbench;
