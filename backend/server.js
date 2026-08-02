require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const atmRoutes = require("./routes/atmRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Database connected");
  }
});


// ATM routes
app.use("/api/atms", atmRoutes);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});