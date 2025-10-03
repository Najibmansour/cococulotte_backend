import { executeQuery } from "../utils/database.js";
import { log } from "../utils/logger.js";

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
    const collections = await executeQuery(
      "SELECT * FROM collections WHERE slug = ?",
      [slug]
    );

    if (collections.length === 0) {
      log(`getCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`getCollection - Successfully fetched collection: ${slug}`);
    res.json({ data: collections[0] });
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

    await executeQuery(
      "INSERT INTO collections (slug, title, header_image, description) VALUES (?, ?, ?, ?)",
      [slug, title, header_image || null, description || null]
    );

    log(`createCollection - Successfully created collection: ${slug}`);
    const collection = { slug, title, header_image, description };
    res.status(201).json({ data: collection });
  } catch (error) {
    log(`createCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error creating collection:", error);
    if (error.code === "ER_DUP_ENTRY") {
      log(`createCollection - Duplicate entry error for slug: ${slug}`);
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
    const result = await executeQuery(
      "UPDATE collections SET title = ?, header_image = ?, description = ? WHERE slug = ?",
      [title, header_image, description, slug]
    );

    if (result.affectedRows === 0) {
      log(`updateCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`updateCollection - Successfully updated collection: ${slug}`);
    const collection = { slug, title, header_image, description };
    res.json({ data: collection });
  } catch (error) {
    log(`updateCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
};

export const deleteCollection = async (req, res) => {
  const { slug } = req.params;
  log(`deleteCollection - Request started for slug: ${slug}`);

  try {
    const result = await executeQuery(
      "DELETE FROM collections WHERE slug = ?",
      [slug]
    );

    if (result.affectedRows === 0) {
      log(`deleteCollection - Collection not found for slug: ${slug}`);
      return res.status(404).json({ error: "Collection not found" });
    }

    log(`deleteCollection - Successfully deleted collection: ${slug}`);
    res.status(204).send();
  } catch (error) {
    log(`deleteCollection - Error occurred for slug ${slug}:`, error.message);
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};

export const getCollectionProducts = async (req, res) => {
  const { slug } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  log(
    `getCollectionProducts - Request started for slug: ${slug}, limit: ${limit}, offset: ${offset}`
  );

  try {
    const products = await executeQuery(
      "SELECT * FROM products WHERE collection_slug = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [slug, parseInt(limit), parseInt(offset)]
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
