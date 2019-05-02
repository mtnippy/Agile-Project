const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves.js');
const userDB = require('../javascript/user_db')
const app = require('../app.js');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;

const firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyCJorziWo3lcBRSxEqaTD-WMFEP-0VxqOY",
    authDomain: "test-6ec85.firebaseapp.com",
    databaseURL: "https://test-6ec85.firebaseio.com",
    projectId: "test-6ec85",
    storageBucket: "test-6ec85.appspot.com",
    messagingSenderId: "483947477248"
};
firebase.initializeApp(firebaseConfig);

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
    it('Creating user, expect good fields', function(){
        var actual = userDB.add_new_user('Andy', 'Boi', 'happy@gspot.com', 'doo', 'doo');
        assert.equal(actual, 'Your account is created!');
    });
});


describe('creating', function(){
    it('Creating user, expect good fields', function(){
        var actual = userDB.email_get('happy@gspot.com');
        assert.equal(actual, 'Your account is created!');
    });
});