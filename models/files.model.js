import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Fix: Changed variable name to FileModel and export name
const FileModel = mongoose.model('File', fileSchema);

export default FileModel;