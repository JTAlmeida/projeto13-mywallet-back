import express from "express";
import { transactionSchema } from "./schemas/transactionSchema.js";
import cors from "cors";
import dayjs from "dayjs";
import db from "./database/db.js";
import { userSignIn, createUser } from "./controllers/authController.js";
import {
  getTransactions,
  createTransaction,
} from "./controllers/transactionsController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/auth/sign-in", userSignIn);
app.post("/auth/sign-up", createUser);

app.get("/transactions", getTransactions);
app.post("/transactions", createTransaction);

app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
