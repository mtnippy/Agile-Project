const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves.js');

describe('adding', function(){
    it('When Adding info, Except good info', function(){
        var actual = fightingSaves.add_info('Andy', '1', '2', '23', '40');
        assert.equal(actual, 'Info sucessfully added');
    });
});