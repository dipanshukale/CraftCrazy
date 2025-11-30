import { Demand } from "../models/demand.model";
import { IDemand } from "../types/demandTypes";

export const createDemandService = async (data: IDemand) => {
  const newDemand = new Demand(data);
  return await newDemand.save();
};

export const getAllDemandService = async() => {
  return await Demand.find().sort({createdAt:-1});
}