const jwt = require('jsonwebtoken');
const User = require('../models/user');


// we are creating private route
/* intially write like this:
exports.isAuth = (req, res, next) => {
    console.log(req.headers.authorization);
  };
  */
 /* then like this:
  exports.isAuth = (req, res, next) => {

    if (req.headers && req.headers.authorization) {
    }
    else{
        res.json({ success: false, message: 'unauthorized access!' });
    }

  };*/


  exports.isAuth = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
          // split ('').[1] is to get value JWT token that was created.. we had used POSTMan and we could see in our terminal
      const token = req.headers.authorization.split(' ')[1];
  
      try {
           // we have UserId inside decode and we can use UserId to grab user from db

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId);
        if (!user) {
          return res.json({ success: false, message: 'unauthorized access!' });
        }
  
        req.user = user;
        next();
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return res.json({ success: false, message: 'unauthorized access!' });
        }
        if (error.name === 'TokenExpiredError') {
          return res.json({
            success: false,
            message: 'sesson expired try sign in!',
          });
        }
  
        res.json({ success: false, message: 'Internal server error!' });
      }
    } else {
      res.json({ success: false, message: 'unauthorized access!' });
    }
  };
  