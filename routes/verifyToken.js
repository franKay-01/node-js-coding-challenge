const jwt = require('jsonwebtoken');
const Auth = require('../model/Auth');

module.exports = async function (req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  // const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try{
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    req.token = token

    const authInfo = await Auth.findOne({token: token})
    if (authInfo.expired) return res.status(401).send('Token Expired');

    next();
  }catch(error){
    res.status(400).send('Invalid Token')
  }
}