import { log } from "../utils/logger.js";

export const listProducts = async (req, res) => {
  const {
    collection_slug,
    type_slug,
    limit = 50,
    offset = 0,
    price_min,
    price_max,
  } = req.query;
  console.log(req.query["type_slug"]);

  try {
    const { executeQuery } = await import("../utils/database.js");

    const parsedLimit = parseInt(limit) || 50;
    const parsedOffset = parseInt(offset) || 0;

    let query = "SELECT * FROM products";
    let params = [];

    if (collection_slug && type_slug) {
      query += " WHERE collection_slug = ? AND type_slug = ? ";
      params.push(collection_slug);
      params.push(type_slug);
    } else {
      if (collection_slug) {
        query += " WHERE collection_slug = ? ";
        params.push(collection_slug);
      }

      if (type_slug) {
        query += " WHERE type_slug = ? ";
        params.push(type_slug);
      }
    }

    if (price_min && price_max) {
      query +=
        collection_slug || type_slug
          ? " AND price BETWEEN ? AND ?"
          : " WHERE price BETWEEN ? AND ?";
      params.push(price_min);
      params.push(price_max);
    }

    query += ` ORDER BY id DESC LIMIT ${parsedLimit} OFFSET ${parsedOffset} `;

    console.log(query);
    console.log(params);

    const products = await executeQuery(query, params);
    log(`listProducts - Successfully fetched ${products.length} products`);
    res.json({ data: products });
  } catch (error) {
    log(`listProducts - Error occurred:`, error.message);
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  log(`getProduct - Request started for id: ${id}`);

  try {
    const { executeQuery } = await import("../utils/database.js");
    const products = await executeQuery("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    if (products.length === 0) {
      log(`getProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    log(`getProduct - Successfully fetched product: ${id}`);
    res.json({ data: products[0] });
  } catch (error) {
    log(`getProduct - Error occurred for id ${id}:`, error.message);
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, collection_slug, image_url } = req.body;
  log(
    `createProduct - Request started for name: ${name}, collection_slug: ${collection_slug}`
  );

  try {
    const { executeQuery } = await import("../utils/database.js");

    if (!name || !price || !collection_slug) {
      log(
        `createProduct - Validation failed: missing required fields - name: ${!!name}, price: ${!!price}, collection_slug: ${!!collection_slug}`
      );
      return res.status(400).json({
        error: "Name, price, and collection_slug are required",
      });
    }

    const result = await executeQuery(
      "INSERT INTO products (name, price, collection_slug, image_url) VALUES (?, ?, ?, ?)",
      [name, price, collection_slug, image_url || null]
    );

    const product = {
      id: result.insertId,
      name,
      price,
      collection_slug,
      image_url,
    };

    log(
      `createProduct - Successfully created product with id: ${result.insertId}`
    );
    res.status(201).json({ data: product });
  } catch (error) {
    log(`createProduct - Error occurred:`, error.message);
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, collection_slug, image_url } = req.body;
  log(`updateProduct - Request started for id: ${id}, name: ${name}`);
  try {
    const { executeQuery } = await import("../utils/database.js");
    const result = await executeQuery(
      "UPDATE products SET name = ?, price = ?, collection_slug = ?, image_url = ? WHERE id = ?",
      [name, price, collection_slug, image_url, id]
    );

    if (result.affectedRows === 0) {
      log(`updateProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    const product = {
      id: parseInt(id),
      name,
      price,
      collection_slug,
      image_url,
    };
    log(`updateProduct - Successfully updated product: ${id}`);
    res.json({ data: product });
  } catch (error) {
    log(`updateProduct - Error occurred for id ${id}:`, error.message);
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  log(`deleteProduct - Request started for id: ${id}`);

  try {
    const { executeQuery } = await import("../utils/database.js");
    const result = await executeQuery("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      log(`deleteProduct - Product not found for id: ${id}`);
      return res.status(404).json({ error: "Product not found" });
    }

    log(`deleteProduct - Successfully deleted product: ${id}`);
    res.status(204).send();
  } catch (error) {
    log(`deleteProduct - Error occurred for id ${id}:`, error.message);
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
