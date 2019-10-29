const validator = require('validator');

function sanitizeObject(objectData,keyArray,replaceRegex){
    //console.log(objectData);
    for(let i = 0;i < keyArray.length;i++){
        //console.log(keyArray[i]);
        if(objectData[keyArray[i]]  && typeof objectData[keyArray[i]] === 'string'){
            let cleanString = objectData[keyArray[i]].replace(replaceRegex,'');
            objectData[keyArray[i]] = cleanString;
            console.log(cleanString);
        }
    }
}

let sanitizeInput = function(data,keys) {
    const replaceRegex = /[\=\<\>\\\/\[\]\{\}]/gi;
    for(let key in keys){
        if(!keys[key].type){
            data[key] = data[key].replace(replaceRegex,'');
        }
        else if(keys[key].type === 'object'){
            //console.log(key);
            sanitizeObject(data[key],keys[key].keysArray,replaceRegex);
        }
        else if(keys[key].type === 'email'){
            if(!validator.isEmail(keys[key].value)){
                return false;
            }
        }
    }

    return true;
};

module.exports = {sanitizeInput};