const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to the mongoDB instance");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongoDB", err);
});

app.get("/", (req, res) => {
  res.send("Hi there");
});

const PORT = 3000;

app.listen(PORT, () => console.log("listening on port", PORT));
