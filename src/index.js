const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("morgan");
const authRoute = require("./routes/authRouter");
const trackRoute = require("./routes/trackRouter");
const secureRoute = require("./middlewares/secureRoute");

require("./models");

dotenv.config();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());

const { CONNECTION_URI_DEV, CONNECTION_URI_PROD, NODE_ENV } = process.env;

mongoose.connect(
  NODE_ENV === "production" ? CONNECTION_URI_PROD : CONNECTION_URI_DEV,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to the mongoDB instance");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongoDB", err);
});

app.get("/", (req, res) => {
  res.json({ data: "Welcome to native tracker server" });
});

app.use(authRoute);
app.use(secureRoute, trackRoute);

app.use("*", (req, res) => {
  res.json({ data: "Not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("listening on port", PORT));
