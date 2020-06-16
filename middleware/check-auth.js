const jwt = require('jsonwebtoken');
// const { token } = require('morgan');

module.exports = (req, res, next)=>{
    try{
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
        next();


    }catch(err){
        return res.status(500).json({
            message : "Auth false"
        })

    }
    

}