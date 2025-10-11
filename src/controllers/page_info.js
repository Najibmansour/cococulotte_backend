import { createAboutSchema } from "../schemas/page_info/about.js";
import { createContactSchema } from "../schemas/page_info/contact.js";
import { createHomeSchema } from "../schemas/page_info/home.js";
import pool, { executeQuery } from "../utils/database.js";
import { log } from "../utils/logger.js";

export const getAbout = async (req, res) => {
  try {
    const about_info = await executeQuery("SELECT * FROM about_json");

    log(` Successfully fetched ABOUT`);
    res.json(about_info[0].data);
  } catch (error) {
    log(" Error occurred:", error.message);
    console.error("Error fetching about info:", error);
    res.status(500).json({ error: "Failed to fetch ABOUT" });
  }
};

export const getContact = async (req, res) => {
  try {
    const about_info = await executeQuery("SELECT * FROM contact_json");

    log(` Successfully fetched CONTACT`);
    res.json(about_info[0].data);
  } catch (error) {
    log(" Error occurred:", error.message);
    console.error("Error fetching about info:", error);
    res.status(500).json({ error: "Failed to fetch CONTACT" });
  }
};

export const getHome = async (req, res) => {
  try {
    const about_info = await executeQuery("SELECT * FROM home_json");

    log(` Successfully fetched HOME`);
    res.json(about_info[0].data);
  } catch (error) {
    log(" Error occurred:", error.message);
    console.error("Error fetching about info:", error);
    res.status(500).json({ error: "Failed to fetch HOME" });
  }
};

/**
 * Factory: returns an Express handler that upserts a JSON page row.
 * Assumes the table has columns: (key_slug UNIQUE, data JSON).
 * Replaces the entire JSON document each call (full-data updates).
 *
 * @param {{ table: 'home_json'|'about_json'|'contact_json', slug: 'home'|'about'|'contact', schema: import('zod').ZodSchema<any> }} cfg
 */
export function makeUpdateJsonPageController(cfg) {
  const TABLE = cfg.table; // constant string from our code (not user input)
  const SLUG = cfg.slug;
  const SCHEMA = cfg.schema;

  return async function updateJsonPage(req, res) {
    const parsed = SCHEMA.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "ValidationError",
        details: parsed.error.flatten(),
      });
    }
    const payload = parsed.data;

    try {
      await pool.execute(
        `
          INSERT INTO ${TABLE} (key_slug, data)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE data = VALUES(data)
        `,
        [SLUG, JSON.stringify(payload)]
      );

      return res.status(200).json({ ok: true, slug: SLUG });
    } catch (err) {
      console.error(`[update ${SLUG}]`, err);
      return res.status(500).json({ error: "ServerError" });
    }
  };
}

/* -----------------------------------------------------------
 * Concrete controllers for each page
 * --------------------------------------------------------- */

export const updateHome = makeUpdateJsonPageController({
  table: "home_json",
  slug: "home",
  schema: createHomeSchema,
});

export const updateAbout = makeUpdateJsonPageController({
  table: "about_json",
  slug: "about",
  schema: createAboutSchema,
});

export const updateContact = makeUpdateJsonPageController({
  table: "contact_json",
  slug: "contact",
  schema: createContactSchema,
});
