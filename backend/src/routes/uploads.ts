import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { processFileWithGemini } from "../services/gemini-services";
import path from "path";
import os from "os";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(os.tmpdir(), "uploads");

    // Use fs.promises to handle async directory creation
    fs.promises
      .mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch((err) => cb(err, uploadDir));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.oasis.opendocument.spreadsheet", // .ods
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, PDF, and Excel files are allowed."
        )
      );
    }
  },
});
router.post(
  "/upload",
  upload.array("files"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files as Express.Multer.File[];
      const results = [];

      // Process each file
      for (const file of files) {
        try {
          const result = await processFileWithGemini(file.path, file.mimetype);
          results.push({
            filename: file.originalname,
            result: result,
          });
        } catch (error) {
          console.error(`Error processing ${file.originalname}:`, error);
          results.push({
            filename: file.originalname,
            error: error instanceof Error ? error.message : "Processing failed",
          });
        } finally {
          // Always try to remove the file, even if processing failed
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error(`Failed to delete ${file.path}:`, unlinkError);
          }
        }
      }

      res.json({
        message: "Files processed",
        results: results,
      });
    } catch (error) {
      console.error("Unexpected error processing files:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
