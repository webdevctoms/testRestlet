const request = require('request');

function reqInventory(token){
    let promise = new Promise((resolve,reject) => {
        let newUrl = 'http://localhost:8000/inventory'
        let options = {
            url:newUrl,
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            json:{
                token
            }
        };
        console.log(options);
        request(options,function(error,response,body){
            resolve(body);
        });
    });

    return promise;
}

module.exports = {reqInventory};