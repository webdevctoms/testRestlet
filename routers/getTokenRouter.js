const express = require("express");
const router = express.Router();
const {checkRequest} = require('../tools/configTools'); 

router.get('/',checkRequest,(req,res) => {
    res.send({
		status:200,
		message:"Get Token"
	});
});

module.exports = {router};