const {CK} = require('../config');

const checkRequest = function(req, res, next){
    const ck = req.get('Authorization');
    if(ck === CK){
        next();
    }
    else{
        res.send({
            code:422,
			message:"unathorized"    
        })
    }
}

module.exports = {checkRequest};