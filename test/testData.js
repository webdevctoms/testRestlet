const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require('../server');
const {CK} = require('../config');
const {GetProductData,normalizeData} = require ('../Shopify/shopifyConfig');
const {SHOPIFYCAD,SHOPIFYK,SHOPIFYP} = require('../config');
const {GetInventoryData} = require('../ns/nsConfig');
const {testProductData} = require('./compareVariants');
const expect = chai.expect;
chai.use(chaiHttp);

describe("Compare Shopify and NS data",function(){
    let products;

    before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
    });
    
    it('Should pass',function(done){
        expect(1 + 1).to.equal(2);
        done();
    });

    it('Should get all shopify products',function(){
        this.timeout(10000);
        const options = {
            url:SHOPIFYCAD,
            key:SHOPIFYK,
            pass:SHOPIFYP,
            fields:[
                'variants',
                'id',
                'title'
            ],
            endpoint:'products'
        };
        //get all products
        return GetProductData(options)

        .then(productData => {
            products = productData;
            expect(productData.length).to.equal(495);
        })
        .catch(err => {
            console.log(err);
            if(err instanceof chai.AssertionError){
                throw err;
            }
        });
    });

    it('Should get a valid token',function(done){
        chai.request(app)
        .get('/token')
        .set('Authorization',CK)

        .then(tokenData => {
            const token = tokenData.body.token;
            try{
                const decoded = jwt.verify(token, CK);
                //console.log(decoded);
                expect(decoded.data).to.equal('token');
                done();
            }
            catch(err){
               
               if(err.name === 'JsonWebTokenError'){
                console.log('invalid token');
               }
               else{
                console.log(err);
               } 
            }
        })
        .catch(err => {
            console.log(err);
            if(err instanceof chai.AssertionError){
                throw err;
            }
        });
    });

    it('Should get all data',function(){
        let startTime;
	    let endTime;
        this.timeout(1400000);
        //const sample = products.slice(40,100);
        startTime = Date.now();
        const third = Math.round(products.length / 3);
		const twoThird = third * 2;
		const third1 = products.slice(0,third);
		const third2 = products.slice(third,twoThird);
        const third3 = products.slice(twoThird,products.length);
        return Promise.all([GetInventoryData(third1),GetInventoryData(third2),GetInventoryData(third3)])
        //return GetInventoryData(sample)

        .then(inventoryData => {
            endTime = Date.now();
            let end = endTime - startTime;
            console.log('==Time elapsed==: ',end);

            inventoryData = normalizeData(inventoryData);
            console.log('===============inventoryDatap body=============',inventoryData.length);
            expect(products.length).to.equal(inventoryData.length);
            //inventoryData[inventoryData.length - 1].variants.push({id:123});
            //inventoryData[0].variants.push({id:123});
            let errors = testProductData(products,inventoryData);
            //let errors = testProductData(products.slice(0,2),inventoryData);
            console.log('===============errors=============',errors.length);
            console.log(errors);
            //inventoryData[inventoryData.length - 1].variants.push({id:123});
            expect(errors.length).to.equal(0);
        })

        .catch(err => {
            console.log(err);
            if(err instanceof chai.AssertionError){
                throw err;
            }

            throw err;
        });
    });
});