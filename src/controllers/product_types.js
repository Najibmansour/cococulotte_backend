import { executeQuery } from "../utils/database.js";
import { log } from "../utils/logger.js";
import {
  createProductTypeSchema,
  updateProductTypeSchema,
} from "../schemas/productType.js";

/**
 * Product Types Controller — PostgreSQL version
 * - Uses $1..$n placeholders
 * - Uses RETURNING * to detect 0-row updates/deletes and to return created/updated rows
 * - Handles unique constraint errors with code '23505'
 */

/**
 * List all types
 */
export const listTypes = async (req, res) => {
  log("listTypes - Request started");

  try {
    const types = await executeQuery(
      "SELECT * FROM product_types ORDER BY title"
    );
    log(`listTypes - Successfully fetched ${types.length} types`);
    res.json({ data: types });
  } catch (error) {
    log("listTypes - Error occurred:", error.message);
    console.error("Error fetching types:", error);
    res.status(500).json({ error: "Failed to fetch types" });
  }
};

/**
 * Get a single type by slug
 */
export const getType = async (req, res) => {
  const { slug } = req.params;
  log(`getType - Request started for slug: ${slug}`);

  try {
    const types = await executeQuery(
      "SELECT * FROM product_types WHERE slug = $1",
      [slug]
    );

    if (types.length === 0) {
      log(`getType - Type not found for slug: ${slug}`);
      return res.status(404).json({ error: "Type not found" });
    }

    log(`getType - Successfully fetched type: ${slug}`);
    res.json({ data: types[0] });
  } catch (error) {
    log(`getType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error fetching type:", error);
    res.status(500).json({ error: "Failed to fetch type" });
  }
};

/**
 * Create a new type
 */
export const createType = async (req, res) => {
  let slug = req.body?.slug;
  let title = req.body?.title;
  try {
    ({ slug, title } = createProductTypeSchema.parse(req.body));
    log(`createType - Request started for slug: ${slug}, title: ${title}`);

    const rows = await executeQuery(
      "INSERT INTO product_types (slug, title) VALUES ($1, $2) RETURNING *",
      [slug, title]
    );

    log(`createType - Successfully created type: ${slug}`);
    res.status(201).json({ data: rows[0] });
  } catch (error) {
    if (error?.errors) {
      log(`createType - Validation failed for slug ${req.body?.slug}`);
      return res.status(400).json({ error: error.errors });
    }
    log(`createType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error creating type:", error);
    if (error.code === "23505") {
      // unique_violation in Postgres
      log(`createType - Duplicate entry error for slug: ${slug}`);
      res
        .status(409)
        .json({ error: "Type with this slug or title already exists" });
    } else {
      res.status(500).json({ error: "Failed to create type" });
    }
  }
};

/**
 * Update an existing type
 */
export const updateType = async (req, res) => {
  const { slug } = req.params;
  try {
    const { title } = updateProductTypeSchema.parse(req.body);
    log(`updateType - Request started for slug: ${slug}, title: ${title}`);

    const rows = await executeQuery(
      "UPDATE product_types SET title = $1 WHERE slug = $2 RETURNING *",
      [title, slug]
    );

    if (rows.length === 0) {
      log(`updateType - Type not found for slug: ${slug}`);
      return res.status(404).json({ error: "Type not found" });
    }

    log(`updateType - Successfully updated type: ${slug}`);
    res.json({ data: rows[0] });
  } catch (error) {
    if (error?.errors) {
      log(`updateType - Validation failed for slug ${slug}`);
      return res.status(400).json({ error: error.errors });
    }
    log(`updateType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error updating type:", error);
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Type with this title already exists" });
    }
    res.status(500).json({ error: "Failed to update type" });
  }
};

/**
 * Delete a type
 */
export const deleteType = async (req, res) => {
  const { slug } = req.params;
  log(`deleteType - Request started for slug: ${slug}`);

  try {
    const rows = await executeQuery(
      "DELETE FROM product_types WHERE slug = $1 RETURNING slug",
      [slug]
    );

    if (rows.length === 0) {
      log(`deleteType - Type not found for slug: ${slug}`);
      return res.status(404).json({ error: "Type not found" });
    }

    log(`deleteType - Successfully deleted type: ${slug}`);
    res.status(204).send();
  } catch (error) {
    log(`deleteType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error deleting type:", error);
    res.status(500).json({ error: "Failed to delete type" });
  }
};
