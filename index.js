const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(process.env.PORT, () => console.log("server started"));
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("db connected"))
  .catch((err) => console.log(err));
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);