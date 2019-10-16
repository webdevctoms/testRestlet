function convertData(shopifyData){
    let nsData = {};
    nsData.order = buildOrderData(shopifyData)
    console.log('convert data');
    return nsData;
}
//build line item arr for order
function buildLineItemArr(lineItems){
    let nsItems = [];
    console.log('shopify line items: ',lineItems[1].price_set);
    for (let i = 0; i < lineItems.length; i++) {
        const shopifyItem = lineItems[i];
        let singleItem = {};
        //need to match up shopify item codes with netsuite 
        singleItem.item = shopifyItem.sku;
        singleItem.quantity = shopifyItem.quantity;
        //for now hard coded this will = online price
        //discuss if NS should handle pricing or take pricing from Shopify
        singleItem.price = 5;
        //verify if this is individual price or price of quantity
        singleItem.rate = shopifyItem.price;
        nsItems.push(singleItem);
    }
    console.log('Item array: ',nsItems);
    return nsItems;
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
    orderData.shippingcost = shopifyData.shipping_lines[0].price_set.shop_money.amount;
    //console.log(shopifyData.shipping_lines);
    orderData.billaddress = buildAddressString(shopifyData.billing_address);
    //checck this also
    orderData.otherrefnum = shopifyData.order_number;
    orderData.items = buildLineItemArr(shopifyData.line_items);

    return orderData;
}

module.exports = {convertData};