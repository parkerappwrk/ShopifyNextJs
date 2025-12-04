// Shopify Storefront API Client

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error(
    "Missing Shopify environment variables. Please check your .env.local file."
  );
}

const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        id: string;
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
        sku: string | null;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        quantityAvailable: number | null;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image: {
          id: string;
          url: string;
          altText: string | null;
        } | null;
        weight: number | null;
        weightUnit: string;
      };
    }>;
  };
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Shopify Storefront Access Token is not configured");
  }

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const result: ShopifyResponse<T> = await response.json();

    if (result.errors) {
      console.error("Shopify GraphQL errors:", result.errors);
      throw new Error(
        `GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw error;
  }
}

// GraphQL query to fetch all products with all variants
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $variantsFirst: Int!) {
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
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: $variantsFirst) {
            edges {
              node {
                id
                title
                sku
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                }
                weight
                weightUnit
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch a single product by handle with all variants
const PRODUCT_QUERY = `
  query getProduct($handle: String!, $variantsFirst: Int!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      variants(first: $variantsFirst) {
        edges {
          node {
            id
            title
            sku
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
            }
            weight
            weightUnit
          }
        }
      }
    }
  }
`;

export async function getAllProducts(first: number = 50, variantsFirst: number = 250) {
  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  }>(PRODUCTS_QUERY, { first, variantsFirst });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string, variantsFirst: number = 250) {
  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>(PRODUCT_QUERY, { handle, variantsFirst });

  return data.product;
}

export async function getProductById(id: string) {
  // Shopify uses GID format, but we might receive numeric IDs
  // We'll need to handle both cases
  // For now, we'll search by handle if ID is numeric
  // In a real app, you'd want to store the handle or use the GID properly
  
  // If it's a numeric ID, we'll need to fetch all products and find by index
  // This is not ideal but works for the demo
  const products = await getAllProducts(100);
  const numericId = parseInt(id, 10);
  
  if (!isNaN(numericId) && numericId > 0 && numericId <= products.length) {
    return products[numericId - 1];
  }
  
  // Try to find by GID
  return products.find((p) => p.id === id) || null;
}

// Customer interfaces
export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

// Customer Create Mutation
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer Access Token Create Mutation (Login)
const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Get Customer Query
const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
    }
  }
`;

// Get Customer Orders Query
const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    image {
                      url
                      altText
                    }
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

// Get Single Customer Order Query (fetches all orders and filters by ID)
const CUSTOMER_ORDER_QUERY = `
  query getCustomerOrder($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            billingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    image {
                      url
                      altText
                    }
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

// Customer Access Token Delete Mutation (Logout)
const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

// Create a new customer
export async function createCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  const data = await shopifyFetch<{
    customerCreate: {
      customer: ShopifyCustomer | null;
      customerUserErrors: Array<{
        field: string[];
        message: string;
        code: string;
      }>;
    };
  }>(CUSTOMER_CREATE_MUTATION, {
    input: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      phone: input.phone || null,
      acceptsMarketing: input.acceptsMarketing || false,
    },
  });

  if (data.customerCreate.customerUserErrors.length > 0) {
    const errors = data.customerCreate.customerUserErrors;
    const errorMessages = errors.map((e) => {
      // Format user-friendly error messages
      if (e.code === "TAKEN") {
        return "This email is already registered. Please use a different email or try logging in.";
      }
      if (e.code === "INVALID") {
        return `Invalid ${e.field?.join(", ") || "input"}: ${e.message}`;
      }
      return e.message || `Error: ${e.code}`;
    }).join(" ");
    
    console.error("Shopify customer creation errors:", errors);
    throw new Error(errorMessages || "Failed to create customer");
  }

  if (!data.customerCreate.customer) {
    throw new Error("Failed to create customer");
  }

  return data.customerCreate.customer;
}

// Create customer access token (Login)
export async function createCustomerAccessToken(email: string, password: string) {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: Array<{
        field: string[];
        message: string;
        code: string;
      }>;
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: {
      email,
      password,
    },
  });

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    const error = data.customerAccessTokenCreate.customerUserErrors[0];
    throw new Error(error.message || "Invalid email or password");
  }

  if (!data.customerAccessTokenCreate.customerAccessToken) {
    throw new Error("Failed to create access token");
  }

  return data.customerAccessTokenCreate.customerAccessToken;
}

// Get customer by access token
export async function getCustomer(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customer: ShopifyCustomer | null;
  }>(CUSTOMER_QUERY, {
    customerAccessToken,
  });

  return data.customer;
}

// Customer Order interfaces
export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  createdAt: string; // This will be mapped from processedAt
  totalPrice: string;
  currencyCode: string;
  fulfillmentStatus: string;
  financialStatus: string;
  lineItems: Array<{
    title: string;
    quantity: number;
    price: string;
    currencyCode: string;
    image?: string;
    variantTitle?: string;
  }>;
}

// Get customer orders
export async function getCustomerOrders(
  customerAccessToken: string,
  first: number = 10
): Promise<CustomerOrder[]> {
  const data = await shopifyFetch<{
    customer: {
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            orderNumber: number;
            processedAt: string;
            totalPrice: {
              amount: string;
              currencyCode: string;
            };
            fulfillmentStatus: string;
            financialStatus: string;
            lineItems: {
              edges: Array<{
                node: {
                  title: string;
                  quantity: number;
                  originalTotalPrice: {
                    amount: string;
                    currencyCode: string;
                  };
                  variant: {
                    id: string;
                    title: string;
                    image: {
                      url: string;
                      altText: string | null;
                    } | null;
                  } | null;
                };
              }>;
            };
          };
        }>;
      } | null;
    } | null;
  }>(CUSTOMER_ORDERS_QUERY, {
    customerAccessToken,
    first,
  });

  if (!data.customer || !data.customer.orders) {
    return [];
  }

  return data.customer.orders.edges.map((edge) => {
    const order = edge.node;
    return {
      id: order.id,
      name: order.name,
      orderNumber: order.orderNumber,
      createdAt: order.processedAt, // Map processedAt to createdAt for consistency
      totalPrice: order.totalPrice.amount,
      currencyCode: order.totalPrice.currencyCode,
      fulfillmentStatus: order.fulfillmentStatus,
      financialStatus: order.financialStatus,
      lineItems: order.lineItems.edges.map((itemEdge) => {
        // originalTotalPrice is already the total price for the line item
        return {
          title: itemEdge.node.title,
          quantity: itemEdge.node.quantity,
          price: itemEdge.node.originalTotalPrice.amount,
          currencyCode: itemEdge.node.originalTotalPrice.currencyCode,
          image: itemEdge.node.variant?.image?.url,
          variantTitle: itemEdge.node.variant?.title,
        };
      }),
    };
  });
}

// Extended Customer Order interface for detail view
export interface CustomerOrderDetail extends CustomerOrder {
  subtotalPrice: string;
  totalTax: string;
  totalShippingPrice: string;
  shippingAddress?: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
  billingAddress?: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
}

// Get a single customer order by ID
export async function getCustomerOrder(
  customerAccessToken: string,
  orderId: string
): Promise<CustomerOrderDetail | null> {
  // Fetch all orders (up to 50) and filter for the matching order ID
  const data = await shopifyFetch<{
    customer: {
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            orderNumber: number;
            processedAt: string;
            totalPrice: {
              amount: string;
              currencyCode: string;
            };
            subtotalPrice: {
              amount: string;
              currencyCode: string;
            };
            totalTax: {
              amount: string;
              currencyCode: string;
            };
            totalShippingPrice: {
              amount: string;
              currencyCode: string;
            };
            fulfillmentStatus: string;
            financialStatus: string;
            shippingAddress: {
              firstName: string | null;
              lastName: string | null;
              address1: string | null;
              address2: string | null;
              city: string | null;
              province: string | null;
              zip: string | null;
              country: string | null;
              phone: string | null;
            } | null;
            billingAddress: {
              firstName: string | null;
              lastName: string | null;
              address1: string | null;
              address2: string | null;
              city: string | null;
              province: string | null;
              zip: string | null;
              country: string | null;
              phone: string | null;
            } | null;
            lineItems: {
              edges: Array<{
                node: {
                  title: string;
                  quantity: number;
                  originalTotalPrice: {
                    amount: string;
                    currencyCode: string;
                  };
                  variant: {
                    id: string;
                    title: string;
                    image: {
                      url: string;
                      altText: string | null;
                    } | null;
                  } | null;
                };
              }>;
            };
          };
        }>;
      } | null;
    } | null;
  }>(CUSTOMER_ORDER_QUERY, {
    customerAccessToken,
    first: 250, // Fetch up to 250 orders to find the matching one
  });

  if (!data.customer || !data.customer.orders) {
    console.log("No customer or orders found");
    return null;
  }

  // Normalize the order ID for comparison (remove any trailing query params, normalize encoding)
  const normalizedOrderId = orderId.split("?")[0].trim();
  
  // Find the order with matching ID (try exact match first, then normalized match)
  let orderEdge = data.customer.orders.edges.find(
    (edge) => edge.node.id === orderId || edge.node.id === normalizedOrderId
  );

  // If still not found, try comparing the numeric part of the GID
  if (!orderEdge) {
    // Extract numeric ID from GID format: gid://shopify/Order/123456
    const numericIdMatch = normalizedOrderId.match(/\/(\d+)(?:\?|$)/);
    if (numericIdMatch) {
      const numericId = numericIdMatch[1];
      orderEdge = data.customer.orders.edges.find((edge) => {
        const edgeNumericId = edge.node.id.match(/\/(\d+)(?:\?|$)/)?.[1];
        return edgeNumericId === numericId;
      });
    }
  }

  // If still not found, try matching by order number (extract from URL or use as fallback)
  if (!orderEdge) {
    // Try to extract order number from the ID if it's in the URL
    const orderNumberMatch = normalizedOrderId.match(/Order\/(\d+)/);
    if (orderNumberMatch) {
      const orderNumber = parseInt(orderNumberMatch[1], 10);
      orderEdge = data.customer.orders.edges.find(
        (edge) => edge.node.orderNumber === orderNumber
      );
    }
  }

  // If still not found, log for debugging
  if (!orderEdge) {
    console.log("Order not found. Looking for:", normalizedOrderId);
    console.log("Total orders fetched:", data.customer.orders.edges.length);
    console.log("Available order IDs (first 5):", data.customer.orders.edges.slice(0, 5).map(e => e.node.id));
    console.log("Available order numbers (first 5):", data.customer.orders.edges.slice(0, 5).map(e => e.node.orderNumber));
    return null;
  }

  const order = orderEdge.node;
  return {
    id: order.id,
    name: order.name,
    orderNumber: order.orderNumber,
    createdAt: order.processedAt,
    totalPrice: order.totalPrice.amount,
    currencyCode: order.totalPrice.currencyCode,
    subtotalPrice: order.subtotalPrice.amount,
    totalTax: order.totalTax.amount,
    totalShippingPrice: order.totalShippingPrice.amount,
    fulfillmentStatus: order.fulfillmentStatus,
    financialStatus: order.financialStatus,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    lineItems: order.lineItems.edges.map((itemEdge) => ({
      title: itemEdge.node.title,
      quantity: itemEdge.node.quantity,
      price: itemEdge.node.originalTotalPrice.amount,
      currencyCode: itemEdge.node.originalTotalPrice.currencyCode,
      image: itemEdge.node.variant?.image?.url,
      variantTitle: itemEdge.node.variant?.title,
    })),
  };
}

// Delete customer access token (Logout)
export async function deleteCustomerAccessToken(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null;
      deletedCustomerAccessTokenId: string | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  }>(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
    customerAccessToken,
  });

  if (data.customerAccessTokenDelete.userErrors.length > 0) {
    const error = data.customerAccessTokenDelete.userErrors[0];
    throw new Error(error.message || "Failed to delete access token");
  }

  return data.customerAccessTokenDelete;
}

// Customer Address interfaces
export interface CustomerAddress {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isDefault?: boolean;
}

// Customer Address Create Mutation
const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        firstName
        lastName
        phone
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer Address Update Mutation
const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        firstName
        lastName
        phone
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer Address Delete Mutation
const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Get Customer Addresses Query
const CUSTOMER_ADDRESSES_QUERY = `
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            zip
            country
            firstName
            lastName
            phone
          }
        }
      }
      defaultAddress {
        id
      }
    }
  }
`;

// Create a customer address
export async function createCustomerAddress(
  customerAccessToken: string,
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  }
) {
  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: Array<{
        field: string[];
        message: string;
        code: string;
      }>;
    };
  }>(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    customerAccessToken,
    address: {
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      address2: address.address2 || null,
      city: address.city,
      province: address.province,
      zip: address.zip,
      country: address.country,
      phone: address.phone || null,
    },
  });

  if (data.customerAddressCreate.customerUserErrors.length > 0) {
    const errors = data.customerAddressCreate.customerUserErrors;
    const errorMessages = errors.map((e) => e.message).join(", ");
    throw new Error(errorMessages || "Failed to create address");
  }

  if (!data.customerAddressCreate.customerAddress) {
    throw new Error("Failed to create address");
  }

  return data.customerAddressCreate.customerAddress;
}

// Update a customer address
export async function updateCustomerAddress(
  customerAccessToken: string,
  addressId: string,
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  }
) {
  const data = await shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: Array<{
        field: string[];
        message: string;
        code: string;
      }>;
    };
  }>(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken,
    id: addressId,
    address: {
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      address2: address.address2 || null,
      city: address.city,
      province: address.province,
      zip: address.zip,
      country: address.country,
      phone: address.phone || null,
    },
  });

  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    const errors = data.customerAddressUpdate.customerUserErrors;
    const errorMessages = errors.map((e) => e.message).join(", ");
    throw new Error(errorMessages || "Failed to update address");
  }

  if (!data.customerAddressUpdate.customerAddress) {
    throw new Error("Failed to update address");
  }

  return data.customerAddressUpdate.customerAddress;
}

// Delete a customer address
export async function deleteCustomerAddress(
  customerAccessToken: string,
  addressId: string
) {
  const data = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: Array<{
        field: string[];
        message: string;
        code: string;
      }>;
    };
  }>(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    customerAccessToken,
    id: addressId,
  });

  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    const errors = data.customerAddressDelete.customerUserErrors;
    const errorMessages = errors.map((e) => e.message).join(", ");
    throw new Error(errorMessages || "Failed to delete address");
  }

  return data.customerAddressDelete.deletedCustomerAddressId;
}

// Get customer addresses
export async function getCustomerAddresses(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customer: {
      addresses: {
        edges: Array<{
          node: CustomerAddress;
        }>;
      };
      defaultAddress: {
        id: string;
      } | null;
    } | null;
  }>(CUSTOMER_ADDRESSES_QUERY, {
    customerAccessToken,
  });

  if (!data.customer) {
    return [];
  }

  const defaultAddressId = data.customer.defaultAddress?.id;
  
  return data.customer.addresses.edges.map((edge) => ({
    ...edge.node,
    isDefault: edge.node.id === defaultAddressId,
  }));
}

// Cart interfaces
export interface CartLineItem {
  merchandiseId: string; // Variant ID
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

// Cart Create Mutation
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Buyer Identity Update Mutation
const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Attributes Update Mutation (for address data)
const CART_ATTRIBUTES_UPDATE_MUTATION = `
  mutation cartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!) {
    cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
      cart {
        id
        checkoutUrl
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface CustomerInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

// Create a cart with line items and customer information
export async function createCart(
  lineItems: CartLineItem[],
  customerInfo?: CustomerInfo
) {
  if (lineItems.length === 0) {
    throw new Error("Cannot create cart with empty items");
  }

  // Prepare cart input with buyer identity if email is provided
  const cartInput: any = {
    lines: lineItems.map((item) => ({
      merchandiseId: item.merchandiseId,
      quantity: item.quantity,
    })),
  };

  // Add buyer identity (email) if provided
  if (customerInfo?.email) {
    cartInput.buyerIdentity = {
      email: customerInfo.email,
    };
  }

  // Add attributes for address information
  const attributes: Array<{ key: string; value: string }> = [];
  if (customerInfo?.firstName) {
    attributes.push({ key: "_customer_first_name", value: customerInfo.firstName });
  }
  if (customerInfo?.lastName) {
    attributes.push({ key: "_customer_last_name", value: customerInfo.lastName });
  }
  if (customerInfo?.address1) {
    attributes.push({ key: "_shipping_address1", value: customerInfo.address1 });
  }
  if (customerInfo?.address2) {
    attributes.push({ key: "_shipping_address2", value: customerInfo.address2 });
  }
  if (customerInfo?.city) {
    attributes.push({ key: "_shipping_city", value: customerInfo.city });
  }
  if (customerInfo?.province) {
    attributes.push({ key: "_shipping_province", value: customerInfo.province });
  }
  if (customerInfo?.zip) {
    attributes.push({ key: "_shipping_zip", value: customerInfo.zip });
  }
  if (customerInfo?.country) {
    attributes.push({ key: "_shipping_country", value: customerInfo.country });
  }
  if (customerInfo?.phone) {
    attributes.push({ key: "_customer_phone", value: customerInfo.phone });
  }

  if (attributes.length > 0) {
    cartInput.attributes = attributes;
  }

  const data = await shopifyFetch<{
    cartCreate: {
      cart: Cart | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  }>(CART_CREATE_MUTATION, {
    input: cartInput,
  });

  if (data.cartCreate.userErrors.length > 0) {
    const errors = data.cartCreate.userErrors;
    const errorMessages = errors.map((e) => {
      return e.message || `Error in ${e.field?.join(", ") || "input"}`;
    }).join(" ");
    
    console.error("Shopify cart creation errors:", errors);
    throw new Error(errorMessages || "Failed to create cart");
  }

  if (!data.cartCreate.cart) {
    throw new Error("Failed to create cart");
  }

  let cart = data.cartCreate.cart;

  // If we need to update buyer identity separately (fallback)
  if (customerInfo?.email && !cartInput.buyerIdentity) {
    try {
      const updateData = await shopifyFetch<{
        cartBuyerIdentityUpdate: {
          cart: Cart | null;
          userErrors: Array<{
            field: string[];
            message: string;
          }>;
        };
      }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
        cartId: cart.id,
        buyerIdentity: {
          email: customerInfo.email,
        },
      });

      if (updateData.cartBuyerIdentityUpdate.cart) {
        cart = updateData.cartBuyerIdentityUpdate.cart;
      }
    } catch (error) {
      console.error("Error updating buyer identity:", error);
      // Continue with original cart if update fails
    }
  }

  return cart;
}

