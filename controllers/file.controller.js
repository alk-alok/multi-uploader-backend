import { v2 as cloudinary } from "cloudinary";
import FileModel from "../models/files.model.js";  // Updated import name

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFiles = async (req, res) => {
  try {
    console.log("Inside the uploadFiles Folder!");

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        message: "No files provided for upload",
        valid: false
      });
    }

    const files = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads/",
              resource_type: "auto",
            },
            async (err, result) => {
              if (err) {
                console.error("Cloudinary upload error:", err);
                return reject(err);
              }

              try {
                // Updated to use FileModel
                const fileData = new FileModel({
                  originalName: file.originalname,
                  cloudinaryUrl: result.secure_url,
                  size: file.size,
                  mimeType: file.mimetype,
                });

                const savedFile = await fileData.save();
                resolve(savedFile);
              } catch (dbError) {
                console.error("Database save error:", dbError);
                reject(dbError);
              }
            }
          );

          uploadStream.on('error', (error) => {
            console.error("Upload stream error:", error);
            reject(error);
          });

          uploadStream.end(file.buffer);
        });
      })
    );

    res.status(200).json({
      message: "Files uploaded successfully!",
      files: files,
      valid: true,
    });
  } catch (err) {
    console.error("Error uploading files:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      valid: false,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const downloadLinks = async (req, res) => {
  const { files } = req.body;

  try {
    // Updated to use FileModel
    const filesFromMongo = await FileModel.find({ _id: { $in: files } });
    return res.status(200).json({
      message: "Fetched all links",  // Fixed typo
      links: filesFromMongo,
      valid: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server Error",
      valid: false,
      error: err?.message,
    });
  }
};

const getAllList = async (req, res) => {
  try {
    // Updated to use FileModel
    const filesFromMongo = await FileModel.find({});
    // console.log("files>>>>>", filesFromMongo)
    return res.status(200).json({
      message: "Fetched all links",  // Fixed typo
      links: filesFromMongo,
      valid: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      valid: false,
    });
  }
};

export { downloadLinks, uploadFiles, getAllList };