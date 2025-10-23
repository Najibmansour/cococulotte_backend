import { Router } from "express";

import * as page_info from "../controllers/page_info.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import { updateHomeSchema } from "../schemas/page_info/home.js";
import { updateAboutSchema } from "../schemas/page_info/about.js";
import { updateContactSchema } from "../schemas/page_info/contact.js";

const r = Router();

// GET /page_info - List all page_info
r.get("/about", page_info.getAbout);
r.get("/contact", page_info.getContact);
r.get("/home", page_info.getHome);

//PUT protected update ifo for pages
// replace the stored JSON
r.post(
  "/home",
  authMiddleware,
  validate(updateHomeSchema),
  page_info.updateHome
);
r.post(
  "/about",
  authMiddleware,
  validate(updateAboutSchema),
  page_info.updateAbout
);
r.post(
  "/contact",
  authMiddleware,
  validate(updateContactSchema),
  page_info.updateContact
);

export default r;
