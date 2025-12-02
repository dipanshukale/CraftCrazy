"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Explicitly define allowed origins
const allowedOrigins = [
    "https://craft-crazy.vercel.app",
    "https://craft-crazy-bu3y.vercel.app",
];
// Debug log (optional)
console.log("ALLOWED ORIGINS =>", allowedOrigins);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log("Request Origin =>", origin);
        if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
            callback(null, true);
        }
        else {
            console.error("CORS Blocked:", origin);
            callback(new Error("CORS blocked: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", index_1.default);
app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
