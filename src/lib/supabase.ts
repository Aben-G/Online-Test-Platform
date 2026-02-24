import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials in .env file");
}

// Ensure URL is valid to prevent crash, even if connection fails later
const validUrl = supabaseUrl && supabaseUrl.startsWith("http") 
  ? supabaseUrl 
  : `https://${supabaseUrl || "placeholder"}.supabase.co`;

export const supabase = createClient(validUrl, supabaseKey || "placeholder-key");
