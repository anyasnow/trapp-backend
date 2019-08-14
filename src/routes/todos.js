const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const Todo = require('../models/Todo');

const todosRouter = express.Router();
const jsonBodyParser = express.json();

todosRouter.get('/:job_id', requireAuth, (req, res, next) => {
  const { job_id } = req.params;
  Todo.find({ job_id })
    .then(todos => res.send(todos))
    .catch(next);
});

todosRouter.post('/add_todo', requireAuth, jsonBodyParser, (req, res, next) => {
  const { job_id, title } = req.body;

  for (const field of ['job_id', 'title']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field} of request body`
      });
    }
  }

  // Post Todo to DB
  const newTodo = new Todo({
    job_id,
    title
  });

  newTodo.save((err, doc) => {
    if (err) {
      res.status(401).json({ error: err });
    } else {
      res.status(201).json(doc);
    }
  });
});

todosRouter.get('/get_todo/:_id', requireAuth, (req, res, next) => {
  const { _id } = req.params;

  Todo.findOne({ _id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: 'no todos at that id' });
    } else {
      res.status(200).json(doc);
    }
  });
});

todosRouter.patch(
  '/update_todo',
  requireAuth,
  jsonBodyParser,
  (req, res, next) => {
    const { _id, status } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'this todo does not exist' });
    }

    // find specific job (id), update it
    Todo.findOneAndUpdate({ _id }, { status }, (err, doc) => {
      if (err) {
        res.status(400).json({ error: 'error' });
      } else {
        res.status(204).json(doc);
      }
    });
  }
);

todosRouter.delete('/delete_todo/:_id', requireAuth, (req, res, next) => {
  const { _id } = req.params;

  Todo.findOneAndRemove({ _id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: 'error' });
    } else {
      res.status(204).json(doc);
    }
  });
});

module.exports = todosRouter;
