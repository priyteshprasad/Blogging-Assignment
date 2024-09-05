const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next()
    }else{
        return res.send({
            status: 401,
            message: "Bad Request",
            error: "Session expired, please login again"
        })
    }
}
module.exports = isAuth