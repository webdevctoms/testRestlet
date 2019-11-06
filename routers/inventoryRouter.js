const express = require("express");
const router = express.Router();
const {checkToken} = require('../tools/configTools'); 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {GetProductData} = require ('../Shopify/shopifyConfig');
const {SHOPIFYCAD,SHOPIFYK,SHOPIFYP} = require('../config');
const {GetInventoryData} = require('../ns/nsConfig');

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
		console.log('Got Products from Shopify : ',productData.length);
		return GetInventoryData(productData)
	})

	.then(inventoryData => {
		console.log('Inventory data : ',inventoryData.length);
		return res.send({
			status:200,
			data:inventoryData
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