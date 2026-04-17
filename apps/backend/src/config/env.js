import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number.parseInt(process.env.PORT || "5001", 10);

if (Number.isNaN(port)) {
  throw new Error("Invalid PORT value. PORT must be a valid number.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

if (nodeEnv === "production" && !process.env.API_URL) {
  throw new Error("Missing API_URL environment variable in production.");
}

export const ENV = {
  PORT: port,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: nodeEnv,
  API_URL: process.env.API_URL,
};
