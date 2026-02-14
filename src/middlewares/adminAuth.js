/**
 * Admin authentication middleware for admin-only routes.
 * Checks for x-admin-token header matching ADMIN_TOKEN environment variable.
 * 
 * Required environment variable: ADMIN_TOKEN
 * 
 * Usage:
 *   router.get("/admin/orders", adminAuthMiddleware, controller.listOrders);
 */
export function adminAuthMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  const expectedToken = process.env.ADMIN_PASS;

  if (!expectedToken) {
    console.warn("ADMIN_TOKEN environment variable is not set");
    return res.status(500).json({ message: "Admin authentication not configured" });
  }

  if (token === expectedToken) {
    next();
  } else {
    res.status(403).json({ message: "unauthorized" });
  }
}

