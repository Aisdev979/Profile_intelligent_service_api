import app from "./src/app.js";
import connectDB from "./src/db/db.connection.js";

export default async function handler(req, res) {
  await connectDB(); // ensure DB is connected

  return app(req, res); // pass request to Express
}
