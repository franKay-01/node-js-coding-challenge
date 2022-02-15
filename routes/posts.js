const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
  res.json({
    posts:{
      title: "Hello",
      id: req.user,
      post: "Hello there, testing"
    }
  })
});

module.exports = router;