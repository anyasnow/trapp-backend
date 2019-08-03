const express = require('express');
const User = require('../models/User');
const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, doc) => {
    if (!doc) {
      return res.status(400).json({ error: 'Incorrect username or password' });
    } else if (!doc.validPassword(password)) {
      return res.status(400).json({ error: 'Incorrect username or password' });
    } else {
      return res.status(200).json({
        authToken: `Bearer ${doc.generateJWT()}`
      });
    }
  });
});

module.exports = authRouter;
