const express = require('express');
const { createUser } = require('../controllers/user');
//const { validateUserSignUp, userVlidation } = require('../middleware/validation/user');
const router = express.Router();
const {check} = require('express-validator');
const { validateUserSignUp,userVlidation  } = require('../middlewares/Validation/user');


// when data is send from front end then we send to database.. we need async and await 
router.post('/create-user',validateUserSignUp,userVlidation,createUser);

//router.post('/create-user',check('fullname').trim().not().isEmpty(),createUser);
module.exports =router;