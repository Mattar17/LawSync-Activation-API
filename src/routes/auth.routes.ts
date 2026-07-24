import express from "express";

import { Login } from "../Controllers/Login.js";
import Register from "../Controllers/Register.js";
import AccessPortal from "../Controllers/AccessPortal.js";

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/portal-access", AccessPortal);

export default router;
