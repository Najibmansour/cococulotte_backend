import { Router } from "express";
import { sendOrder, sendContact } from "../controllers/email.js";
import { validate } from "../middlewares/validate.js";
import { orderEmailSchema, contactFormSchema } from "../schemas/email.js";

const router = Router();

// POST /api/email/order - Send order email
router.post("/order", validate(orderEmailSchema), sendOrder);

// POST /api/email/contact - Send contact form email
router.post("/contact", validate(contactFormSchema), sendContact);

export default router;
