import mongoose from "mongoose";

const publishedFileSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  author_id: mongoose.Schema.Types.ObjectId,
  author: String,
  file_id: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
});

const PublishedFile = mongoose.model("Gallery", publishedFileSchema);

export default PublishedFile;
