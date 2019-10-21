function convertData(shopifyData){
    let nsData = {};
    nsData.order = buildOrderData(shopifyData);
    nsData.customer = buildCustomerData(shopifyData);
    console.log('convert data');
    return nsData;
}
//build line item arr for order
function buildLineItemArr(lineItems){
    let nsItems = [];
    //console.log('shopify line items: ',lineItems);
    for (let i = 0; i < lineItems.length; i++) {
        const shopifyItem = lineItems[i];
        if(!shopifyItem.sku){
            continue;
        }
        let singleItem = {};
        //need to match up shopify item codes with netsuite 
        singleItem.item = shopifyItem.sku;
        singleItem.quantity = shopifyItem.quantity;
        //for now hard coded this will = online price
        //discuss if NS should handle pricing or take pricing from Shopify
        singleItem.price = 5;
        //individual product price
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
    orderData.shipmethod = shopifyData.shipping_lines[0].code ? shopifyData.shipping_lines[0].code : "No Shipping";
    orderData.shippingcost = shopifyData.shipping_lines[0].price_set.shop_money.amount;
    //console.log(shopifyData.shipping_lines);
    orderData.billaddress = buildAddressString(shopifyData.billing_address);
    //checck this also
    orderData.otherrefnum = shopifyData.name;
    orderData.items = buildLineItemArr(shopifyData.line_items);
    orderData.extraData = {
        taxProvince:shopifyData.shipping_address.province ? shopifyData.shipping_address.province : "none"
    };
    return orderData;
}

function buildAddressBook(addressData){
    let addressbook = {};
    
    addressbook.country = addressData.country_code;
    addressbook.city = addressData.city;
    addressbook.state = addressData.province;
    addressbook.addr1 = addressData.address1;
    if(addressData.address2){
        addressbook.addr2 = addressData.address2;  
    }
    addressbook.attention = addressData.name;
    addressbook.addressee = addressData.name;
    addressbook.zip = addressData.zip;

    return addressbook;
}


function buildCustomerData(shopifyData){
    let customerData = {};

    customerData.recordtype = 'customer';
    customerData.email = shopifyData.email;
    customerData.isperson = 'T';
    customerData.firstname = shopifyData.shipping_address.first_name;
    customerData.lastname = shopifyData.shipping_address.last_name;
    //for now hard coded since it is required by NS 2 = retail 5 = online price
    customerData.category = 2;
    customerData.pricelevel = 5;
    customerData.addressbook = buildAddressBook(shopifyData.shipping_address);
    
    return customerData;
}

module.exports = {convertData};