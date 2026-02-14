// controllers/adminOrders.js
import { log } from "../utils/logger.js";
import { executeQuery } from "../utils/database.js";

// Valid order status values
const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

/**
 * Validate and normalize pagination parameters
 */
function validatePagination(page, pageSize) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
  return { page: pageNum, pageSize: size };
}

/**
 * Validate order status
 */
function validateStatus(status) {
  if (!status || !VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  return status;
}

/**
 * GET /api/admin/orders
 * List orders with pagination, search, and sorting
 */
export const listOrders = async (req, res) => {
  try {
    const { page, pageSize } = validatePagination(req.query.page, req.query.pageSize);
    const status = req.query.status || null;
    const searchQuery = req.query.q || null;
    const sort = req.query.sort || "created_at_desc";

    // Validate sort parameter
    const validSorts = ["created_at_desc", "created_at_asc"];
    const sortOrder = validSorts.includes(sort) ? sort : "created_at_desc";
    const isDesc = sortOrder.endsWith("_desc");
    const orderBy = `o.created_at ${isDesc ? "DESC" : "ASC"}`;

    // Build WHERE conditions
    const conditions = [];
    const listConditions = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      listConditions.push(`o.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (searchQuery) {
      conditions.push(
        `(
          order_id ILIKE $${paramIndex} OR
          customer_email ILIKE $${paramIndex} OR
          customer_name ILIKE $${paramIndex} OR
          customer_phone ILIKE $${paramIndex}
        )`
      );
      listConditions.push(
        `(
          o.order_id ILIKE $${paramIndex} OR
          o.customer_email ILIKE $${paramIndex} OR
          o.customer_name ILIKE $${paramIndex} OR
          o.customer_phone ILIKE $${paramIndex}
        )`
      );
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const listWhereClause = listConditions.length > 0 ? `WHERE ${listConditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM orders ${whereClause}`;
    const countResult = await executeQuery(countQuery, params);
    const total = parseInt(countResult[0].total, 10);

    // Get orders with item count
    const offset = (page - 1) * pageSize;
    const listQuery = `
      SELECT 
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total_amount,
        o.status,
        o.created_at,
        COUNT(oi.id)::int as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      ${listWhereClause}
      GROUP BY o.order_id, o.customer_name, o.customer_email, o.customer_phone, 
               o.total_amount, o.status, o.created_at
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(pageSize, offset);

    const orders = await executeQuery(listQuery, params);

    // Format timestamps to ISO strings
    const formattedOrders = orders.map((order) => ({
      ...order,
      created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
    }));

    log(`listOrders - Successfully fetched ${formattedOrders.length} orders (page ${page})`);
    res.json({
      page,
      pageSize,
      total,
      orders: formattedOrders,
    });
  } catch (error) {
    log(`listOrders - Error occurred:`, error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * GET /api/admin/orders/:orderId
 * Get a single order with its items
 */
export const getOrder = async (req, res) => {
  const { orderId } = req.params;
  log(`getOrder - Request started for orderId: ${orderId}`);

  try {
    // Get order
    const orderRows = await executeQuery(
      `SELECT 
        order_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        order_notes,
        total_amount,
        status,
        created_at,
        updated_at
      FROM orders
      WHERE order_id = $1`,
      [orderId]
    );

    if (orderRows.length === 0) {
      log(`getOrder - Order not found for orderId: ${orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    // Get order items with product info (LEFT JOIN in case product is deleted)
    const itemsRows = await executeQuery(
      `SELECT 
        oi.product_id,
        COALESCE(p.name, NULL) as name,
        COALESCE(p.image_urls, ARRAY[]::TEXT[]) as image_urls,
        oi.quantity,
        oi.unit_price,
        oi.total_price
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id`,
      [orderId]
    );

    // Format items
    const items = itemsRows.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      image_urls: item.image_urls || [],
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      total_price: parseFloat(item.total_price),
    }));

    // Format timestamps to ISO strings
    const formattedOrder = {
      ...order,
      created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
      updated_at: order.updated_at ? new Date(order.updated_at).toISOString() : null,
    };

    log(`getOrder - Successfully fetched order: ${orderId}`);
    res.json({
      order: formattedOrder,
      items,
    });
  } catch (error) {
    log(`getOrder - Error occurred for orderId ${orderId}:`, error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

/**
 * PATCH /api/admin/orders/:orderId/status
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  log(`updateOrderStatus - Request started for orderId: ${orderId}`);

  try {
    // Validate status
    if (!req.body || !req.body.status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const newStatus = validateStatus(req.body.status);

    // Update order status
    const updateRows = await executeQuery(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE order_id = $2
       RETURNING 
         order_id,
         customer_name,
         customer_email,
         customer_phone,
         total_amount,
         status,
         created_at,
         updated_at`,
      [newStatus, orderId]
    );

    if (updateRows.length === 0) {
      log(`updateOrderStatus - Order not found for orderId: ${orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    const order = updateRows[0];

    // Format timestamps to ISO strings
    const formattedOrder = {
      order_id: order.order_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      total_amount: parseFloat(order.total_amount),
      status: order.status,
      created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
      updated_at: order.updated_at ? new Date(order.updated_at).toISOString() : null,
    };

    log(`updateOrderStatus - Successfully updated order status: ${orderId} to ${newStatus}`);
    res.json({ order: formattedOrder });
  } catch (error) {
    if (error.message.includes("Invalid status")) {
      log(`updateOrderStatus - Validation failed for orderId ${orderId}:`, error.message);
      return res.status(400).json({ error: error.message });
    }
    log(`updateOrderStatus - Error occurred for orderId ${orderId}:`, error.message);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

