// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://esmxqnpfjdalneuputji.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbXhxbnBmamRhbG5ldXB1dGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Njc0MjgsImV4cCI6MjA2MjA0MzQyOH0.Et5lgeu5KWiZ2dNxd-HlAcbR0vgpyUxwcSZjVjlv5Js";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);