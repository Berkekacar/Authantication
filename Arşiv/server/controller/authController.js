const User=require("../models/user")
const mysql=require("mysql")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { findOne } = require("../models/user")
const nodemailer =require("nodemailer")



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});
async function verifyx(req,res){
  const {code}=req.body
  const cookie=req.cookies.factor
  if(code === cookie){
    console.log(code)
    console.log(cookie)
    res.sendStatus(200)
  }else{
    res.sendStatus(404)
  }
  
}
async function register(req, res) {
  const { username, email, first_name, last_name, password, password_confirm } = req.body;

  if (!username || !email || !password || !password_confirm || !first_name || !last_name) {
    return res.status(422).json({ 'message': 'Invalid fields' });
  }

  if (password !== password_confirm) {
    return res.status(422).json({ 'message': 'Passwords do not match' });
  }

  try {
    const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(userExistsQuery, [email], async (error, results) => {
      if (error) {
        console.error('MySQL query error: ', error);
        throw error;
      }
      if (results.length > 0) {
        return res.sendStatus(409);
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const createUserQuery = 'INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
      connection.query(createUserQuery, [email, username, hashedPassword, first_name, last_name], (err) => {
        if (err) {
          console.error('MySQL query error: ', err);
          throw err;
        }

        return res.sendStatus(201);
      });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Could not register' });
  }
}

async function login(req,res){
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ 'message': 'Invalid fields' });
  }

  try {
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(userQuery, [email], async (error, results) => {
      if (error) {
        console.error('MySQL query error: ', error);
        throw error;
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Email or password is incorrect' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: 'Email or password is incorrect' });
      }
      //nodemailer
      const transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
          user:'kacarberkee@gmail.com',
          pass:"tffmrukljpzflefg"
        }
      })
      const kaganmail=user.email
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const numberStr=randomNumber.toString()
      res.cookie('factor', numberStr, { maxAge: 86400000, httpOnly: true });
      const mailOption={
        from:"kacarberkee@gmail.com",
        to:kaganmail,
        subject:"Verification code",
        text:numberStr
      }
      transporter.sendMail(mailOption,(err,data)=>{
          if(err){
            console.log('error')
          }
          console.log('mail attım')
      })
      //nodemailer

      const accessToken = jwt.sign(
        {
          email: user.email
        },
        process.env.ACCES_TOKEN_SECRET,
        {
          expiresIn: '1800s'
        }
      );

      const refreshToken = jwt.sign(
        {
          email: user.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d'
        }
      );

      const updateUserQuery = 'UPDATE users SET refresh_token = ? WHERE email = ?';
      connection.query(updateUserQuery, [refreshToken, user.email], (err) => {
        if (err) {
          console.error('MySQL query error: ', err);
          throw err;
        }

        res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ access_token: accessToken });
      });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Could not login' });
  }
}

// async function verify(req,res){
//   const cookie=req.cookies['2factor']
//   const {code}=req.body
//   if(code==cookie){
//       console.log(code)
//       console.log(cookie)
//     console.log('başarılı giriş')
//     res.sendStatus(200)
//   }else{
//     res.sendStatus(400)
//   }
//   res.json(cookie)
// }

async function logout(req,res){
  const cookies = req.cookies;
  

  if (!cookies.refresh_token) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.refresh_token;

  try {
    const userQuery = 'SELECT * FROM users WHERE refresh_token = ?';
    connection.query(userQuery, [refreshToken], async (error, results) => {
      if (error) {
        console.error('MySQL query error: ', error);
        throw error;
      }

      if (results.length === 0) {
        res.clearCookie('refresh_token', { httpOnly: true });
        return res.sendStatus(204);
      }

      const user = results[0];
      const updateUserQuery = 'UPDATE users SET refresh_token = NULL WHERE email = ?';
      connection.query(updateUserQuery, [user.email], (err) => {
        if (err) {
          console.error('MySQL query error: ', err);
          throw err;
        }

        res.clearCookie('refresh_token', { httpOnly: true });
        res.sendStatus(204);
      });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Could not logout' });
  }
}

async function refresh(req,res){
  const cookies = req.cookies;
  if (!cookies.refresh_token) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.refresh_token;
  try {
    const userQuery = 'SELECT * FROM users WHERE refresh_token = ?';
    connection.query(userQuery, [refreshToken], async (error, results) => {
      if (error) {
        console.error('MySQL query error: ', error);
        throw error;
      }
      if (results.length === 0) {
        return res.sendStatus(403);
      }
      const user = results[0];
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.email !== decoded.email) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.ACCES_TOKEN_SECRET,
          { expiresIn: '1800s' }
        );

        res.json({ access_token: accessToken });
      });
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function user(req,res){
    const user=req.user
    return res.status(200).json(user)
}

module.exports={
    register,
    login,
    logout,
    refresh,
    user,
    verifyx
}

