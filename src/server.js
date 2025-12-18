import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import { router as apiRouter } from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { requestLogger } from "./middlewares/requestLogger.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://cococulotte.com",
  "https://www.cococulotte.com",
  "https://www.cococulotte-dev.netlify.app",
];



export const createServer = () => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // allow server-to-server/no-origin requests too (e.g., curl/health checks)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
    
  );
  app.use(json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/test-db", async (_req, res) => {
    try {
      const { executeQuery } = await import("./utils/database.js");
      const result = await executeQuery("SELECT 1 as test");
      res.json({ ok: true, result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/test-products", async (_req, res) => {
    try {
      const { executeQuery } = await import("./utils/database.js");
      console.log("Testing products query...");
      const result = await executeQuery(
        "SELECT COUNT(*) as count FROM products"
      );
      console.log("Products count result:", result);
      res.json({ ok: true, result });
    } catch (error) {
      console.log("Products test error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.use("/api", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
