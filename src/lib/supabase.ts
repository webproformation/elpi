import { createClient } from '@supabase/supabase-js';

// Vos identifiants ANON (Publics)
const supabaseUrl = 'https://reodabjnpnbtugljnspt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlb2RhYmpucG5idHVnbGpuc3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTY1MDYsImV4cCI6MjA4NTc3MjUwNn0.d5sBN5zaFlq13Xz3dyvSjquC9li2BCrBClK06FoFEck';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);