const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);

describe("Compare Shopify and NS data",function(){
    it('Should pass',function(done){
        expect(1 + 1).to.equal(2);
        done();
    })
});