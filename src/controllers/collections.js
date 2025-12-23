import { executeQuery } from "../utils/database.js";
import { log } from "../utils/logger.js";

/**
 * Collections Controller — PostgreSQL version
 * - Uses $1..$n placeholders
 * - Uses RETURNING * to detect 0-row updates/deletes and to return created/updated rows
 * - Handles unique constraint errors with code '23505'
 */

export const listCollections = async (req, res) => {
  log("listCollections - Request started");

  try {
    const collections = await executeQuery(
      "SELECT * FROM collections ORDER BY title"
    );

    log(
      `listCollections - Successfully fetched ${collections.length} collections`
    );
    res.json({ data: collections });
  } catch (error) {
    log("listCollections - Error occurred:", error.message);
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

export const getCollection = async (req, res) => {
  const { slug } = req.params;
  log(`getCollection - Request started for slug: ${slug}`);

  try {
    const rows = await executeQuery(
      "SELECT * FROM collections WHERE slug = $1",
      [slug]
    );

    if (rows.length === 0) {
      log(`getCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`getCollection - Successfully fetched collection: ${slug}`);
    res.json({ data: rows[0] });
  } catch (error) {
    log(`getCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
};

export const createCollection = async (req, res) => {
  const { slug, title, header_image, description } = req.body;
  log(`createCollection - Request started for slug: ${slug}, title: ${title}`);

  try {
    if (!slug || !title) {
      log(
        `createCollection - Validation failed: missing required fields - slug: ${!!slug}, title: ${!!title}`
      );
      return res.status(400).json({
        error: "Slug and title are required",
      });
    }

    const rows = await executeQuery(
      `INSERT INTO collections (slug, title, header_image, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [slug, title, header_image ?? null, description ?? null]
    );

    log(`createCollection - Successfully created collection: ${slug}`);
    res.status(201).json({ data: rows[0] });
  } catch (error) {
    log(`createCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error creating collection:", error);
    if (error.code === "23505") {
      // unique_violation in Postgres
      log(`createCollection - Duplicate entry error for slug/title: ${slug}`);
      res
        .status(409)
        .json({ error: "Collection with this slug or title already exists" });
    } else {
      res.status(500).json({ error: "Failed to create collection" });
    }
  }
};

export const updateCollection = async (req, res) => {
  const { slug } = req.params;
  const { title, header_image, description } = req.body;
  log(`updateCollection - Request started for slug: ${slug}, title: ${title}`);

  try {
    const rows = await executeQuery(
      `UPDATE collections
         SET title = $1,
             header_image = $2,
             description = $3
       WHERE slug = $4
       RETURNING *`,
      [title ?? null, header_image ?? null, description ?? null, slug]
    );

    if (rows.length === 0) {
      log(`updateCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`updateCollection - Successfully updated collection: ${slug}`);
    res.json({ data: rows[0] });
  } catch (error) {
    log(`updateCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error updating collection:", error);
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Collection with this title already exists" });
    }
    res.status(500).json({ error: "Failed to update collection" });
  }
};

export const deleteCollection = async (req, res) => {
  const { slug } = req.params;
  log(`deleteCollection - Request started for slug: ${slug}`);

  try {
    const rows = await executeQuery(
      "DELETE FROM collections WHERE slug = $1 RETURNING slug",
      [slug]
    );

    if (rows.length === 0) {
      log(`deleteCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`deleteCollection - Successfully deleted collection: ${slug}`);
    res.status(200).json({
      message: "Collection deleted successfully",
      data: { slug },
    });
  } catch (error) {
    if (error.code === "23503") {
      log(
        `deleteCollection - Foreign key constraint violation for slug ${slug}:`,
        error.message
      );
      return res.status(409).json({
        error:
          "Cannot delete this collection because it contains products. Remove the products first.",
      });
    }

    log(`deleteCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};

export const getCollectionProducts = async (req, res) => {
  const { slug } = req.params;
  const limitSafe = Math.max(0, parseInt(req.query.limit ?? "50", 10));
  const offsetSafe = Math.max(0, parseInt(req.query.offset ?? "0", 10));

  log(
    `getCollectionProducts - Request started for slug: ${slug}, limit: ${limitSafe}, offset: ${offsetSafe}`
  );

  try {
    const products = await executeQuery(
      `SELECT *
         FROM products
        WHERE collection_slug = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
      [slug, limitSafe, offsetSafe]
    );

    log(
      `getCollectionProducts - Successfully fetched ${products.length} products for collection: ${slug}`
    );
    res.json({ data: products });
  } catch (error) {
    log(
      `getCollectionProducts - Error occurred for slug ${slug}:`,
      error.message
    );
    console.error("Error fetching collection products:", error);
    res.status(500).json({ error: "Failed to fetch collection products" });
  }
};
