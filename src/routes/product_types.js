import { Router } from "express";
import * as productTypes from "../controllers/product_types.js";
import { validate } from "../middlewares/validate.js";

import { authMiddleware } from "../middlewares/auth.js";
import {
  createProductTypeSchema,
  updateProductTypeSchema,
} from "../schemas/productType.js";

const r = Router();

// GET /product-types - List all product types
r.get("/", productTypes.listTypes);

// GET /product-types/:slug - Get a specific product type
r.get("/:slug", productTypes.getType);

// POST /product-types - Create a new product type
r.post(
  "/",
  authMiddleware,
  validate(createProductTypeSchema),
  productTypes.createType
);

// PUT /product-types/:slug - Update a product type
r.put(
  "/:slug",
  authMiddleware,
  validate(updateProductTypeSchema),
  productTypes.updateType
);

// DELETE /product-types/:slug - Delete a product type
r.delete("/:slug", authMiddleware, productTypes.deleteType);

export default r;
