const router = require('express').Router();
const User = require('../model/User');
const Auth = require('../model/Auth');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken')

router.post('/register', async (req, res) => {

  const {error} = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message)

  const emailExist = await User.findOne({email: req.body.email}); 
  if (emailExist) return res.status(400).send(`User with email: ${req.body.email} already exist`)

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  try{
    const savedUser = await user.save();
    res.status(201).send({'token': savedUser})

  }catch(error){
    res.status(400).send(error)
  }
});

router.post('/login', async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({email: req.body.email}); 
  if (!user) return res.status(400).send(`Email not found`);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Password');

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn: '5m'});
  
  const userAuth = new Auth({
    userId: user._id,
    token: token,
    expired: false
  });

  try{
    await userAuth.save();
  }catch(error){
    res.status(400).send(error)
  }

  res.json({'token': token})
});

router.get('/profile', verify, async (req,res) => {
  const user = req.user
  const userInfo = await User.findOne({_id: user._id}); 
  res.json({'user': userInfo})
})

router.delete('/logout', verify, async (req,res) => {
  const userAuth = await Auth.findOne({token: req.token})

  const filter = { _id: userAuth._id };
  const update = { expired: true };
  await Auth.findOneAndUpdate(filter, update);
  
  res.send('Logged out')
})


module.exports = router;