const assert = require('chai').assert;
const database = require('../tdd_app.js');
const app = require('../app.js');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;


describe('Login', function(){
    it("Should return successful login", async () => {
        var user = database.check_login('big@gmail.com', 'Booty');
    assert.equal(user, "Login Success")})
})