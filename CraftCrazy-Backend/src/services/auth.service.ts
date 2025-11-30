import User, {IUserDocument} from "../models/user.model";
import { generateToken } from "../utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "CraftCrazy.com";

export const signUpService = async(name:string,email:string,phone:Number,password:string) => {
    const userExist = await User.findOne({email});

    if(userExist) throw new Error("User Alredy exists");

    const user = new User({name,email,phone,password, role: "user"});
    await user.save();

    const token = generateToken(user._id.toString(),user.name, user.email);

    return {user,token};
    
}

export const loginService = async (email:string, password:string) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("Invalid Credentials");

    const isMatch = user.comparePassword(password);
    if(!isMatch) throw new Error("Invalid Credentials");
    
    const token = generateToken(user._id.toString(),user.name,user.email);
    return {user,token};
}