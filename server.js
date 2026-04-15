import app from "./app.js"
import connectDB from "./db/db.connection.js"
const PORT = process.env.PORT || 5000
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(server running on http://localhost:${PORT});
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};
startServer()
