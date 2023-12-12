import { config } from "dotenv";
config();

export const PORT = 3000;
export const API_KEY = process.env.CHATGPT_API_KEY