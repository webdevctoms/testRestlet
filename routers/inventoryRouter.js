const express = require("express");
const router = express.Router();
const {checkToken} = require('../tools/configTools'); 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {GetProductData,normalizeData} = require ('../Shopify/shopifyConfig');
const {SHOPIFYCAD,SHOPIFYK,SHOPIFYP} = require('../config');
const {GetInventoryData} = require('../ns/nsConfig');

router.use(jsonParser);

router.post('/',checkToken,(req,res) => {
	//for measuring promise time
	//about 7 min with single promise
	let startTime;
	let endTime;
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
		startTime = Date.now();
		console.log('Got Products from Shopify : ',productData.length);
		const half = Math.round(productData.length / 2);
		const halfProducts1 = productData.slice(0,half);
		const halfProducts2 = productData.slice(half,productData.length);
		return Promise.all([GetInventoryData(halfProducts1),GetInventoryData(halfProducts2)])
		//return GetInventoryData(productData)
	})

	.then(inventoryData => {
		endTime = Date.now();
		inventoryData = normalizeData(inventoryData);
		console.log('==Inventory data==: ',inventoryData.length);
		let end = endTime - startTime;
		console.log('==Time elapsed==: ',end);
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