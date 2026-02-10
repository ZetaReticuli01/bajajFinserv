require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const bfhlRoutes = require("./routes/bfhlRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/", bfhlRoutes);

app.use((err, req, res, next) => {
  return res.status(500).json({
    is_success: false,
    official_email: process.env.OFFICIAL_EMAIL,
    error: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
