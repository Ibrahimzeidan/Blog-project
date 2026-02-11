/**
 * Application entry point.
 * Purpose: Connect to database and start HTTP server (app.listen).
 */
import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start() {
  await connectDB();
  app.listen(env.PORT, () =>
    console.log(`Server running on http://localhost:${env.PORT}`)
  );
}

start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
