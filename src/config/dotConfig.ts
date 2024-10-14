import dotenv from "dotenv";


dotenv.config();


export const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || "default_refresh_secret_key";
export const PORT = 8000;