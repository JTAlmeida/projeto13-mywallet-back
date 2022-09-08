import express from "express";
import joi from "joi";
import cors from "cors";
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";
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

app.get("/", async (req, res) => {
  try {
    const data = await db.collection("user").find().toArray();
    return res.send(data);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      hint: "It's better to check if database is properly connected.",
    });
  }
});

app.post("/", async (req, res) => {
  try {
    await db.collection("user").insertOne(req.body);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      hint: "It's better to check if database is properly connected.",
    });
  }
});

app.listen(5000);
