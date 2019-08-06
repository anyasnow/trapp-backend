const express = require('express');
const requireAuth = require('../middleware/requireAuth')
const Job = require('../models/Job');

const jobsRouter = express.Router();
const jsonBodyParser = express.json();

jobsRouter.get('/', requireAuth, (req, res, next) => {
  const user_id = req.user.id;
  Job.find({ user_id })
    .then(jobs => res.send(jobs))
    .catch(next);
});

jobsRouter.post('/newjob', requireAuth, jsonBodyParser, (req, res, next) => {
  const { companyName, position, category } = req.body;
  for (const field of ['companyName', 'position', 'category', 'user_id']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field} of request body`
      });
    }
  }

  // Post Job to DB
  const newJob = new Job({ 
    companyName, 
    position, 
    category, 
    // grab user id from the request from requireAuth middleware
    user_id: req.user.id 
  });

  newJob.save((err, doc) => {
    if (err) {
      res.status(401).json({ error: 'error' });
    } else {
      res.status(201).json(doc);
    }
  });
});

jobsRouter.patch('/editjob', jsonBodyParser, (req, res, next) => {
  const edits = req.body;

  if (!edits._id) {
    return res.status(400).json({ error: 'this job does not exist' });
  }

  // find specific job (id), update it
  Job.findOneAndUpdate({ _id: edits._id }, { ...edits }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: 'error' });
    } else {
      res.status(204).json(doc);
    }
  });
});

jobsRouter.delete('/:_id', requireAuth, (req, res, next) => {
  const { _id } = req.params;

  Job.findOneAndRemove({ _id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: 'error' });
    } else {
      res.status(204).json(doc);
    }
  });
});

module.exports = jobsRouter;