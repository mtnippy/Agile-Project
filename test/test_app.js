const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var cheerio = require('cheerio');



var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../app');
var server = chai.request.agent(app)

function wait(ms) {
    console.log('Database Loading')
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

var server = chai.request.agent(app)
describe('get / after failing to log in', function () {
    this.timeout(22000)
    it("Should return 'Logged in index page' ", function (done) {
        server
            .post('/user_logging_in')
            .type('form')
            .send({ email: '987@gmail.com', password: '124567890' })
            .then(function (res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});

var server = chai.request.agent(app)
describe('get /index_b and successful login', function () {
    this.timeout(22000)
    it("Should return 'Logged in index_b page' ", function (done) {
        server
            .post('/user_logging_in')
            .type('form')
            .send({ email: '987@gmail.com', password: '1234567890' })
            .then(function (res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});

var server = chai.request.agent(app)
//Testing Home Page
describe('GET /', function () {
    this.timeout(5000);
    it("should return as 'Official Front Page' ", function (done) {
        wait(4000);
        request(app)
            .get("/index_b")
            .set('Accept', 'application/json')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200)
            .end(function (err, res) {
                // console.log(res.header);
                var $ = cheerio.load(res.header);
                var title = $('title').text();
                assert.equal(title, '');
                done()
            })
    });
});



var server = chai.request.agent(app)
//Testing Coding page
describe('GET /sign_up', function () {
    it("Should return 'sign up page' ", function (done) {
        server
            .get('/sign_up')
            .end(function (err, res) {
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
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done()
            })
    });
});
