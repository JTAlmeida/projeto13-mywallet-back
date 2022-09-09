import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import transactionsRouter from "./routers/transactionsRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transactionsRouter);

app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
