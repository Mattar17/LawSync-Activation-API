import dotenv from "dotenv";

dotenv.config();

console.log("cwd:", process.cwd());
console.log("URL:", process.env.PUBLIC_SUPABASE_URL);
