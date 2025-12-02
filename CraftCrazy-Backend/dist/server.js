"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const initSocket_1 = require("./socket/initSocket");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Create HTTP server
const server = http_1.default.createServer(app_1.default);
//  Initialize Socket.IO
(0, initSocket_1.initSocket)(server);
// Connect to MongoDB
(0, db_1.connectDB)();
// start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
