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
		const third = Math.round(productData.length / 3);
		const twoThird = third * 2;
		const third1 = productData.slice(0,third);
		const third2 = productData.slice(third,twoThird);
		const third3 = productData.slice(twoThird,productData.length);
		return Promise.all([GetInventoryData(third1),GetInventoryData(third2),GetInventoryData(third3)])
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