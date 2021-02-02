const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => { // Used on routes where user should be logged in. So we check tokens
  try{
    const token = req.header('Authorization').replace("Bearer ", "") // token from request
    const decoded = jwt.verify(token, 'thisismyauthentication')// returns {_id:<string>, iat:<integers>} where _id was created as path of generate Auth Token instance method
    const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})
    // find user with the correct id with this token stored in token array 

    if(!user){
      throw new Error()
    }
    req.token = token  
    req.user = user // No need for route handler to fetch user again so we add property to request
    next() // allows route handler to be used if all goes well
  }catch(e){
    res.status(404).send({error: 'Please authenticate'})
  }
}

module.exports = auth;