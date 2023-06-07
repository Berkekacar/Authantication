//this middlewarecheck
//if user exixts
//router içindeki user routerıne inside
//middleware olarak gider
function auth(req,res,next){
    if(req.user?.email) return next()
    
    return res.sendStatus(401)
}
module.exports=auth