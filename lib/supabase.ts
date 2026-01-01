import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase credentials
// Get these from your Supabase project settings: https://app.supabase.com
// Support both VITE_* (Vite) and NEXT_PUBLIC_* (if you previously used Next/Vercel naming)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Create a mock client if credentials are missing
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn(
        'Supabase credentials not found. Auth features will be disabled. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_*) to your .env.local file.'
    );
    // Create a placeholder client that won't crash the app
    // Using a dummy URL since createClient requires valid URLs
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Database types (to be expanded as needed)
export interface User {
    id: string;
    email: string;
    role: 'client' | 'editor' | 'admin';
    full_name?: string;
    company?: string;
    created_at: string;
}

export interface Project {
    id: string;
    client_id: string;
    editor_id?: string;
    title: string;
    service_type: string;
    status: 'pending' | 'in_progress' | 'review' | 'revision' | 'completed';
    created_at: string;
    updated_at: string;
}
