import { Router } from "express";
import users from "./users.js";
import products from "./products.js";
import collections from "./collections.js";

export const router = Router();
router.use("/users", users);
router.use("/products", products);
router.use("/collections", collections);
