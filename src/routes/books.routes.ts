import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import adminOnly from "../middlewares/adminOnly.js";
import CreateCategory from "../Controllers/CreateBooksCategory.js";

const router = express.Router();

router.post("/books/category", verifyToken, adminOnly, CreateCategory);

export default router;
