// controllers/products.controller.js
import { log } from "../utils/logger.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from "../schemas/product.js";

const nullIfEmpty = (v) => (v === "" || v === undefined ? null : v);

/** Build dynamic SET clause for UPDATE based on provided fields */
function buildUpdateSet(obj, extraPairs = []) {
  const keys = Object.keys(obj);
  const sets = [];
  const values = [];
  let idx = 1;

  for (const k of keys) {
    // Skip undefined
    if (obj[k] === undefined) continue;
    sets.push(`${k} = $${idx++}`);
    values.push(obj[k]);
  }

  // Add extras (e.g., updated_at = now()) that are not parameterized
  for (const sql of extraPairs) sets.push(sql);

  return { sets, values };
}

export const listProducts = async (req, res) => {
  try {
    const {
      collection_slug,
      type_slug,
      limit,
      offset,
      price_min,
      price_max,
      available,
    } = req.query;

    const { executeQuery } = await import("../utils/database.js");

    let query = "SELECT * FROM products";
    const conditions = [];
    const params = [];
    let i = 1;

    if (collection_slug) {
      conditions.push(`collection_slug = $${i++}`);
      params.push(collection_slug);
    }
    if (type_slug) {
      conditions.push(`type_slug = $${i++}`);
      params.push(type_slug);
    }
    // Allow one-sided price filters too
    if (price_min !== undefined && price_max !== undefined) {
      conditions.push(`price BETWEEN $${i} AND $${i + 1}`);
      params.push(price_min, price_max);
      i += 2;
    } else if (price_min !== undefined) {
      conditions.push(`price >= $${i++}`);
      params.push(price_min);
    } else if (price_max !== undefined) {
      conditions.push(`price <= $${i++}`);
      params.push(price_max);
    }

    if (available === "true") conditions.push("available = TRUE");
    if (available === "false") conditions.push("available = FALSE");

    if (conditions.length) query += " WHERE " + conditions.join(" AND ");

    query += ` ORDER BY id DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(limit, offset);

    const products = await executeQuery(query, params);
    log(`listProducts - Successfully fetched ${products.length} products`);
    res.json({ data: products });
  } catch (error) {
    log(`listProducts - Error occurred:`, error.message);
    res.status(400).json({
      message: "Invalid query parameters",
      error: error.errors ?? error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  log(`getProduct - Request started for id: ${id}`);

  try {
    const { executeQuery } = await import("../utils/database.js");
    const rows = await executeQuery("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      log(`getProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    log(`getProduct - Successfully fetched product: ${id}`);
    res.json({ data: rows[0] });
  } catch (error) {
    log(`getProduct - Error occurred for id ${id}:`, error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  log(
    `createProduct - Request started for name: ${req.body?.name}, collection_slug: ${req.body?.collection_slug}`
  );

  try {
    const payload = createProductSchema.parse(req.body);

    const { executeQuery } = await import("../utils/database.js");

    const imageUrl = nullIfEmpty(payload.image_url ?? null);

    const rows = await executeQuery(
      `INSERT INTO products
        (name, price, collection_slug, type_slug, image_url, quantity, colors, description)
       VALUES ($1,   $2,   $3,             $4,       $5,        $6,       $7,     $8)
       RETURNING id, name, price, collection_slug, type_slug, image_url, quantity, colors, description, available, created_at, updated_at`,
      [
        payload.name,
        payload.price,
        payload.collection_slug,
        payload.type_slug,
        imageUrl,
        payload.quantity ?? 0,
        payload.colors ?? [],
        payload.description ?? "",
      ]
    );

    const product = rows[0];
    log(`createProduct - Successfully created product with id: ${product.id}`);
    res.status(201).json({ data: product });
  } catch (error) {
    if (error?.errors) {
      log(`createProduct - Validation failed`);
      return res.status(400).json({ error: error.errors });
    }
    log(`createProduct - Error occurred:`, error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  log(`updateProduct - Request started for id: ${id}`);

  try {
    const payload = updateProductSchema.parse(req.body);

    // Normalize image_url empty string to NULL for DB
    if ("image_url" in payload) {
      payload.image_url = nullIfEmpty(payload.image_url ?? null);
    }

    const { sets, values } = buildUpdateSet(payload, ["updated_at = now()"]);

    if (sets.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const { executeQuery } = await import("../utils/database.js");
    const rows = await executeQuery(
      `UPDATE products
          SET ${sets.join(", ")}
        WHERE id = $${values.length + 1}
        RETURNING id, name, price, collection_slug, type_slug, image_url, quantity, colors, description, available, created_at, updated_at`,
      [...values, id]
    );

    if (rows.length === 0) {
      log(`updateProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    log(`updateProduct - Successfully updated product: ${id}`);
    res.json({ data: rows[0] });
  } catch (error) {
    if (error?.errors) {
      log(`updateProduct - Validation failed for id ${id}`);
      return res.status(400).json({ error: error.errors });
    }
    log(`updateProduct - Error occurred for id ${id}:`, error.message);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  log(`deleteProduct - Request started for id: ${id}`);

  try {
    const { executeQuery } = await import("../utils/database.js");
    const rows = await executeQuery(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );

    if (rows.length === 0) {
      log(`deleteProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    log(`deleteProduct - Successfully deleted product: ${id}`);
    res.status(204).send();
  } catch (error) {
    log(`deleteProduct - Error occurred for id ${id}:`, error.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
