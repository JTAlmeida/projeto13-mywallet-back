import db from "../database/db.js";

export async function userAuthMiddleware(req, res, next) {
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

  res.locals.user = user;

  next();
}
