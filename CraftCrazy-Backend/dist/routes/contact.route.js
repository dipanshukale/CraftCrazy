"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const router = express_1.default.Router();
router.post("/add", contact_controller_1.addContact);
//admin routes
router.get("/all", contact_controller_1.getContact);
router.patch("/update-status/:id", contact_controller_1.updateContactStatus);
exports.default = router;
