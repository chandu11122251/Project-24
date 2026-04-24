import cron from "node-cron";
import { runDailyGeneration } from "./services/puzzleGenerator.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Cron service started...");

// Schedule a task to run every day at midnight (00:00)
cron.schedule("0 0 * * *", () => {
  console.log("Running daily puzzle generation task...");
  runDailyGeneration();
});

// For testing: run once on startup if needed
// runDailyGeneration();
