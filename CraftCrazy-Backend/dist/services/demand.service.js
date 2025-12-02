"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDemandService = exports.createDemandService = void 0;
const demand_model_1 = require("../models/demand.model");
const createDemandService = async (data) => {
    const newDemand = new demand_model_1.Demand(data);
    return await newDemand.save();
};
exports.createDemandService = createDemandService;
const getAllDemandService = async () => {
    return await demand_model_1.Demand.find().sort({ createdAt: -1 });
};
exports.getAllDemandService = getAllDemandService;
