
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';
import AppRoutes from './routes';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://esmxqnpfjdalneuputji.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbXhxbnBmamRhbG5ldXB1dGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NTgzMTMsImV4cCI6MjAzMTEzNDMxM30.OLGxxZf6bgh3B2e7ZWP0VxrHwQD-eYkhO2cHiueCxCk';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
