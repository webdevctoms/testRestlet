function buildError(reason,index,title){
    return {
        reason,
        index,
        title
    };
}
//compare ids of variant array
//it will return after first not found variant
function compareVariants(shopifyVariants,constructedVariants){
    let variantId = 'id';
    //console.log('shopify variants: ',shopifyVariants);
    //console.log('constructed variants: ',constructedVariants);
    for(let i = 0;i < shopifyVariants.length;i++){
        let currentVariant = shopifyVariants[i];
        let variantIndex = findIndex(constructedVariants,currentVariant.id,variantId);
        if(!variantIndex && variantIndex !== 0){
            return 'Missing Variant ' + currentVariant.sku;
        }
    }

    return false;
}
//return false if everything matches
//return reason for error if doesn't match
function compareProducts(shopifyProduct,constructedProduct){
    console.log('variant lengths: ',shopifyProduct.variants.length, constructedProduct.variants.length);
    if(shopifyProduct.variants.length !== constructedProduct.variants.length){
        console.log('shopify Product: ',shopifyProduct.variants);
        console.log('constructed Product: ',constructedProduct.variants);
        return 'Variant lengths not matching';
    }
    let variantError = compareVariants(shopifyProduct.variants,constructedProduct.variants);
    if(variantError){
        return variantError;
    }

    return false;
}
//the data should be in the exact same order, but just in case add this in
function findIndex(arr,target,key){
    for(let i = 0; i < arr.length;i++){
        if(arr[i][key] === target){
            return i;
        }
    }

    return false;
}

function testProductData(shopifyData,constructedData){
    let errors = [];
    let productId = 'product_id';
    for(let i = 0;i < shopifyData.length;i++){
        let currentProduct = shopifyData[i];
        let index = findIndex(constructedData,currentProduct.id,productId);
        let checkProducts = compareProducts(currentProduct,constructedData[index]);
        let error = null;
        if(checkProducts){
            error = buildError(checkProducts,index,currentProduct.title);
        }
        if(error){
            errors.push(error);
        }
    }

    return errors;
}

module.exports = {testProductData};