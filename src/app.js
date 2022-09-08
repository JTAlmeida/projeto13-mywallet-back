import express from "express";
import joi from "joi";
import cors from "cors";
import dayjs from "dayjs";
import { MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());



app.listen(5000);