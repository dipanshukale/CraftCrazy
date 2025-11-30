import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error.middleware";


dotenv.config();

const app: Application = express();

if (!process.env.FRONTEND_URL || !process.env.ADMIN_PANEL_URL) {
  throw new Error("Missing FRONTEND_URL or ADMIN_PANEL_URL in .env file");
}

// Middlewares
app.use(cors({
  origin: [process.env.FRONTEND_URL || "", process.env.ADMIN_PANEL_URL || ""],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
  credentials: true,

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api",routes);

//check route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running...");
});

// Global error handler
app.use(errorHandler);

export default app;
