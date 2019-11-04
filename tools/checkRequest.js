const {CK} = require('../config');

const checkRequest = function(req, res, next){
    const ck = req.get('Authorization');
    console.log(req.get('origin'));
    console.log(ck);
    next();
}

module.exports = {checkRequest};