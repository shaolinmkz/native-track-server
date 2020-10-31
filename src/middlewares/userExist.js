const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const User = mongoose.model("User");
  const { email } = req.body;

  if (email) {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          res.status(400).json({ message: "user already exist" });
        } else {
          next();
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "Error occured while checking if user exist" });
      });
  } else {
    res.status(400).json({ message: "You didn't specify an email to lookup" });
  }
};
