const express = require("express");
const router = express.Router();
const {CONSUMER_KEY,CONSUMER_SECRET,APPLICATION_ID,ACCOUNT_ID,ACCESS_TOKEN,TOKEN_SECRET,NONCE,SIG,URL} = require('../config');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {nsRequest} = require('../ns/nsConfig');
const {checkKey} = require('../tools/configTools');

//router.use(jsonParser);

router.post('/',(req,res)=>{
	console.log('post received');
	const authInfo = {
		consumer_key:CONSUMER_KEY,
		consumer_secret:CONSUMER_SECRET,
		access_token:ACCESS_TOKEN,
		token_secret:TOKEN_SECRET,
		realm:ACCOUNT_ID
	};
	console.log('order id',req.order.email);
	//console.log(req.body);
	return nsRequest(authInfo,URL,'get-record-post','post')

	.then(data => {
		return res.json({
			status:200,
			data
		})
	})

	.catch(err => {
		return res.json({
			status:500,
			err
		})
	})
});

module.exports = {router};