const express = require('express');

const jobsRouter = express.Router()

const jsonBodyParser = express.json();


jobsRouter
  .route('/')
  .get((req, res, next) => {
    req.user.id;
    
    // get all jobs by userId from DB
  })



jobsRouter
  .route('/:id')
  .get(jsonBodyParser, (req, res, next) => {

  })
  

module.exports = jobsRouter