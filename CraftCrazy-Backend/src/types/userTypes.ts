export interface IUser {
    name : string;
    email:string;
    phone:Number;
    password:string;
    comparePassword:(candidatePassword:string) => Promise<Boolean>
    role?: "user" | "admin";
}