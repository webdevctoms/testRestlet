const {CONSUMER_KEY,CONSUMER_SECRET,ACCOUNT_ID,ACCESS_TOKEN,TOKEN_SECRET,URL} = require('../config');
const {nsRequest} = require('./nsRequest');
//convert data to data for shopify request
function buildVariantData(variantData){
    return [];
}
//make request based off variant sku/item code
function getVariantQuantity(variants,variantIndex,variantData){
    if(!variantIndex){
        variantIndex = 0;
    }
    if(!variantData){
        variantData = [];
    }
    let promise = new Promise((resolve,reject) => {
        if(variantIndex < variants.length){
            const authInfo = {
                consumer_key:CONSUMER_KEY,
                consumer_secret:CONSUMER_SECRET,
                access_token:ACCESS_TOKEN,
                token_secret:TOKEN_SECRET,
                realm:ACCOUNT_ID
            };
            let currentVariant = variants[variantIndex];
            //if no sku push variant with 0
            if(!currentVariant.sku){
                variantData.push({
                    variant_id: currentVariant.id,
                    inventory_quantity:0   
                });
                console.log('no sku');
                resolve(getVariantQuantity(variants,variantIndex + 1,variantData));
            }
            else{
                let reqData = {
                    item:currentVariant.sku
                };
                console.log('getting data for: ',currentVariant.sku);
                return nsRequest(authInfo,URL,'get-quantity','post',reqData)
        
                .then(quantity => {
                    console.log('variant quantity: ',quantity);
                    if(!quantity){
                        quantity = 0;
                    }
    
                    variantData.push({
                        variant_id: currentVariant.id,
                        inventory_quantity:quantity   
                    });
            
                    resolve(getVariantQuantity(variants,variantIndex + 1,variantData));
                })
        
                .catch(err => {
                    console.log('error getting variant quantity: ',err);
                    reject(err);
                });
            }
        }
        else{
            resolve(variantData);
        }
        
    });

    return promise;
}

function GetInventoryData(productData,productIndex,data){
    if(!productIndex){
        productIndex = 0;
    }
    if(!data){
        data = [];
    }

    let promise = new Promise((resolve,reject) => {
        if(productIndex < productData.length){
            let currentProduct = productData[productIndex];
            let product = {};
            product.id = currentProduct.id;
            console.log('=================get data for: ',currentProduct.title,productIndex);
            return getVariantQuantity(currentProduct.variants)

            .then(variantData => {
                const variants = buildVariantData(variantData);
                console.log('variant data: ',variantData);
                product.variants = variants;
                data.push(product);
                resolve(GetInventoryData(productData,productIndex + 1,data));

            })

            .catch(err => {
                reject(err);
            });
        }
        else{
            resolve(data);
        }

    });

    return promise;
}

module.exports = {GetInventoryData};