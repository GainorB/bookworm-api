const jwt = require('jsonwebtoken');
const User = require('../models/User');

authenticate = (req, res, next) => {
  // STORE AUTH HEADER IN VARIABLE
  const header = req.headers.authorization;
  let token;

  // IF AUTH HEADER IS PRESET, SPLIT THE HEADER TO GET THE TOKEN
  if (header) token = header.split(' ')[1];

  if (token) {
    // VERIFY TOKEN
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // SEND ERROR BACK IF TOKEN IS INVALID
        res.status(401).json({ errors: { global: 'Invalid token' } });
      } else {
        // IF VALID TOKEN
        // DECODED WILL CONTAIN AN EMAIL WE CAN USE TO FIND USERS
        User.findOne({ email: decoded.email }).then(user => {
          // ONCE USER IS FOUND, WE ADD THE CURRENT USER
          // TO THE REQUEST OBJECT SO ITS AVAILABLE IN EVERY AUTHENTICATED ROUTE
          req.currentUser = user;
          // CALL THE NEXT FUNCTION USING NEXT()
          next();
        });
      }
    });
  } else {
    // IF NO TOKEN
    res.status(401).json({ errors: { global: 'No token' } });
  }
};

module.exports = authenticate;
