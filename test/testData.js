const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require('../server');
const {CK} = require('../config');
const {GetProductData} = require ('../Shopify/shopifyConfig');
const {SHOPIFYCAD,SHOPIFYK,SHOPIFYP} = require('../config');
const {reqInventory} = require('./reqInventory');
const expect = chai.expect;
chai.use(chaiHttp);

describe("Compare Shopify and NS data",function(){
    let currentToken;
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
        this.timeout(5000);
        const options = {
            url:SHOPIFYCAD,
            key:SHOPIFYK,
            pass:SHOPIFYP,
            fields:[
                'variants',
                'id'
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
                currentToken = token;
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
   /*
   it('Should get all data',function(done){
        this.timeout(1400000);
        console.log('current token: ',currentToken);
        chai.request(app)
        .post('/inventory')
        .send({
            token:currentToken
        })

        .end((err,res) => {
            console.log('===============resp body1=============',err);
            console.log('===============resp body=============',res);
            done();
        });
        
        .catch(err => {
            console.log(err);
            if(err instanceof chai.AssertionError){
                throw err;
            }
        });
        
    });
    */
    it('Should get all data',function(){
        this.timeout(1400000);
        console.log('current token: ',currentToken);
        return reqInventory(currentToken)

        .then(res => {
            console.log('===============resp body=============',res);
        })

        .catch(err => {
            console.log(err);
            if(err instanceof chai.AssertionError){
                throw err;
            }

            throw err;
        })
    });
});