import express from "express";
import { authSignIn, authSignUp } from "./schemas/authSchemas.js";
import { transactionSchema } from "./schemas/transactionSchema.js";
import cors from "cors";
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient
  .connect()
  .then(() => {
    db = mongoClient.db("mywallet");
  })
  .catch((error) => {
    return console.error(
      `Error "${error}" while trying to connect to database.`
    );
  });

app.post("/auth/sign-in", async (req, res) => {
  const user = req.body;

  const validation = authSignIn.validate(user, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  try {
    const checkUser = await db
      .collection("users")
      .findOne({ email: user.email });

    const checkPassword = checkUser
      ? bcrypt.compareSync(user.password, checkUser.password)
      : false;

    if (!checkUser || !checkPassword) {
      return res
        .status(422)
        .send({ message: "Error: wrong email or password." });
    }

    await db.collection("sessions").deleteMany({ userId: checkUser._id });

    const token = uuid();

    await db.collection("sessions").insertOne({ token, userId: checkUser._id });

    return res.status(200).send({
      message: `${checkUser.name} successfully logged in!`,
      token,
      user: { name: checkUser.name, email: checkUser.email },
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

app.post("/auth/sign-up", async (req, res) => {
  const user = req.body;

  const validation = authSignUp.validate(user, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  try {
    const checkEmail = await db
      .collection("users")
      .findOne({ email: user.email });
    if (checkEmail) {
      return res
        .status(409)
        .send({ message: "This email is already being used." });
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await db.collection("users").insertOne({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

app.get("/transactions", async (req, res) => {
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
});

app.post("/transactions", async (req, res) => {
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
});

app.listen(5000, () => {
  console.log("Listening on port 5000.");
});
