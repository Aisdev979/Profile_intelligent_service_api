import express from "express"
import errorMiddleware from "./middlewares/error.middlewares.js"
import genderPredictionRoute from "./routes/genderPrediction.routes.js"

const app = express();

app.use("/", genderPredictionRoute);

app.use(errorMiddleware);

export default app
