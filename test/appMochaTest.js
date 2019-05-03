const assert = require('chai').assert;
const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../app.js');
var wait = require('wait');
var timeout = require('timeout');
var cheerio = require('cheerio');
var should = require('chai').should();
const index_b = require('../views/index_b.hbs')

//Unit test for retrieving front page
describe('GET /', function () {
    this.timeout(5000);
    it("should return as 'Official Front Page' ", function (done) {
        // wait(1000);
        request(app)
            .get("/index_b")
            .set('Accept', 'application/json')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200)
            .end(function(err, res) {
                // console.log(res.header);
                var $ = cheerio.load(res.header);
                var title = $('title').text();
                assert.equal(title, 'Official Front Page');
                done()
            })
    });
});







