"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.signUpService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const JWT_SECRET = process.env.JWT_SECRET || "CraftCrazy.com";
const signUpService = async (name, email, phone, password) => {
    const userExist = await user_model_1.default.findOne({ email });
    if (userExist)
        throw new Error("User Alredy exists");
    const user = new user_model_1.default({ name, email, phone, password, role: "user" });
    await user.save();
    const token = (0, jwt_1.generateToken)(user._id.toString(), user.name, user.email);
    return { user, token };
};
exports.signUpService = signUpService;
const loginService = async (email, password) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid Credentials");
    const isMatch = user.comparePassword(password);
    if (!isMatch)
        throw new Error("Invalid Credentials");
    const token = (0, jwt_1.generateToken)(user._id.toString(), user.name, user.email);
    return { user, token };
};
exports.loginService = loginService;
