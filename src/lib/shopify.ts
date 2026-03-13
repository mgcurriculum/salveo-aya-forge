import { toast } from "sonner";

const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'salveo-aya-forge-rt8fh.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '90998efe73886b30801f7074707bc883';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
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
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    productType: string;
    tags: string[];
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your Shopify store needs an active billing plan. Visit admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    const errorMessages = data.errors.map((e: { message: string }) => e.message).join(', ');
    
    // Specifically handle the scope permission error to guide the user
    if (errorMessages.includes('unauthenticated_write_customers') || errorMessages.includes('ACCESS_DENIED')) {
      console.error('CRITICAL: Shopify Storefront API Access Denied.', {
        error: errorMessages,
        solution: 'Go to Shopify Admin -> Apps -> [Your App] -> Configuration -> Storefront API -> Edit -> Enable "unauthenticated_write_customers" scope.'
      });
      // We don't throw yet, let the caller handle success: false
    }
    
    return data; // Return full data so success: false can be determined by callers
  }
  return data;
}

// Queries
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
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
                price {
                  amount
                  currencyCode
                }
                availableForSale
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
          productType
          tags
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
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
            price {
              amount
              currencyCode
            }
            availableForSale
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
      productType
      tags
    }
  }
`;

export async function fetchProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first });
  return data?.data?.products?.edges || [];
}

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.productByHandle || null;
}

// Cart mutations
export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

// Customer Mutations & Queries
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email }
      customerUserErrors { field message }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { field message }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      displayName
      email
      phone
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id firstName lastName email phone }
      customerUserErrors { field message }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken { accessToken expiresAt }
      userErrors { field message }
    }
  }
`;

// ── Session helpers ──

export function getStoredSession() {
  try {
    const raw = localStorage.getItem('salmara_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: any) {
  localStorage.setItem('salmara_session', JSON.stringify(session));
  window.dispatchEvent(new Event('auth-status-change'));
}

export function clearSession() {
  localStorage.removeItem('salmara_session');
  window.dispatchEvent(new Event('auth-status-change'));
}

function isTokenExpired(session: any): boolean {
  if (!session?.expires) return true;
  // Consider expired if less than 5 minutes remaining
  return Date.now() > session.expires - 5 * 60 * 1000;
}

// Attempt to renew a customer access token
async function renewCustomerToken(currentToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
  try {
    const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION, {
      customerAccessToken: currentToken
    });
    const renewed = data?.data?.customerAccessTokenRenew?.customerAccessToken;
    if (!renewed) return null;
    return renewed;
  } catch {
    return null;
  }
}

/**
 * Returns a valid customer access token, auto-renewing if expired.
 * If renewal fails, clears the session and returns null.
 */
export async function getValidCustomerToken(): Promise<string | null> {
  const session = getStoredSession();
  if (!session?.accessToken) return null;

  if (!isTokenExpired(session)) {
    return session.accessToken;
  }

  // Token expired – try to renew
  const renewed = await renewCustomerToken(session.accessToken);
  if (renewed) {
    const updatedSession = {
      ...session,
      accessToken: renewed.accessToken,
      expires: new Date(renewed.expiresAt).getTime()
    };
    saveSession(updatedSession);
    return renewed.accessToken;
  }

  // Renewal failed – session is invalid
  clearSession();
  return null;
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export async function createShopifyCart(item: { variantId: string; quantity: number }): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Cart creation failed:', data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, item: { variantId: string; quantity: number }): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l: { node: { id: string; merchandise: { id: string } } }) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function createShopifyCustomer(input: any) {
  const data = await storefrontApiRequest(CUSTOMER_CREATE_MUTATION, { input });
  if (data?.errors) return { success: false, errors: data.errors };
  const errors = data?.data?.customerCreate?.customerUserErrors || [];
  if (errors.length > 0) return { success: false, errors };
  return { success: true, customer: data.data.customerCreate.customer };
}

export async function loginShopifyCustomer(email: string, password: string) {
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password }
  });
  if (data?.errors) return { success: false, errors: data.errors };
  const errors = data?.data?.customerAccessTokenCreate?.customerUserErrors || [];
  if (errors.length > 0) return { success: false, errors };
  
  const tokenData = data.data.customerAccessTokenCreate.customerAccessToken;
  
  // Fetch customer details and save session immediately
  const customer = await fetchShopifyCustomer(tokenData.accessToken);
  const session = {
    accessToken: tokenData.accessToken,
    user: {
      id: customer?.id || "",
      email: customer?.email || email,
      name: customer ? `${customer.firstName} ${customer.lastName}`.trim() : email.split('@')[0],
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      phone: customer?.phone
    },
    expires: new Date(tokenData.expiresAt).getTime()
  };
  saveSession(session);
  
  return { success: true, token: tokenData, user: session.user };
}

export async function fetchShopifyCustomer(token: string) {
  const data = await storefrontApiRequest(CUSTOMER_QUERY, { customerAccessToken: token });
  return data?.data?.customer || null;
}

export async function updateShopifyCustomer(token: string, customerInput: any) {
  const data = await storefrontApiRequest(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: token,
    customer: customerInput
  });
  if (data?.errors) return { success: false, errors: data.errors };
  const errors = data?.data?.customerUpdate?.customerUserErrors || [];
  if (errors.length > 0) return { success: false, errors };
  return { success: true, customer: data.data.customerUpdate.customer };
}
