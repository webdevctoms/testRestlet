function sanitizeObject(objectData,keyArray,replaceRegex){
    for(let i = 0;i < keyArray.length;i++){
        let cleanString = objectData[keyArray[i]].replace(replaceRegex,'');
        objectData[keyArray[i]] = cleanString;
        console.log(cleanString);
    }
}

let sanitizeInput = function(data,keys) {
    const replaceRegex = /[\=\<\>\\\/\[\]\{\}]/gi;
    for(let key in keys){
        if(!keys[key].type){
            data[key] = data[key].replace(replaceRegex,'');
        }
        else if(keys[key].type === 'object'){
            sanitizeObject(data[key],keys[key].keysArray,replaceRegex);
        }
        else if(keys[key].type === 'array'){
            
        }
    }
};

module.exports = {sanitizeInput};