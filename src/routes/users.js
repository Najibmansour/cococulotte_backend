import { Router } from "express";
import * as users from "../controllers/users.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../schemas/user.js";

const r = Router();

r.get("/", users.listUsers);
r.post("/", validate(createUserSchema), users.createUser);

export default r;
