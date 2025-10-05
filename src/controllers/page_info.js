import { executeQuery } from "../utils/database.js";
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

    log(` Successfully fetched ABOUT`);
    res.json(about_info[0].data);
  } catch (error) {
    log(" Error occurred:", error.message);
    console.error("Error fetching about info:", error);
    res.status(500).json({ error: "Failed to fetch ABOUT" });
  }
};
