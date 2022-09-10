import { userSignIn, createUser } from "../controllers/authController.js";
import express from "express";
import {
  signInValidationMiddleware,
  signUpValidationMiddleware,
} from "../middlewares/schemasValidationMiddleware.js";

const router = express.Router();

router.post("/auth/sign-in", signInValidationMiddleware, userSignIn);
router.post("/auth/sign-up", signUpValidationMiddleware, createUser);

export default router;
