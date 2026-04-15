import app from "./app.js";
import connectDB from "./db/db.connection.js";

export default async function handler(req, res) {
  await connectDB(); // ensure DB is connected

  return app(req, res); // pass request to Express
}
