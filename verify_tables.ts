import { supabase } from "./src/integrations/supabase/client.ts";

async function verifyTables() {
  console.log("Checking for 'roles' table...");
  const { error: rolesError } = await supabase.from('roles').select('id').limit(1);
  if (rolesError) {
    console.error("Error checking 'roles' table:", rolesError.message);
  } else {
    console.log("'roles' table exists.");
  }

  console.log("Checking for 'users' table...");
  const { error: usersError } = await supabase.from('users').select('id').limit(1);
  if (usersError) {
    console.error("Error checking 'users' table:", usersError.message);
  } else {
    console.log("'users' table exists.");
  }
}

verifyTables();
