  import express from "express"
  import cookieParser from "cookie-parser"
  import cors from "cors";
  
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import conceptRouter from "./routes/concept.routes.js";

  const app = express();

  const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) || [];
  const isOriginAllowed = (origin) => {
    if (!origin) return false;
    const normalizedOrigin = origin.trim();
    const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
    return allowedOrigins.includes(normalizedOrigin) || isLocalhostOrigin;
  };

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Accept,Origin,X-Requested-With");
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

  app.use(express.json({limit: "50kb"}))
  app.use(express.urlencoded({ extended: true, limit: "50kb" }))
  app.use(express.static("public"))
  app.use(cookieParser())
  
  app.use("/api/v1/users",userRouter);
  app.use("/api/v1/resume",resumeRouter);
  app.use("/api/v1/interview",interviewRouter);
  app.use("/api/v1/concept",conceptRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || err.status || err.code || 500;
  const message = err.message || "Internal Server Error";
  const success = statusCode < 400;

  res.status(statusCode).json({
    statusCode,
    success,
    message,
    data: err.data || null,
  });
});

  
export default app;
