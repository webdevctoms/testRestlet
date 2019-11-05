const jwt = require('jsonwebtoken');
const {CK} = require('../config');

const checkToken = function(req, res, next){
    const {token} = req.body;
    try{
        
        const decoded = jwt.verify(token, CK);
        if(decoded){
            next();
        }
        else{
            return res.status(422).json({
                code:422,
                message:"unathorized"
            });
        }
    }
    catch(err){
        return res.status(422).json({
            code:422,
            message:"unathorized"
        });
    }
}

module.exports = {checkToken};