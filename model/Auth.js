const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expired:{
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Auth', authSchema);