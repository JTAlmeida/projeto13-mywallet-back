import {
  getTransactions,
  createTransaction,
} from "../controllers/transactionsController.js";
import express from "express";

const router = express.Router();

router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);

export default router;
