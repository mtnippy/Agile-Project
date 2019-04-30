const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves');

describe('adding', function(){
    // Unit test "it" block for adding info upon character creation
    // Note: you have to change the "test" var from "echo/.... to "mocha"
    // When Unit testing a method, maker sure that method RETURNS SOMETHING!!!
    it('When Adding info, Expect good info', function(){
        var actual = fightingSaves.add_info('Andy', '1', '2', '23', '40');
        assert.equal(actual, 'Info sucessfully added');
    });
});