import mongoose, { Schema, Types } from "mongoose";

interface IPublishedFile {
  title: string;
  description?: string;
  image: string;
  author_id: Types.ObjectId;
  author: string;
  file_id: Types.ObjectId;
  date: Date;
}

const publishedFileSchema = new Schema<IPublishedFile>({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  author_id: { type: Schema.Types.ObjectId, required: true },
  author: { type: String, required: true },
  file_id: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
});

const PublishedFile = mongoose.model<IPublishedFile>(
  "PublishedFile",
  publishedFileSchema,
);

export default PublishedFile;
