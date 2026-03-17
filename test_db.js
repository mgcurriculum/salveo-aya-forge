import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables missing.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
    console.log("Connecting to Supabase at:", supabaseUrl);

    const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('id, role_name')
        .limit(1);

    if (rolesError) {
        console.error("Roles table access failed:", rolesError.message);
    } else {
        console.log("Roles table access successful. Entry:", roles);
    }

    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .limit(1);

    if (usersError) {
        console.error("Users table access failed:", usersError.message);
    } else {
        console.log("Users table access successful. Entry:", users);
    }
}

checkDb();
