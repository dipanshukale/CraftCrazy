"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
// socket/initSocket.ts
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
let io;
dotenv_1.default.config();
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ADMIN_PANEL_URL, // you can restrict to your admin panel domain
            methods: ["GET", "POST", "PATCH"]
        }
    });
    io.on("connection", (socket) => {
        console.log("New Client Connected:", socket.id);
        // when admin triggers message
        socket.on("admin-message", (data) => {
            console.log("Admin Sent:", data);
            io.emit("broadcast-message", data); // broadcast to all panel clients
        });
        // when order is placed from admin panel user
        socket.on("order-created", (orderData) => {
            console.log("New Order Created:", orderData);
            io.emit("order-updated", orderData); //send update to admin panel UI
            io.emit("trend:update");
        });
        socket.on("searching-adminData", (data) => {
            io.emit("search_result", data);
        });
        //for contact 
        socket.on("contact-created", (data) => {
            io.emit("contact-updated", data);
        });
        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id);
        });
    });
};
exports.initSocket = initSocket;
const getIO = () => io;
exports.getIO = getIO;
