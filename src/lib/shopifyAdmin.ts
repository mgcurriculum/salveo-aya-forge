import { toast } from "sonner";

/**
 * Shopify Admin API client.
 * All requests go through the Vite dev server proxy at /api/shopify-admin
 * so the Admin API access token is never exposed to the browser.
 */

export interface ShopifyAdminCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  shopifyCartId?: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml?: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
          inventoryQuantity?: number;
        };
      }>;
    };
    options: {
      id: string;
      name: string;
      values: string[];
    }[];
  };
}

interface AdminApiResponse {
  success: boolean;
  customer?: ShopifyAdminCustomer;
  errors?: Array<{ field?: string[]; message: string }>;
}

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_INVITE_MUTATION = `
  mutation customerSendAccountInvite($id: ID!) {
    customerSendAccountInvite(id: $id) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;


const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($id: ID!) {
    customer(id: $id) {
      orders(first: 50, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFinancialStatus
            displayFulfillmentStatus
            lineItems(first: 50) {
              edges {
                node {
                  product {
                    id
                  }
                  title
                  quantity
                  image {
                    url
                  }
                }
              }
            }
            fulfillments(first: 10) {
              id
              displayStatus
              status
              createdAt
              updatedAt
              trackingInfo(first: 5) {
                number
                url
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCTS_ADMIN_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                inventoryQuantity
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_ADMIN_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price
            inventoryQuantity
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const ORDERS_BY_EMAIL_QUERY = `
  query getOrdersByEmail($query: String!) {
    orders(first: 20, query: $query, reverse: true) {
      edges {
        node {
          id
          name
          processedAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          lineItems(first: 20) {
            edges {
              node {
                title
                quantity
                image {
                  url
                }
              }
            }
          }
          fulfillments(first: 10) {
            id
            displayStatus
            status
            createdAt
            updatedAt
            trackingInfo(first: 5) {
              number
              url
            }
          }
        }
      }
    }
  }
`;


const PRODUCT_REVIEWS_QUERY = `
  query getProductReviews($id: ID!) {
    product(id: $id) {
      metafield(namespace: "custom", key: "reviews") {
        value
      }
    }
  }
`;

const PRODUCT_UPDATE_MUTATION = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function adminApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch('/api/shopify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin API proxy error (${response.status}): ${text}`);
  }

  return await response.json();
}

async function adminRestCheckoutRequest(data: any) {
  const response = await fetch('/api/shopify-checkout-rest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin REST Checkout error (${response.status}): ${text}`);
  }

  return await response.json();
}

async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch('/api/shopify-storefront', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Storefront API error (${response.status}): ${text}`);
  }

  return await response.json();
}

/**
 * Sync storefront customer data into Supabase
 Admin API.
 * Included password for Shopify account creation.
 */
export async function createCustomerViaAdmin(input: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
}): Promise<AdminApiResponse> {
  try {
    const data = await adminApiRequest(CUSTOMER_CREATE_MUTATION, {
      input: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone || undefined,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: new Date().toISOString()
        },
        metafields: input.password ? [{
          namespace: "custom_auth",
          key: "password",
          value: input.password,
          type: "single_line_text_field"
        }] : undefined
      },
    });

    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.customerCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { success: true, customer: data.data.customerCreate.customer };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

/**
 * Custom login via the Vite proxy endpoint /api/shopify-login
 * This uses the Admin API to verify passwords stored in metafields.
 */
export async function loginViaProxy(email: string, password: string): Promise<{ success: boolean; user?: any; errors?: any[] }> {
  try {
    const response = await fetch('/api/shopify-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

/**
 * Fetch a Shopify customer by their global ID via the Admin API.
 */
export async function fetchCustomerViaAdmin(customerId: string): Promise<ShopifyAdminCustomer | null> {
  try {
    const data = await adminApiRequest(CUSTOMER_QUERY, { id: customerId });
    return data?.data?.customer || null;
  } catch {
    return null;
  }
}

/**
 * Fetch a customer's orders via the Admin API.
 */
export async function fetchCustomerOrdersViaAdmin(customerId: string): Promise<any[]> {
  try {
    const data = await adminApiRequest(CUSTOMER_ORDERS_QUERY, { id: customerId });
    const orderEdges = data?.data?.customer?.orders?.edges || [];
    return orderEdges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

/**
 * Fetch orders by customer email via the Admin API.
 * This acts as a fallback for guest orders with the same email.
 */
export async function fetchCustomerOrdersByEmailViaAdmin(email: string): Promise<any[]> {
  try {
    const queryStr = `email:${email}`;
    const data = await adminApiRequest(ORDERS_BY_EMAIL_QUERY, { query: queryStr });
    const orderEdges = data?.data?.orders?.edges || [];
    return orderEdges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching orders by email:", error);
    return [];
  }
}

/**
 * Update a Shopify customer via the Admin API.
 */
export async function updateCustomerViaAdmin(
  customerId: string,
  input: { firstName?: string; lastName?: string; phone?: string }
): Promise<AdminApiResponse> {
  try {
    const data = await adminApiRequest(CUSTOMER_UPDATE_MUTATION, {
      input: { id: customerId, ...input },
    });

    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.customerUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { success: true, customer: data.data.customerUpdate.customer };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

/**
 * Send an account invite email to a Shopify customer.
 * This allows them to set their password.
 */
export async function sendAccountInvite(customerId: string): Promise<AdminApiResponse> {
  try {
    const data = await adminApiRequest(CUSTOMER_INVITE_MUTATION, { id: customerId });
    
    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.customerSendAccountInvite?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

/**
 * Update the stored cart ID for a customer.
 */
export async function updateCustomerCartId(customerId: string, cartId: string): Promise<AdminApiResponse> {
  try {
    const data = await adminApiRequest(CUSTOMER_UPDATE_MUTATION, {
      input: {
        id: customerId,
        metafields: [{
          namespace: "custom_auth",
          key: "cart_id",
          value: cartId,
          type: "single_line_text_field"
        }]
      }
    });

    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.customerUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

/**
 * Fetch products via the Admin API to get inventory data.
 */
export async function fetchProductsViaAdmin(first = 20): Promise<any[]> {
  try {
    const data = await adminApiRequest(PRODUCTS_ADMIN_QUERY, { first });
    const productEdges = data?.data?.products?.edges || [];
    
    // Map Admin API response to match ShopifyProduct interface used in the app
    return productEdges.map((edge: any) => ({
      node: {
        ...edge.node,
        variants: {
          edges: edge.node.variants.edges.map((vEdge: any) => ({
            node: {
              ...vEdge.node,
              // Admin API price is a string, Storefront expects price object
              price: {
                amount: vEdge.node.price,
                currencyCode: "INR" 
              },
              // Storefront uses availableForSale, Admin uses inventoryQuantity
              availableForSale: vEdge.node.inventoryQuantity > 0
            }
          }))
        },
        // Add priceRange for compatibility with Storefront types
        priceRange: {
          minVariantPrice: {
            amount: edge.node.variants.edges[0]?.node.price || "0",
            currencyCode: "INR"
          }
        }
      }
    }));
  } catch (error) {
    console.error("Error fetching products via Admin API:", error);
    return [];
  }
}

/**
 * Fetch a single product by handle via the Admin API to get inventory data.
 */
export async function fetchProductByHandleViaAdmin(handle: string): Promise<any | null> {
  try {
    const data = await adminApiRequest(PRODUCT_BY_HANDLE_ADMIN_QUERY, { handle });
    const product = data?.data?.productByHandle;
    
    if (!product) return null;
    
    // Map Admin API response to match ShopifyProduct structure used in the app
    return {
      ...product,
      variants: {
        edges: product.variants.edges.map((vEdge: any) => ({
          node: {
            ...vEdge.node,
            price: {
              amount: vEdge.node.price,
              currencyCode: "INR"
            },
            availableForSale: vEdge.node.inventoryQuantity > 0
          }
        }))
      },
      // Add priceRange for compatibility with Storefront types
      priceRange: {
        minVariantPrice: {
          amount: product.variants.edges[0]?.node.price || "0",
          currencyCode: "INR"
        }
      }
    };
  } catch (error) {
    console.error("Error fetching product by handle via Admin API:", error);
    return null;
  }
}

/**
 * Fetch review statistics for a product via the Admin API.
 * Currently returns a placeholder since Shopify doesn't have a native "Review" object in Admin GraphQL by default.
 */
export async function fetchReviewStatsViaAdmin(productId: string): Promise<{ rating: number; count: number }> {
  // In a real implementation, you'd fetch this from a metafield or a third-party app via Admin API.
  return { rating: 4.8, count: 12 };
}


/**
 * Hybrid checkout solution: Creates a cart using the Admin API (which supports checkoutUrl)
 * but bypasses Storefront API restrictions.
 */
export async function createHybridCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>, 
  customerId?: string,
  customerEmail?: string
): Promise<{ success: boolean; checkoutUrl?: string; errors?: any[] }> {
  const getNumericId = (gid: string) => {
    if (!gid) return '';
    if (!gid.includes('/')) return gid.replace(/\D/g, '');
    return gid.split('/').pop()?.replace(/\D/g, '') || '';
  };
  
  try {
    console.log("[CHECKOUT] Starting Standard Checkout flow...");
    const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "salmara-5.myshopify.com";
    
    const formattedItems = lineItems
      .filter(item => item.variantId)
      .map(item => {
        const numId = getNumericId(item.variantId);
        return numId ? `${numId}:${item.quantity}` : null;
      })
      .filter(Boolean);
      
    if (formattedItems.length > 0) {
      const cartItems = formattedItems.join(',');
      let permalinkUrl = `https://${domain}/cart/${cartItems}`;
      
      // Pre-fill the email so the user gets the order linked to their dashboard seamlessly
      // This forces the classic Shopify Checkout UI (with "Same as billing" checkboxes)
      const params = new URLSearchParams();
      params.append('locale', 'en');
      if (customerEmail) {
        params.append('checkout[email]', customerEmail);
      }
      
      permalinkUrl += `?${params.toString()}`;
      
      console.log("[CHECKOUT] Standard Checkout URL generated:", permalinkUrl);
      return { success: true, checkoutUrl: permalinkUrl };
    }
    
    throw new Error("No valid items to checkout.");
  } catch (error: any) {
    console.error("[CHECKOUT] Total flow failure:", error.message);
    return { success: false, errors: [{ message: error.message }] };
  }
}


/**
 * Sync cart data to Shopify customer metafield
 */
export async function syncCartToShopify(customerId: string, items: any[]): Promise<boolean> {
  try {
    const response = await fetch('/api/shopify-sync-cart', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        cartJson: JSON.stringify(items)
      })
    });
    return response.ok;
  } catch (err) {
    console.error("Failed to sync cart to Shopify:", err);
    return false;
  }
}

/**
 * Log checkout telemetry to the terminal console (via Vite proxy)
 */
export async function logCheckoutToTerminal(url: string, source: string, items?: any[]) {
  try {
    await fetch('/api/log-checkout', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, source, items })
    });
  } catch (err) {
    console.error("Failed to log to terminal:", err);
  }
}

/**
 * Check if a customer has purchased a specific product.
 */
export async function checkCustomerHasPurchased(customerId: string, productId: string): Promise<boolean> {
  try {
    const data = await adminApiRequest(CUSTOMER_ORDERS_QUERY, { id: customerId });
    const orders = data?.data?.customer?.orders?.edges || [];
    
    const getNumericId = (gid: string) => gid?.split('/').pop();
    const targetProductIdNum = getNumericId(productId);

    // Flatten all line items from all orders and check for the productId
    return orders.some((orderEdge: any) => {
      const lineItems = orderEdge.node.lineItems.edges || [];
      return lineItems.some((liEdge: any) => {
        const boughtProductId = liEdge.node.product?.id;
        if (!boughtProductId) return false;
        
        // Direct match
        if (boughtProductId === productId) return true;
        
        // Numeric match fallback
        return getNumericId(boughtProductId) === targetProductIdNum;
      });
    });
  } catch (error) {
    console.error("Error verifying purchase:", error);
    return false;
  }
}

/**
 * Fetch reviews stored in a Shopify product metafield.
 */
export async function fetchProductReviewsFromShopify(productId: string): Promise<any[]> {
  try {
    const data = await adminApiRequest(PRODUCT_REVIEWS_QUERY, { id: productId });
    const metafieldValue = data?.data?.product?.metafield?.value;
    if (metafieldValue) {
      const parsed = JSON.parse(metafieldValue);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching product reviews from Shopify:", error);
    return [];
  }
}

/**
 * Add a review to a Shopify product's metafield.
 */
export async function updateProductReviewsInShopify(productId: string, reviews: any[]): Promise<AdminApiResponse> {
  try {
    const data = await adminApiRequest(PRODUCT_UPDATE_MUTATION, {
      input: {
        id: productId,
        metafields: [{
          namespace: "custom",
          key: "reviews",
          value: JSON.stringify(reviews),
          type: "json"
        }]
      }
    });

    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.productUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

// ── Session helpers ──

export const getStoredSession = () => {
  const session = localStorage.getItem('shopify_customer_session');
  if (!session) return null;
  const parsed = JSON.parse(session);
  if (Date.now() > parsed.expires) {
    localStorage.removeItem('shopify_customer_session');
    return null;
  }
  return parsed; // Return the entire session object { user, expires, accessToken }
};

export const saveAdminSession = (session: { user: any; expires: number }) => {
  localStorage.setItem('salmara_admin_session', JSON.stringify(session));
};

export const getStoredAdminSession = () => {
  const session = localStorage.getItem('salmara_admin_session');
  if (!session) return null;
  const parsed = JSON.parse(session);
  if (Date.now() > parsed.expires) {
    localStorage.removeItem('salmara_admin_session');
    return null;
  }
  return parsed.user;
};

export const logoutAdmin = () => {
  localStorage.removeItem('salmara_admin_session');
};

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch('/api/admin-auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Login failed");

    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function saveSession(session: any) {
  localStorage.setItem('shopify_customer_session', JSON.stringify(session));
  window.dispatchEvent(new Event('auth-status-change'));
}

export function clearSession() {
  localStorage.removeItem('shopify_customer_session');
  window.dispatchEvent(new Event('auth-status-change'));
}

export function logoutViaAdmin() {
  clearSession();
  window.location.href = '/';
}

/**
 * Fetch customer wishlist from Shopify via Admin proxy
 */
export async function fetchCustomerWishlist(customerId: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/wishlist?customerId=${encodeURIComponent(customerId)}`);
    if (response.ok) {
      const data = await response.json();
      return data.wishlist || [];
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return [];
  }
}

/**
 * Update customer wishlist in Shopify via Admin proxy
 */
export async function updateCustomerWishlist(customerId: string, productIds: string[]): Promise<boolean> {
  try {
    const response = await fetch(`/api/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, productIds }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update wishlist:", error);
    return false;
  }
}

/**
 * Fetch full product data for multiple variant IDs
 */
export async function fetchProductsByVariantIdsViaAdmin(variantIds: string[]): Promise<ShopifyProduct[]> {
  if (!variantIds.length) return [];
  
  try {
    // We use the search proxy with a query that matches specific variant IDs
    // Since our search proxy currently fetches all and filters locally for simplicity,
    // we can use it to get the full list and then filter.
    // In a high-perf app, we'd use a dedicated batch node query.
    const allProducts = await fetchProductsViaAdmin(250);
    return allProducts.filter(p => 
      p.node.variants.edges.some(v => variantIds.includes(v.node.id))
    );
  } catch (error) {
    console.error("Failed to fetch products by IDs:", error);
    return [];
  }
}
