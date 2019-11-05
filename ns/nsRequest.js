const request = require("request");

function nsRequest(authInfo,url,scriptType,requestMethod,bodyData){
	if(scriptType === undefined){
		scriptType = 'test';
	}
	//send test data
	if(bodyData === undefined){
		bodyData = { 
			"recordtype": "salesorder",
			"id": "254174"
		};
		scriptType = 'get-record-post';
		requestMethod = 'post';
	}
	scriptType = scriptType.toLowerCase();

	let scriptMap = {
		'test':'112',
		'get-record-post':'113',
		'create-so':'114'
	};
	if(requestMethod.toLowerCase() === 'get'){
		return getRequest(authInfo,url,scriptMap[scriptType])
	}
	else if(requestMethod.toLowerCase() === 'post'){
		return postRequest(authInfo,url,scriptMap[scriptType],bodyData)
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

//can use this function for most post requests
function postRequest(authInfo,url,scriptNum,bodyData){
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
				json:bodyData
			};

			console.log('POST to NS');
			request(options,function(error,response,body){
				try{
					//let parsedBody = JSON.parse(body)
					console.log(body,error);
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