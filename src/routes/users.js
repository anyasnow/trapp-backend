const express = require('express');
const User = require('../models/User');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.get('/', (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next);
});

usersRouter.post('/signup', jsonBodyParser, (req, res, next) => {
  const { username, password, email } = req.body;
  for (const field of ['username', 'password', 'email']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field} of request body`
      });
    }
  }

  // Validate password - is it complex enough?
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: validatePassword(password) });
  }

  // Post User to DB
  const newUser = new User({ username, email });
  const hashedPassword = newUser.generateHash(password);
  newUser.password = hashedPassword;

  newUser.save((err, doc) => {
    if (err) {
      res.status(401).json({ error: err.errors });
    } else {
      res.status(201).json(doc);
    }
  });
});

const strongRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);
function validatePassword(password) {
  if (password.length < 8) {
    return 'password must be longer than 8 characters';
  }
  if (password.length > 72) {
    return 'password must be less than 72 characters';
  }
  if (password.startsWith(' ') || password.endsWith(' ')) {
    return 'password cannot start or end with empty spaces';
  }
  if (!strongRegex.test(password)) {
    return 'password must have an upper case, a lower case, a number, and a special character';
  }
  return null;
}

module.exports = usersRouter;
