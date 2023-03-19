const User =require('../models/user');
const jwt = require('jsonwebtoken');
exports.createUser =async (req,res)=>{
    const {fullname, email,password}=req.body;
    const isNewUser= await User.isThisEmailInUse(email);
    if(!isNewUser) return res.json({success:false, message:'Emal already exist. Use diff email'})
    const user= await User({
        fullname,
        email,
        password
    })
    await user.save();
    res.json(user);
}
/*
exports.userSignIn = async (req, res) => {
res.send('sign in');
}
*/

exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user)
      return res.json({
        success: false,
        message: 'user not found, with the given email!',
      });
  
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.json({
        success: false,
        message: 'email / password does not match!',
      });
  
      // json token used to ensure that these things happen only after signedin


     // jwt.sign({userId: user._id},'secret'); but secret is saved in .env and we call it with process ..
     // in that we say the toek expires in 1day
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
//and then we send this token to user by modifying this:res.json({ success: true, user});
    res.json({ success: true, user,token});
  };
  