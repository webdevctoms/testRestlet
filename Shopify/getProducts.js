const request = require('request');

function GetProductData(options){
    return getProducts(options)
}

function buildFieldString(fields){
    let fieldStr = 'fields=';

    for(let i = 0;i < fields.length;i++){
        fieldStr += fields[i] + ',';
    }
    fieldStr = fieldStr.slice(0,-1);
    return fieldStr;
}

function getParsedData(parsedBody){
    const dataTypes =['products','metafields','collects'];

    for(let i = 0;i < dataTypes.length;i++){
        let type = dataTypes[i];
        if(parsedBody[type]){
            return type;
        }
    }

    return false;
}

function getProducts(requestOptions,page,dataArray){
    if(dataArray === undefined){
		dataArray = [];
    }
    let promise = new Promise((resolve,reject) => {
        try{
            if(!requestOptions.endpoint){
                reject('endpoint required');
            }
            let limit;
            if(!requestOptions.limit){
                limit = 250;
            }
            else{
                limit = requestOptions.limit;
            }
            let newUrl = requestOptions.url + requestOptions.endpoint + '.json?' + 'limit=' + limit;
            if(page){
                newUrl += "&page=" + page;
            }
            if(requestOptions.fields){
                let fields = buildFieldString(requestOptions.fields);
                newUrl += fields;
            }
            
            const authKey = Buffer.from(requestOptions.key + ':' + requestOptions.pass).toString('base64');
            console.log(newUrl);
            let options = {
                url:newUrl,
                headers:{
                    'Authorization':'Basic ' + authKey
                }
            };

            request(options,function(error,response,body){
                if(error){
                    console.log('error: ',error);
                    reject(error);
                }
                else{
                    const parsedBody = JSON.parse(body);
                    const type = getParsedData(parsedBody);
                    dataArray.push(parsedBody[type]);
                    resolve(dataArray);
                }
                
            });
        }
        catch(err){
            reject(err);
        } 
    });

    return promise;
}

module.exports = {GetProductData};