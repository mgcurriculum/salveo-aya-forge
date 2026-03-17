import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

interface ShopifyCustomer {
  id: string; // GID format: gid://shopify/Customer/123456789
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string; // Plain text password from registration form
}

/**
 * Extracts the numeric ID from a Shopify GID string.
 */
const extractShopifyId = (gid: string): number | null => {
  const match = gid.match(/\/Customer\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Fetches the 'user' role ID from the roles table, creating it if it doesn't exist.
 */
const getOrCreateUserRole = async (): Promise<number | null> => {
  try {
    // 1. Try to find the 'user' role
    const { data: roleData, error: fetchError } = await supabase
      .from('roles')
      .select('id')
      .eq('role_name', 'user')
      .maybeSingle();

    if (roleData) return roleData.id;

    // 2. If not found, insert it
    const { data: newRole, error: insertError } = await supabase
      .from('roles')
      .insert([{ role_name: 'user', description: 'Regular store customer' }])
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.error("Error creating 'user' role:", insertError);
      return null;
    }

    return newRole?.id || null;
  } catch (err) {
    console.error("Unexpected error in getOrCreateUserRole:", err);
    return null;
  }
};

/**
 * Synchronizes a Shopify customer to the local database.
 */
export const syncShopifyCustomerToDb = async (customer: ShopifyCustomer) => {
  try {
    console.log("Starting DB sync for customer:", customer.email);

    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .maybeSingle();

    if (existingUser) {
      console.log("User already exists in DB, skipping insert.");
      return { success: true, userId: existingUser.id, existed: true };
    }

    // 2. Get role ID
    const roleId = await getOrCreateUserRole();
    if (!roleId) {
      throw new Error("Could not determine role ID for 'user'");
    }

    // 3. Prepare user data
    const shopifyNumericId = extractShopifyId(customer.id);
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    
    // Hash password if provided
    let hashedPassword = null;
    if (customer.password) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(customer.password, salt);
    }

    const userData = {
      role_id: roleId,
      name: fullName || null,
      email: customer.email,
      phone: customer.phone || null,
      shopify_customer_id: shopifyNumericId,
      status: true,
      password: hashedPassword
    };

    // 4. Insert into users table
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.error("Supabase Insert Error Body:", insertError);
      return { 
        success: false, 
        error: `Supabase Insert Failed: [${insertError.code}] ${insertError.message}. Details: ${insertError.details || 'None'}` 
      };
    }

    console.log("User successfully synced to DB:", newUser?.id);
    return { success: true, userId: newUser?.id, existed: false };

  } catch (error: any) {
    console.error("Catch block in syncShopifyCustomerToDb:", error);
    return { success: false, error: `Caught error: ${error.message || JSON.stringify(error)}` };
  }
};
