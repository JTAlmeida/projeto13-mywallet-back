import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;
try {
  await mongoClient.connect();
  db = mongoClient.db(process.env.DB_NAME);
} catch (error) {
  console.error(`Error "${error}" while trying to connect to database.`);
}

export default db;
