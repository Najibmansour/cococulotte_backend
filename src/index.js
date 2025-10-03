import { createServer } from "./server.js";
import { testConnection } from "./utils/database.js";

const port = process.env.PORT || 3000;
const app = createServer();

app.listen(port, async () => {
  console.log(`API running on http://localhost:${port}`);
  await testConnection();
});
