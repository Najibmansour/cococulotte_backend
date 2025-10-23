import { executeQuery } from "../utils/database.js";
import { log } from "../utils/logger.js";

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
    const types = await executeQuery("SELECT * FROM types WHERE slug = ?", [
      slug,
    ]);

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
  const { slug, title } = req.body;
  log(`createType - Request started for slug: ${slug}, title: ${title}`);

  try {
    if (!slug || !title) {
      log(
        `createType - Validation failed: missing required fields - slug: ${!!slug}, title: ${!!title}`
      );
      return res.status(400).json({
        error: "Slug and title are required",
      });
    }

    await executeQuery("INSERT INTO types (slug, title) VALUES (?, ?)", [
      slug,
      title,
    ]);

    log(`createType - Successfully created type: ${slug}`);
    const type = { slug, title };
    res.status(201).json({ data: type });
  } catch (error) {
    log(`createType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error creating type:", error);
    if (error.code === "ER_DUP_ENTRY") {
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
  const { title } = req.body;
  log(`updateType - Request started for slug: ${slug}, title: ${title}`);

  try {
    const result = await executeQuery(
      "UPDATE types SET title = ? WHERE slug = ?",
      [title, slug]
    );

    if (result.affectedRows === 0) {
      log(`updateType - Type not found for slug: ${slug}`);
      return res.status(404).json({ error: "Type not found" });
    }

    log(`updateType - Successfully updated type: ${slug}`);
    const type = { slug, title };
    res.json({ data: type });
  } catch (error) {
    log(`updateType - Error occurred for slug ${slug}:`, error.message);
    console.error("Error updating type:", error);
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
    const result = await executeQuery("DELETE FROM types WHERE slug = ?", [
      slug,
    ]);

    if (result.affectedRows === 0) {
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
