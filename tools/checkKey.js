const {CKEY,DOMAIN} = require('../config');
const crypto = require('crypto');
const getRawBody = require('raw-body');

let checkKey = async function(req, res, next){

	let sKey = req.get('X-Shopify-Hmac-SHA256');
	let domain = req.get('X-Shopify-Shop-Domain');
	const body = await getRawBody(req)
	let digest = crypto.createHmac('SHA256', CKEY).update(body).digest('base64');
	if(domain !== DOMAIN){
		return res.status(422).json({
			code:422,
			message:"unathorized"
		});
	}
	else if(sKey === digest){
		const order = JSON.parse(body.toString())
		req.order = order
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