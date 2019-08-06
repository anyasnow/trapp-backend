const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config')

const requireAuth = (req, res, next) => {
    const authToken = req.get('Authorization') || ''
    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(400).json({ error: 'missing Bearer Token' })
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try {
      const payload = verifyJWT(bearerToken);
      const _id = payload.id
      User.findOne({ _id })
        .then(user => {
          if (!user) {
            return res.status(401).json({ error: 'unauthorized request' })
          }
          // attach the user to the request
          req.user = user
          next()
        })
        .catch(error => {
          console.error(error)
            next(error)
        })
    }

    catch (error) {
      console.log(error);
      res.status(401).json({ error: 'unauthorized request' })
    }
}

const verifyJWT = (token) => {
  return jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] })
}

module.exports = requireAuth