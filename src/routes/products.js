import { Router } from "express";
import * as products from "../controllers/products.js";
import { validate } from "../middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.js";
import { authMiddleware } from "../middlewares/auth.js";

const r = Router();

// GET /products - List all products (with optional collection_slug filter)
r.get("/", products.listProducts);

// GET /products/:id - Get a specific product
r.get("/:id", products.getProduct);

// POST /products - Create a new product
r.post(
  "/",
  authMiddleware,
  validate(createProductSchema),
  products.createProduct
);

// PUT /products/:id - Update a product
r.put(
  "/:id",
  authMiddleware,
  validate(updateProductSchema),
  products.updateProduct
);

// DELETE /products/:id - Delete a product
r.delete("/:id", authMiddleware, products.deleteProduct);

export default r;
