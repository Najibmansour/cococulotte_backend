import { executeQuery } from "../utils/database.js";
import { v4 as uuidv4 } from "uuid";

// Generate unique order ID
export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
};

// Get product details by ID
export const getProductById = async (productId) => {
  try {
    const products = await executeQuery(
      "SELECT id, name, price FROM products WHERE id = $1",
      [productId]
    );
    return products[0] || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error(`Failed to fetch product with ID ${productId}`);
  }
};

// Get multiple products by IDs (Postgres-safe)
export const getProductsByIds = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  // Ensure numbers for the query
  const ids = productIds.map((id) => Number(id));

  const placeholders = ids.map((_, idx) => `$${idx + 1}`).join(",");
  const query = `
    SELECT id, name, price, image_urls
    FROM products
    WHERE id IN (${placeholders})
  `;

  const products = await executeQuery(query, ids);
  return products;
};
// Create order in database
export const createOrder = async (orderData) => {
  const orderId = generateOrderId();
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    orderNotes,
    items,
  } = orderData;

  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  try {
    // Normalize productIds to numbers or strings – pick one and be consistent
    const productIds = items.map((item) => Number(item.productId)); // or String(...)
    const products = await getProductsByIds(productIds);

    // Map with normalized string keys
    const productMap = new Map(products.map((p) => [String(p.id), p]));

    // Validate all products exist
    for (const item of items) {
      const key = String(item.productId);
      if (!productMap.has(key)) {
        console.error("Available products:", products);
        throw new Error(`Product with ID ${item.productId} not found`);
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const key = String(item.productId);
      const product = productMap.get(key);

      const unitPrice = parseFloat(product.price);
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      return {
        productId: Number(item.productId), // normalize for DB if needed
        quantity: item.quantity,
        image_urls: product.image_urls || [], // array of image URLs
        image_url:
          product.image_urls && product.image_urls.length > 0
            ? product.image_urls[0]
            : null, // first image for backward compatibility
        unitPrice,
        totalPrice,
        productName: product.name,
      };
    });

    // Insert order
    await executeQuery(
      `INSERT INTO orders (
        order_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        order_notes,
        total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        orderNotes || null,
        totalAmount,
      ]
    );

    // Insert order items
    for (const item of orderItems) {
      await executeQuery(
        `INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price,
          total_price
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ]
      );
    }

    return {
      orderId,
      totalAmount,
      items: orderItems,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orders = await executeQuery(
      `SELECT 
         o.*,
         oi.product_id,
         oi.quantity,
         oi.unit_price,
         oi.total_price,
         p.name AS product_name
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.order_id = $1`,
      [orderId]
    );

    if (orders.length === 0) {
      return null;
    }

    // Group items
    const order = {
      orderId: orders[0].order_id,
      customerName: orders[0].customer_name,
      customerEmail: orders[0].customer_email,
      customerPhone: orders[0].customer_phone,
      shippingAddress: orders[0].shipping_address,
      orderNotes: orders[0].order_notes,
      totalAmount: parseFloat(orders[0].total_amount),
      status: orders[0].status,
      createdAt: orders[0].created_at,
      items: orders.map((row) => ({
        productId: row.product_id,
        name: row.product_name,
        quantity: row.quantity,
        unitPrice: row.unit_price != null ? parseFloat(row.unit_price) : null,
        totalPrice:
          row.total_price != null ? parseFloat(row.total_price) : null,
      })),
    };

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(`Failed to fetch order ${orderId}`);
  }
};
