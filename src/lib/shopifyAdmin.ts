/**
 * Shopify Admin API client.
 * All requests go through the Vite dev server proxy at /api/shopify-admin
 * so the Admin API access token is never exposed to the browser.
 */

interface ShopifyAdminCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
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

const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($id: ID!) {
    customer(id: $id) {
      orders(first: 10, reverse: true) {
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
            lineItems(first: 5) {
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

  return response.json();
}

/**
 * Create a Shopify customer via the Admin API.
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
 * Generate a fresh Storefront Access Token via the Admin API.
 * This ensures we have a valid token even if the .env one is expired or invalid.
 */
export async function createStorefrontTokenViaAdmin(title = "Vite App Token"): Promise<string | null> {
  const query = `
    mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken {
          accessToken
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  try {
    const data = await adminApiRequest(query, {
      input: { title }
    });
    
    const userErrors = data?.data?.storefrontAccessTokenCreate?.userErrors || [];
    if (userErrors.length > 0) {
      console.error("Storefront token creation error:", userErrors);
      return null;
    }
    
    return data?.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken || null;
  } catch (error) {
    console.error("Failed to create storefront token:", error);
    return null;
  }
}

/**
 * Create a draft order via the Admin API to generate a checkout (invoice) URL.
 */
export async function createDraftOrderViaAdmin(lineItems: Array<{ variantId: string; quantity: number }>, customerId?: string): Promise<{ success: boolean; invoiceUrl?: string; errors?: any[] }> {
  try {
    const data = await adminApiRequest(DRAFT_ORDER_CREATE_MUTATION, {
      input: {
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        customerId: customerId || undefined,
        useCustomerDefaultAddress: !!customerId
      },
    });

    if (data?.errors) {
      return { success: false, errors: data.errors };
    }

    const userErrors = data?.data?.draftOrderCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return { success: false, errors: userErrors };
    }

    return { 
      success: true, 
      invoiceUrl: data.data.draftOrderCreate.draftOrder.invoiceUrl 
    };
  } catch (error: any) {
    return { success: false, errors: [{ message: error.message }] };
  }
}
