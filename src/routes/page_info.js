import { Router } from "express";

import * as page_info from "../controllers/page_info.js";
// import * as products from "../controllers/products.js";
// import { validate } from "../middlewares/validate.js";
// import { authMiddleware } from "../middlewares/auth.js";

const r = Router();

// GET /products - List all products (with optional collection_slug filter)
r.get("/about", page_info.getAbout);
r.get("/contact", page_info.getContact);

export default r;
