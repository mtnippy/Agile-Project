const assert = require('chai').assert;
const request = require('supertest');
var cheerio = require('cheerio');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../app.js');


//Unit test for retrieving front page
describe('GET /', function () {
    it("should return 'Official Front Page' ", function (done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200)
            .end(function(err, res) {
               // console.log(res.text);
                var $ = cheerio.load(res.text);
                var title = $('title').text();
                assert.equal(title, 'Official Front Page');
                done()
            })
    });
});

