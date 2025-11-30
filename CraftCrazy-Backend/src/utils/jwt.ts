import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "craftCrazy.com";


export const generateToken = (userId:string,name: string, email: string) => {
    return jwt.sign({userId,name,email},JWT_SECRET, {expiresIn: "7d"} );
};


export const verifyToken = (token:string) => {
    return jwt.verify(token,JWT_SECRET);
}