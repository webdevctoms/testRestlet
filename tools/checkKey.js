const {CKEY,DOMAIN,CKEYU,DOMAINU} = require('../config');
const crypto = require('crypto');
const getRawBody = require('raw-body');

let checkKey = async function(req, res, next){

	let sKey = req.get('X-Shopify-Hmac-SHA256');
	let domain = req.get('X-Shopify-Shop-Domain');
	const body = await getRawBody(req)
	let digest = crypto.createHmac('SHA256', CKEY).update(body).digest('base64');
	let digestU = crypto.createHmac('SHA256', CKEYU).update(body).digest('base64');
	if(domain !== DOMAIN && domain !== DOMAINU){
		return res.status(422).json({
			code:422,
			message:"unathorized"
		});
	}
	else if(sKey === digest || sKey === digestU){
		const order = JSON.parse(body.toString());
		req.order = order;
		console.log('verified');
		next();
	}
	else{
		return res.status(422).json({
			code:422,
			message:"unathorized"
		});
	}
	
}

module.exports = {checkKey};