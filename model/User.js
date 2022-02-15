const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// const authSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   expired:{
//     type: String,
//     required: true
//   }
// })

module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('Auth', authSchema);