const express=require("express")
const controller=require("../../controller/authController")
const usermiddle=require('../../middleware/user')

const router=express.Router()

router.post("/register",controller.register)

router.post("/login",controller.login)

router.post('/verify',controller.verifyx)

router.post("/logout",controller.logout)

router.post("/refresh",controller.refresh)

router.get("/user",usermiddle,controller.user)

module.exports=router