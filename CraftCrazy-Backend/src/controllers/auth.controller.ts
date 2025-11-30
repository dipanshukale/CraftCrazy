import { Request,Response,NextFunction} from "express";
import * as authService from "../services/auth.service";

export const signUp = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {name,email,phone,password} = req.body;
        const result = await authService.signUpService(name,email,phone,password);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}


export const login = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const{email,password} = req.body;
        const result = await authService.loginService(email,password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}