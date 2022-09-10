import dayjs from "dayjs";
import db from "../database/db.js";

export async function getTransactions(req, res) {
  const user = res.locals.user;

  try {
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
  const user = res.locals.user;
  const { type, amount, description } = req.body;

  try {
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
