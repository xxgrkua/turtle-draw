import mongoose, { Schema, Types } from "mongoose";

interface IWorkspace {
  name: string;
  files: Types.ObjectId[];
  opened_files: Types.ObjectId[];
  active_file: Types.ObjectId;
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  files: { type: [Schema.Types.ObjectId], required: true },
  opened_files: { type: [Schema.Types.ObjectId], required: true },
  active_file: { type: Schema.Types.ObjectId, required: true },
});

interface IWorkbench {
  user_id: Types.ObjectId;
  workspaces: IWorkspace[];
  active_workspace: Types.ObjectId;
}

const workbenchSchema = new Schema<IWorkbench>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  workspaces: { type: [workspaceSchema], required: true },
  active_workspace: { type: Schema.Types.ObjectId, required: true },
});

const Workbench = mongoose.model<IWorkbench>("Workbench", workbenchSchema);

export default Workbench;
