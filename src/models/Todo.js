const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
  job_id: { type: String, required: true },
  title: String,
  status: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now }
});

let Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
