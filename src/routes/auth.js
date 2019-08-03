const jwt = require('express-jwt');
const {JWT_SECRET} = require('../config');

const getTokenFromHeader = req => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
    return req.headers. authorization.split(' ')[1];
  }
  return null;
}

const auth = {
    required: jwt({
      JWT_SECRET,
      userProperty: 'payload',
      getToken: getTokenFromHeader
    }),
    optional: jwt({
      JWT_SECRET,
      userProperty: 'payload',
      credentialsRequired: false,
      getToken: getTokenFromHeader
    })
  };

  module.exports = auth;