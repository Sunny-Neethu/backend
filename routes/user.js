const express = require('express');
const { createUser,userSignIn } = require('../controllers/user');
//const { validateUserSignUp, userVlidation } = require('../middleware/validation/user');
const router = express.Router();
const {check} = require('express-validator');
const { validateUserSignUp,userVlidation ,validateUserSignIn } = require('../middlewares/Validation/user');
const { isAuth } = require('../middlewares/auth');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();



const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };

const uploads = multer({ storage, fileFilter });
const User = require('../models/user');
// when data is send from front end then we send to database.. we need async and await 
router.post('/create-user',validateUserSignUp,userVlidation,createUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
//router.post('/create-post',(req,res)=>{}); this is modified to as follows:
router.post('/create-post',isAuth,(req,res)=>{
    res.send('Welcome- you are in secret route')
});

// to upload image in db we need a middleware multer and to timize it we need sharp
router.post('/upload-profile',isAuth,uploads.single('profile'), async (req,res) =>{
const{user} = req
if(!user) return res.status(401).json({success:false, message:'unauthorized access'}) 

try{
    const profileBuffer = req.file.buffer
    const {width,height}=await sharp(profileBuffer).metadata();
    // we are resizing here.. we can write like this or remove the usage of another variable and just use avatar directly
   // const finalProfileImage = await sharp(profileBuffer).resize(Math.round(width*0.5),Math.round(height*0.5)).toBuffer()
    //User.findByIdAndUpdate(user._id),{avatar:finalProfileImage}
    const avatar = await sharp(profileBuffer).resize(Math.round(width*0.5),Math.round(height*0.5)).toBuffer();
   // console.log(avatar);
   await User.findByIdAndUpdate(user._id,{avatar})
   res.status(201).json({success:true, message: 'Your profile is updated'})

}
catch(error){
    res.status(500).json({success:true, message: 'server error, try after sometime'})
    console.log('Error while uploading profile image', error.message)

}
    
    }

  );
  
//router.post('/create-user',check('fullname').trim().not().isEmpty(),createUser);
module.exports =router;