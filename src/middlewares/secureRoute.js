const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const User = mongoose.model("User");
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "Token required" });
  } else {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET, async (err, payload) => {
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        try {
          const { _id } = payload;

          const user = await User.findById(_id);

          req.user = user;
          next();
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    });
  }
};
