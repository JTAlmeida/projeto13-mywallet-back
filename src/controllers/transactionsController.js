import dayjs from "dayjs";
import db from "../database/db.js";
import { transactionSchema } from "../schemas/transactionSchema.js";

export async function getTransactions(req, res) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({ message: "Invalid token!" });
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res
        .status(401)
        .send({ message: "Session not found! Please log in again." });
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const transactions = await db
      .collection("transactions")
      .find({ userId: user._id })
      .toArray();

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

export async function createTransaction(req, res) {
  const { type, amount, description } = req.body;

  const validation = transactionSchema.validate(
    { type, amount, description },
    { abortEarly: false }
  );

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({ message: "Invalid token!" });
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res
        .status(401)
        .send({ message: "Session not found! Please log in again." });
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    await db.collection("transactions").insertOne({
      type,
      description,
      amount,
      date: dayjs().format("DD/MM"),
      userId: user._id,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}
