const request = require("request");
const oauthsignature = require('oauth-signature');
const {convertData} = require ('../Shopify/shopifyConfig');

function nsRequest(authInfo,url,scriptType,requestMethod){
	if(scriptType === undefined){
		scriptType = 'test';
	}
	scriptType = scriptType.toLowerCase();

	let scriptMap = {
		'test':'112',
		'get-record-post':'113'
	};
	if(requestMethod.toLowerCase() === 'get'){
		return getRequest(authInfo,url,scriptMap[scriptType])
	}
	else if(requestMethod.toLowerCase() === 'post'){
		return postRequest(authInfo,url,scriptMap[scriptType])
	}
}

//add functions for other types of requests
function getRequest(authInfo,url,scriptNum){
	let promise = new Promise((resolve,reject) => {
		
		let options = {
			url,
			method:'GET',
			oauth:{
				consumer_key:authInfo.consumer_key,
				consumer_secret:authInfo.consumer_secret,
				token:authInfo.access_token,
				token_secret:authInfo.token_secret,
				realm:authInfo.realm
			},
			qs:{
				script:scriptNum,
				deploy:'1'
			}
		};

		console.log('GET');
		request(options,function(error,response,body){
			console.log(body,error)
			resolve(body);
		});
	});

	return promise;
}

function postSO(authInfo,url,scriptNum){
	let promise = new Promise((resolve,reject) => {
		try{
			let options = {
			url,
			method:'POST',
			oauth:{
				consumer_key:authInfo.consumer_key,
				consumer_secret:authInfo.consumer_secret,
				token:authInfo.access_token,
				token_secret:authInfo.token_secret,
				realm:authInfo.realm
			},
			qs:{
				script:scriptNum,
				deploy:'1'
			},
			json:{ 
				recordtype: 'salesorder',
				id: '254174'
			}
			};

			console.log('POST');
			request(options,function(error,response,body){
				try{
					let parsedBody = JSON.parse(body)
					console.log(parsedBody.type,error);
					resolve(body);
				}
				catch(err){
					console.log('error after creating SO');
					reject(err);
				}
				
			});
		}
		catch(err){
			console.log('error before SO request');
			reject(err);
		}
		
	});

	return promise;
}

function postRequest(authInfo,url,scriptNum){
	let promise = new Promise((resolve,reject) => {
		try{
			convertData();
			let options = {
				url,
				method:'POST',
				oauth:{
					consumer_key:authInfo.consumer_key,
					consumer_secret:authInfo.consumer_secret,
					token:authInfo.access_token,
					token_secret:authInfo.token_secret,
					realm:authInfo.realm
				},
				qs:{
					script:scriptNum,
					deploy:'1'
				},
				json:{ 
					recordtype: 'salesorder',
					id: '254174'
				}
			};

			console.log('POST');
			request(options,function(error,response,body){
				try{
					let parsedBody = JSON.parse(body)
					console.log(parsedBody.type,error);
					resolve(body);
				}
				catch(err){
					reject(err);
				}
				
			});
		}

		catch (err){
			reject(err);
		}
	});


	return promise;
}

module.exports = {nsRequest};