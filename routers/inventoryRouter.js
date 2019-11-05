const express = require("express");
const router = express.Router();
const {checkToken} = require('../tools/configTools'); 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {GetProductData} = require ('../Shopify/shopifyConfig');
const {SHOPIFYCAD,SHOPIFYK,SHOPIFYP} = require('../config');

router.use(jsonParser);

router.post('/',checkToken,(req,res) => {

	const options = {
		url:SHOPIFYCAD,
		key:SHOPIFYK,
		pass:SHOPIFYP,
		fields:[
			'variants',
			'id'
		],
		endpoint:'products'
	};

	return GetProductData(options)

	.then(productData => {
		console.log('Got Products from Shopify : ',productData[0].length);
		return res.send({
			status:200,
			data:productData
		});
	})

	.catch(err => {
		console.log('error getting inventory data: ',err);
		return res.send({
			status:500,
			message:'internal server error'
		});
	});
});

module.exports = {router};