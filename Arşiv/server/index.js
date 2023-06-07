require("dotenv").config()

const mysql=require("mysql")
const bcrypt=require('bcrypt')
const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const mongoose=require("mongoose")
const path=require("path")
const corsOptions=require("./config/cors")
const connectDB=require("./config/database")
const credentials=require("./middleware/credentials")
const errorHandler=require("./middleware/error_handler")
const { db } = require("./models/user")
const userM=require('./middleware/authentication')

const app=express()
const port=8005



// connectDB()

app.use(credentials)



app.use(cors(corsOptions))

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use(cookieParser())

app.use(userM)

app.use("/static",express.static(path.join(__dirname,"static")))

app.use(errorHandler)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});
connection.connect((err) => {
  if (err) {
      console.log(err);
  } else {
      console.log("MYSQL CONNECTED")
  }
})

//routes

app.use("/api/auth",require("./routes/api/auth"))


app.all("*",(req,res)=>{
    res.sendStatus(404)
})
app.listen(8086,()=>{
  console.log('server id listening')
})







