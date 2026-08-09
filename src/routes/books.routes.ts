import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import adminOnly from "../middlewares/adminOnly.js";
import CreateCategory from "../Controllers/CreateBooksCategory.js";
import {
  GetAllBooksInCategory,
  GetFileUrl,
  UploadBook,
  type FileRequest,
} from "../Controllers/books.controller.js";
import { UploadFile } from "../Services/UploadFile.js";

const router = express.Router();

router.post("/books/category", verifyToken, adminOnly, CreateCategory);
router.post(
  "/books/upload",
  verifyToken,
  adminOnly,
  UploadFile.single("file"),
  UploadBook,
);
router.get("/books/:categoryId", verifyToken, adminOnly, GetAllBooksInCategory);
router.get("/books", verifyToken, adminOnly, GetFileUrl);
export default router;
