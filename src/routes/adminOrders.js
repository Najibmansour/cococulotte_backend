/**
 * Admin Orders endpoints for admin UI.
 * 
 * Provides endpoints for listing orders, viewing order details, and updating order status.
 * All routes require admin authentication via x-admin-token header.
 * 
 * Required environment variable: ADMIN_TOKEN
 */
import { Router } from "express";
import * as adminOrders from "../controllers/adminOrders.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";

const r = Router();

// All routes require admin authentication
r.use(adminAuthMiddleware);

// GET /api/admin/orders - List orders with pagination, search, and sorting
r.get("/", adminOrders.listOrders);

// GET /api/admin/orders/:orderId - Get a single order with its items
r.get("/:orderId", adminOrders.getOrder);

// PATCH /api/admin/orders/:orderId/status - Update order status
r.patch("/:orderId/status", adminOrders.updateOrderStatus);

export default r;

