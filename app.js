import express from "express"
import dotenv from "dotenv"
import errorMiddleware from "./middlewares/error.middlewares.js"
import genderPredictionRoute from "./routes/genderPrediction.routes.js"

const app = express();
dotenv.config()

app.use("/", genderPredictionRoute);

app.use(errorMiddleware);

export default app
