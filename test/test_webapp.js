const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;

var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../app');
var server = chai.request.agent(app)

function wait(ms){
    console.log('Database Loading')
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

//-----------------------------Testers-----------------------------------//
var server = chai.request.agent('http://localhost:8080')
//Testing Coding page
describe('', function () {
    this.timeout(10000);
    it("Reject failed login attempt' ", function (done) {
        server
            .post('/user_logging_in')
            .type('form')
            .send({email: 'fasd@gmail.com', password: 'asdasdasd'})
            .end(function(err, res) {
                var str = res.text;
                var patt = /Login Failed/i;
                var resu = patt.text(str);
                assert.equal(resu, true);
                done()
            })
    });
});

var server = chai.request.agent(app)
//Testing Code-Save renders
describe('Get /index_b', function () {
    this.timeout();
    it("Should return 'Code-Save Page' ", function (done) {
        server
            .post('/user_logging_in')
            .type('form')
            .send({email: '987@gmail.com', password: '1234567890'})
            .then(function(res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});

var server = chai.request.agent(app)
//Testing Broken URL
describe('GET /12345', function () {
    //timeout line
    this.timeout(10000);

    it("Should return '404' ", function (done) {
        //timeout line
        wait(3000)
        server
            .get('/12345')
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done()
            })
    });
});

var server = chai.request.agent('http://localhost:8080')
//Testing Home Page
describe('GET /', function () {
    it("Should return 'Home Page' ", function (done) {
        server
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});

var server = chai.request.agent('http://localhost:8080')
//Testing Coding page
describe('GET /sign_up', function () {
    it("Should return 'Code Page' ", function (done) {
        server
            .get('/sign_up')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});



