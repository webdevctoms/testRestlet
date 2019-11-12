const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require('../server');
const {CK} = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe("Compare Shopify and NS data",function(){
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
});