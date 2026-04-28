import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middlewares/error.middlewares.js"
import profilesRoute from "./routes/profiles.routes.js"
import authRoute from "./routes/auth.routes.js"

const app = express();
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api", profilesRoute);
app.use("/auth", authRoute);
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorMiddleware);

export default app;
