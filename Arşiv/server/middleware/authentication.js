const jwt = require('jsonwebtoken')
const User = require('../models/user')
const mysql=require("mysql")

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

function authentication(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if(authHeader?.startsWith('Bearer')) {

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, async (err, decoded) => {
      if(err){
        req.user = {}
        return next()
      }

      //const user = await User.findById(decoded.id).select({ password: 0, refresh_token: 0 }).exec()
      const userId = decoded.email;

      const query = `SELECT * FROM users WHERE email = ?`;
      connection.query(query, [userId], (error, results) => {
        if (error) {
          console.error('MySQL query error: ', error);
          throw error;
        }

        if (results.length === 0) {
          return res.sendStatus(404);
        }

        const user = results[0];
        if(user){
          req.user = user
        }else{
          req.user = {}
        }
  
        return next()
        
        // İşlemleri burada devam ettirin
      })

      

    })

  }else{
    req.user = {}
    console.log('burdayım')
    return next()
  }
}

module.exports = authentication