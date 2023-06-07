const allowedOrigins=require("./allowed_origins")

const corsOptions={

    origin:(origin,callback)=>{
        if (allowedOrigins.includes(origin)|| !origin) {
            callback(null,true)
        } else {
            callback(new Error("Not allowed by cors police"))
        }
    }
}

module.exports=corsOptions