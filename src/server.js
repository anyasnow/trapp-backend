const app = require('./app');
const { PORT, PROD_URL } = require('./config');
const mongoose = require('mongoose');

mongoose.connect(PROD_URL, { useNewUrlParser: true })

let db = mongoose.connection;

db.once('open', () => {
  console.log('connected to MongoDB')
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}...`);
});