const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRouter");
const trackRoute = require("./routes/trackRouter");
const requireAuth = require("./middlewares/requireAuth");
require("./models");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(authRoute);
app.use(requireAuth, trackRoute);

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
  res.json({ data: "Welcome to native tracker server" });
});

app.use("*", (req, res) => {
  res.json({ data: "Not found" });
});

const PORT = 3000;

app.listen(PORT, () => console.log("listening on port", PORT));
