"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const demand_controller_1 = require("../controllers/demand.controller");
const router = express_1.default.Router();
router.post("/create", demand_controller_1.uploadMiddleware, demand_controller_1.createDemandController);
//addmin panel
router.get("/demandOrder", demand_controller_1.demandOrders);
exports.default = router;
