import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

/**
 * Vite plugin that creates a server-side proxy endpoint at /api/shopify-admin.
 * This keeps the Admin API access token on the server and never exposes it to the browser.
 */
function shopifyAdminProxy(): Plugin {
  return {
    name: "shopify-admin-proxy",
    configureServer(server) {
      server.middlewares.use("/api/shopify-admin", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        // Read the request body
        let body = "";
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const env = loadEnv("", process.cwd(), "");
          const adminToken = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
          const storeDomain = env.VITE_SHOPIFY_STORE_DOMAIN || "salveo-aya-forge-rt8fh.myshopify.com";
          const apiVersion = env.VITE_SHOPIFY_API_VERSION || "2025-07";

          if (!adminToken || adminToken === "your_admin_api_access_token_here") {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured in .env" }));
            return;
          }

          const shopifyUrl = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

          const shopifyRes = await fetch(shopifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": adminToken,
            },
            body,
          });

          const data = await shopifyRes.text();
          res.writeHead(shopifyRes.status, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(data);
        } catch (error: any) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      server.middlewares.use("/api/shopify-login", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        // Read the request body
        let body = "";
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const { email, password } = JSON.parse(body);
          const env = loadEnv("", process.cwd(), "");
          const adminToken = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
          const storeDomain = env.VITE_SHOPIFY_STORE_DOMAIN || "salveo-aya-forge-rt8fh.myshopify.com";
          const apiVersion = env.VITE_SHOPIFY_API_VERSION || "2025-07";
          const shopifyUrl = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

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
          const customer = findData?.data?.customers?.edges?.[0]?.node;

          if (!customer) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ errors: [{ message: "Email not found." }] }));
            return;
          }

          const storedPassword = customer.password?.value;

          // 2. Simple password verification
          if (storedPassword !== password) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ errors: [{ message: "Invalid password." }] }));
            return;
          }

          // 3. Return success with customer data
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
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
          }));
        } catch (error: any) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  assetsInclude: ["**/*.JPG"],
  plugins: [
    react(),
    shopifyAdminProxy(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
