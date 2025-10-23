export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "ValidationError",
      details: result.error.flatten(),
    });
  }
  next();
};
