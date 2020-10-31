const { Router } = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = Router();

router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if(email && password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const User = mongoose.model("User");
    const user = new User({ email, password: encryptedPassword });
    user
      .save()
      .then(({ email, _id }) => {

        const token = jwt.sign({ email, _id }, process.env.SECRET);
        res.status(201).json({ data: { email, token } });
      })
      .catch((error) => {
        res.status(422).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: 'Must provide email and password' });
  }

});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if(email && password) {
  const User = mongoose.model("User");
  User
    .findOne({ email })
    .then(({ email, _id, password: hash }) => {
      const isPassword = bcrypt.compareSync(password, hash);
      if(isPassword) {
        const token = jwt.sign({ email, _id }, process.env.SECRET);
        res.status(200).json({ data: { email, token } });
      } else {
        res.status(400).json({ message: 'Incorrect email or password' });
      }
    })
    .catch((error) => {
      res.status(422).json({ message: error.message });
    });
  } else {
    res.status(400).json({ error: 'Must provide email and password' });
  }
});

module.exports = router;
