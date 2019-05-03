const assert = require('chai').assert;
const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../app.js');
var cheerio = require('cheerio');
var should = require('chai').should();


//Unit test for retrieving front page
describe('GET /', function () {
    it("should return as 'Official Front Page' ", function (done) {
        wait(1000);
        request(app)
            .get("/index_b")
            .set('Accept', 'application/json')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200)
            .end(function(err, res) {
                var $ = cheerio.load(res.text);
                var title = $('title').text();
                assert.equal(title, 'Official Front Page');
                done()
            })
    });
});




