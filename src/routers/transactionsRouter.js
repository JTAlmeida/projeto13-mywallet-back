import {
  getTransactions,
  createTransaction,
} from "../controllers/transactionsController.js";
import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";
import { transactionValidationMiddleware } from "../middlewares/schemasValidationMiddleware.js";
import express from "express";

const router = express.Router();

router.use(userAuthMiddleware);
router.get("/transactions", getTransactions);
router.post("/transactions", transactionValidationMiddleware ,createTransaction);

export default router;
