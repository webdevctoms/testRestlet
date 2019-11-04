const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {CK} = require('../config');
const {checkRequest} = require('../tools/configTools'); 

router.get('/',checkRequest,(req,res) => {
	try{
		const token = jwt.sign({
			data:'token'
		},CK,{expiresIn:'10m'});
		res.send({
			status:200,
			token
		});
	}
	catch(err){
		res.send({
			status:500,
			err
		})
	}
	
});

module.exports = {router};