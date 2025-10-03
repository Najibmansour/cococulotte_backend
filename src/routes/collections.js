import { Router } from "express";
import * as collections from "../controllers/collections.js";
import { validate } from "../middlewares/validate.js";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "../schemas/collection.js";

const r = Router();

// GET /collections - List all collections
r.get("/", collections.listCollections);

// GET /collections/:slug - Get a specific collection
r.get("/:slug", collections.getCollection);

// GET /collections/:slug/products - Get products in a collection
r.get("/:slug/products", collections.getCollectionProducts);

// POST /collections - Create a new collection
r.post("/", validate(createCollectionSchema), collections.createCollection);

// PUT /collections/:slug - Update a collection
r.put("/:slug", validate(updateCollectionSchema), collections.updateCollection);

// DELETE /collections/:slug - Delete a collection
r.delete("/:slug", collections.deleteCollection);

export default r;
