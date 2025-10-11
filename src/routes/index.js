import { Router } from "express";
import users from "./users.js";
import products from "./products.js";
import collections from "./collections.js";
import page_info from "./page_info.js";
import email from "./email.js";

export const router = Router();
router.use("/users", users);
router.use("/products", products);
router.use("/collections", collections);
router.use("/page_info", page_info);
router.use("/email", email);
