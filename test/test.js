var assert = require('chai').assert;

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('#sum', function () {
    it('when empty array, expect to return 0', function () {
        var actual = [0].reduce(add);
        assert.equal(actual, 0);
    });
    it('when with single number, expect the number', function () {
        var number = 6;
        var actual = [1,2,3].reduce(add);
        var expected = number;
        assert.equal(actual, expected);
    });
});

function add(acc, a) {
    return acc + a
}