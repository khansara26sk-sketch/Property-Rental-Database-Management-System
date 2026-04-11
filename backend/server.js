const express = require("express");
const cors = require("cors");

const ownersRoutes = require("./routes/owners");
const propertiesRoutes = require("./routes/properties");
const rentersRoutes = require("./routes/renters");
const agreementsRoutes = require("./routes/agreements");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Property Rental Backend Running");
});

app.use("/auth", authRoutes);
app.use("/owners", ownersRoutes);
app.use("/properties", propertiesRoutes);
app.use("/renters", rentersRoutes);
app.use("/agreements", agreementsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});