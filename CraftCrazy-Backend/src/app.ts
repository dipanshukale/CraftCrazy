import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();
const allowedOrigins = [
  process.env.FRONTEND_URL ?? "https://craft-crazy.vercel.app",
  process.env.ADMIN_PANEL_URL ?? "https://craft-crazy-bu3y.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
