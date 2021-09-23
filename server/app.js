// Import third-party module
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Encapsulation Module
const app = express();

// Setting module
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Declaration routes
const authRoute = require("./routes/auth");

// Setting Routes
app.use("/V1", authRoute);

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Welcome to API",
    Author: "Senoside",
  });
});

app.use("*", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1><p>Page Not Found</p>");
});

// Listening PORT And PORT declaracion
const PORT = process.env.PORT || 3000;
require("./config/config")();

const server = app.listen(PORT, () => {
  console.log(`server up on http://localhost:${server.address().port}`);
});
