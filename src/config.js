module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PROD_URL: 'mongodb://localhost/trapp',
  JWT_SECRET: process.env.JWT_SECRET || 'this-is-a-secret'
};