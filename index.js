// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: process.env.FRONTEND_ORIGIN, // frontend domain
//     methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB:", err));

// // Routes
// app.get("/", (req, res) => {
//   res.send("Jan_Sahas Backend API");
// });

// // Submission routes
// const submissionRoutes = require("./routes/submissions");
// app.use("/api/submissions", submissionRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// server.js (or index.js)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- CORS ---------- */
// Allow multiple origins via env: FRONTEND_ORIGINS= http://localhost:3000, http://192.168.1.6:3000, https://your-prod-domain.com
const ALLOWED = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // allow server-to-server tools (curl/Postman) with no Origin
    if (!origin) return cb(null, true);
    const ok = ALLOWED.some(o => o === origin);
    return ok ? cb(null, true) : cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // set true only if you use cookies/auth across origins
  maxAge: 600,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

/* ---------- Parsers before routes ---------- */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* ---------- DB ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

/* ---------- Routes ---------- */
app.get("/", (_req, res) => res.send("Jan_Sahas Backend API"));

// /api/submissions (plural) — keep frontend consistent with this
const submissionRoutes = require("./routes/submissions");
app.use("/api/submissions", submissionRoutes);

/* ---------- Error surfaces (helps debug 400s) ---------- */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  const msg = err?.message || "Server error";
  res.status(500).json({ error: msg });
});

/* ---------- Boot ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed CORS origins:", ALLOWED);
});
