export const requestLogger = (req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - started;
    console.log(`${req.method} ${req.originalUrl} - ${ms}ms`);
  });
  next();
};
