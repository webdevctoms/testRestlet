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
//convert seperate array data into a single array
function normalizeData(arr){
    let normalizedArr = [];

    for(let i = 0;i < arr.length;i++){
        for(let k = 0;k < arr[i].length;k++){
            normalizedArr.push(arr[i][k]);
        }
    }

    return normalizedArr;
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
            if(!page){
                page = 1;
            }
            newUrl += "&page=" + page;
            if(requestOptions.fields){
                let fields = buildFieldString(requestOptions.fields);
                newUrl += fields;
            }
            
            const authKey = Buffer.from(requestOptions.key + ':' + requestOptions.pass).toString('base64');
            console.log('Getting products: ',newUrl);
            let options = {
                url:newUrl,
                headers:{
                    'Authorization':'Basic ' + authKey
                }
            };

            request(options,function(error,response,body){
                try{
                    if(error){
                        console.log('error: ',error);
                        reject(error);
                    }
                    else{
                        const parsedBody = JSON.parse(body);
                        const type = getParsedData(parsedBody);
                        if(parsedBody[type].length !== 0){
                            dataArray.push(parsedBody[type]);
                            resolve(getProducts(requestOptions,page + 1,dataArray))
                        }
                        else{
                            dataArray = normalizeData(dataArray);
                            resolve(dataArray);
                        }
                        
                    }
                }
                catch(err){
                    reject(error);
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