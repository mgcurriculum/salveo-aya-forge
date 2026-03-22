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
    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const storeDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN ;
    const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || "2025-07";

    if (!adminToken || adminToken === "your_admin_api_access_token_here") {
      console.error("Shopify Admin Token missing");
      return res.status(500).json({ error: "SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured" });
    }

    const shopifyUrl = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;
    
    // Ensure body is stringified correctly
    const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const shopifyRes = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: bodyString,
    });

    const data = await shopifyRes.json();
    res.status(shopifyRes.status).json(data);
  } catch (error: any) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: error.message });
  }
}
