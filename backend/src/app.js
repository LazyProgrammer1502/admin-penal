const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// In production, lock CORS to your deployed frontend(s) via CLIENT_URL
// (comma-separated). With no CLIENT_URL set (local dev), allow all origins.
const allowed = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true;
app.use(cors({ origin: allowed, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

// Central error handler (4 args = Express treats it as error middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
