const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves.js');
const userDB = require('../javascript/user_db')
const app = require('../app.js');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;


describe('adding', function(){
    // Unit test "it" block for adding info upon character creation
    // Note: you have to change the "test" var from "echo/.... to "mocha"
    // When Unit testing a method, maker sure that method RETURNS SOMETHING!!!
    it('When Adding info, Expect good info', function(){
        var actual = fightingSaves.add_info('Andy', '1', '2', '23', '40');
        assert.equal(actual, 'Info sucessfully added');
    });
});


describe('creating', function(){
    it('Creating user, expect good fields',  async () => {
        var actual = userDB.add_new_user('Andy', 'Boi', 'happy@gspot.com', 'doodoo', 'doodoo');
        assert.equal(actual, 'Your account is created!');
    });
});


describe('getting', function(){
    it('Should return good e-mail',  async () => {
        var actual = userDB.check_character_exist('happy@gspot.com');
        assert.equal(actual, 'undefined');
    });
});