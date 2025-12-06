import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

// Explicitly define allowed origins
const allowedOrigins = [
  "https://craftcrazycom.vercel.app/",
  "https://craftcrazy-admincom.vercel.app/",
];

// Debug log 
console.log("ALLOWED ORIGINS =>", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin =>", origin);

      if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.error("CORS Blocked:", origin);
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running...");
});

app.use(errorHandler);

export default app;
