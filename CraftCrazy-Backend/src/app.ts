import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

// Allowed domains list
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_PANEL_URL,
];

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin); // For debugging

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// check route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running...");
});

// Global error handler
app.use(errorHandler);

export default app;
