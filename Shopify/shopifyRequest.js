const request = require('request');

function ShopifyRequest(options){
    const requestMethod = options.requestMethod ? options.requestMethod.toUpperCase() : 'GET';
    if(requestMethod === 'PUT'){
        return putData(options,0)
    }
}

function findValue(target,str){

    for(let key in target){
        if(key.includes(str)){
            return target[key];
        }
    }

    return false;
}

function findData(data,fields){
    let fieldData = {};
    for(let i = 0;i < fields.length;i++){
        fieldData[fields[i]] = data[fields[i]];
    }

    return fieldData;
}

function putData(options,index){
    let promise = new Promise((resolve,reject) => {
        const authKey = Buffer.from(options.key + ':' + options.pass).toString('base64');
        const data = options.data;
        const target = data[index];
        const type = options.type;
        const endpoint = options.endpoint;
        const dataId = findValue(target,'id');
        const url = options.url.endsWith('/') ? options.url + endpoint + '/' + dataId + '.json' : options.url + '/' + endpoint + '/' + dataId + '.json';
        console.log(url);
        let jsonData = {};
        jsonData[type] = findData(target,options.fields);
        console.log('JSON DATA: ',jsonData);
        const reqOptions = {
            url,
            method:options.requestMethod,
            headers:{
                'Authorization':'Basic ' + authKey
            },
            json:jsonData
        };
        console.log(reqOptions);
        request(reqOptions,function(error,response,body){
            if(body.errors){
                reject(body.errors);
                return;
            }
            console.log('=================put data')
            if(index < data.length - 1){
                resolve(putData(options,index + 1));
            }
            else{
                console.log('finished put requests');
                resolve('finished adding data');
            }
        })
    });

    return promise;
}

module.exports = {ShopifyRequest};