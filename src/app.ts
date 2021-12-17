import express from "express";
const app = express();
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import authRouter from "./routes/authRoutes";
import jobsRouter from "./routes/jobsRoutes";
import userRouter from "./routes/userRoutes";
import helmet from "helmet";
import cors from "cors";
// import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

app.use(express.json());
// extra packages

import authController from "./controllers/authController";

// Security

// rate limmiter
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(cors());
app.use(helmet());
// app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authController.authProtect, jobsRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
