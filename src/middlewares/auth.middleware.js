function authMiddleware( req, res, next) {
    
    if(req.session?.user) {
        console.log(req.session.user)
        return next()
    }

    return res.status(401).send("Error autenticación")
}

module.exports = authMiddleware