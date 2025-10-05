export function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  console.log(req.headers);

  const STATIC_KEY = process.env.ADMIN_PASS;

  if (token === STATIC_KEY) {
    next();
  } else {
    res.status(403).json({ message: "unauthorized" });
  }
}
