import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({ errors: [{ message: "Email and password are required." }] });
    }

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const storeDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN ;
    const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || "2025-07";
    const shopifyUrl = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

    if (!adminToken) {
      console.error("Shopify Admin Token missing");
      return res.status(500).json({ error: "SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured" });
    }

    // 1. Find customer by email and get their private metafield
    const customerQuery = `
      query getCustomerByEmail($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              email
              firstName
              lastName
              phone
              password: metafield(namespace: "custom_auth", key: "password") {
                value
              }
              cartId: metafield(namespace: "custom_auth", key: "cart_id") {
                value
              }
            }
          }
        }
      }
    `;

    const findRes = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: customerQuery,
        variables: { query: `email:${email}` }
      }),
    });

    const findData = await findRes.json() as any;
    
    if (findData.errors) {
      console.error("Shopify GraphQL Errors:", findData.errors);
      return res.status(401).json({ errors: findData.errors });
    }

    const customer = findData?.data?.customers?.edges?.[0]?.node;

    if (!customer) {
      return res.status(401).json({ errors: [{ message: "Email not found." }] });
    }

    const storedPassword = customer.password?.value;

    // 2. Simple password verification
    if (storedPassword !== password) {
      return res.status(401).json({ errors: [{ message: "Invalid password." }] });
    }

    // 3. Return success with customer data
    res.status(200).json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        shopifyCartId: customer.cartId?.value
      }
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
}
