    
const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves.js');
const userDB = require('../javascript/user_db.js')
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

// describe('login check', function(){
//     it('When loggin in, expecting Sucessful Login',  async () => {
//         var actual = userDB.login_check('987@gmail.com', '1234567890');
//         var user_name = await 
//         assert.equal(actual, 'Sucessful Login');
//     });
// });

// describe('Failed login check', function(){
//     it('When loggin in, expecting unsucessful Login',  async () => {
//         var email = '9484@gmail.com';
//         var password = '123456754'
//         var actual = userDB.login_check(email, password);
//         assert.equal(error.code, 'auth/user-not-found');
//     });
// });

describe('getting', function(){
    it('Should return good e-mail',  async () => {
        var actual = await userDB.check_character_exist('987@gmail.com');
        console.log(actual)
        assert.equal(actual, true);
    });
});