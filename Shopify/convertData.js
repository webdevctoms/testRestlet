function convertData(shopifyData){
    let nsData = {};
    nsData.order = buildOrderData(shopifyData)
    console.log('convert data');
    return nsData;
}
//build line item arr for order
function buildLineItemArr(lineItems){

}
//build address string for order
function buildAddressString(addressData){ 
    if(!addressData.address2){
        addressData.address2 = "";
    }
    const shippingString = `${addressData.address1} ${addressData.address2} ${addressData.zip}-${addressData.city}, ${addressData.province}, ${addressData.country}`;

    return shippingString;
}

function buildOrderData(shopifyData){
    let orderData = {};

    orderData.recordtype = 'salesorder';
    orderData.email = shopifyData.email;
    orderData.memo = 'Shopify - Web Order';
    orderData.shipaddress = buildAddressString(shopifyData.shipping_address);
    //get shopify shipping code will need to test out with real orders
    orderData.shipmethod = shopifyData.shipping_lines[0].code;
    orderData.shipmethod = shopifyData.shipping_lines[0].price_set.shop_money.amount;
    //console.log(shopifyData.shipping_lines);
    orderData.billaddress = buildAddressString(shopifyData.billing_address);
    
    return orderData;
}

module.exports = {convertData};