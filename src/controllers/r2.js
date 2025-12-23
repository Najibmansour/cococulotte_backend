import * as storageService from "../services/storageService.js";
import { z } from "zod";

const presignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().refine((val) => val.startsWith("image/"), {
    message: "Only image files are allowed",
  }),
});

export const presign = async (req, res, next) => {
  try {
    const { filename, contentType } = presignSchema.parse(req.body);
    const result = await storageService.getPresignedUrl(filename, contentType);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const listFiles = async (req, res, next) => {
  try {
    const files = await storageService.listFiles();
    res.json(files);
  } catch (error) {
    next(error);
  }
};
