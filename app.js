
const express = require('express');
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user');

const User = require('./models/user');

const app = express();

/*to capture incoming data from front end we use app.use... if put like the below then the middle ware funtion after that will affect only it...
 it the middle function is to affect entire program..then don't put it
app.use('/path')*/

// req is what we get from front end and res is what we send back to front end

// app.use((req,res,next)=>{
//     req.on('data',chunk =>{
//       const data=  console.log(JSON.parse(chunk));
//       req.body=data;
//     });
//     next();

// })
app.use(express.json());
app.use(userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);
  console.log(result);
};

test('roy@gmail.com', 'Password989');

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to backend zone!' });
});

app.listen(8000, () => {
  console.log('port is listening');
});
