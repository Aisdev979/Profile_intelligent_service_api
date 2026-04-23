import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import errorMiddleware from "./middlewares/error.middlewares.js"
import genderPredictionRoute from "./routes/genderPrediction.routes.js"

const app = express();
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}


app.use(cors());
app.use(express.json());

app.use("/api", genderPredictionRoute);
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorMiddleware);

export default app
