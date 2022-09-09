import { userSignIn, createUser } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/auth/sign-in", userSignIn);
router.post("/auth/sign-up", createUser);

export default router;