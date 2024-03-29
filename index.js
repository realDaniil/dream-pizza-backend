import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";
import checkAdmin from "./utils/checkAdmin.js";
import { router } from "./routes/index.js";
import "dotenv/config.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const app = express();
const DB_URL = process.env.MONGODB_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/", router);

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     if (!fs.existsSync("uploads")) {
//       fs.mkdirSync("uploads");
//     }
//     cb(null, "uploads");
//   },
//   filename: (_, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     const newFilename = `${path.basename(
//       file.originalname,
//       ext
//     )}-${uniqueSuffix}${ext}`;
//     cb(null, newFilename);
//   },
// });

// const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", checkAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return res.status(500).json({ error: "Failed to upload image" });
        }
        res.json({
          url: result.secure_url,
          cloudinary: result,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

const startApp = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB ok");
    app.listen(process.env.PORT || 4444, () => {
      console.log(`Server started`);
    });
  } catch (error) {
    console.log("Помилка під час підключення до Mongo DB", error);
  }
};

startApp();
