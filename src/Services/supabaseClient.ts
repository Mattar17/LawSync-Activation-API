import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

console.log(process.env.PUBLIC_SUPABASE_URL);

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL! as string,
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY! as string,
);

export default supabase;
