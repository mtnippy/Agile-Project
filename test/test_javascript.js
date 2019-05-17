    
const assert = require('chai').assert;
const fightingSaves = require('../javascript/fighting_saves.js');
const userDB = require('../javascript/user_db.js');
const app = require('../app.js');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;


describe('creating', function(){
    it('Creating user, returns message saying account has been created',  async () => {
        var actual = userDB.add_new_user('Andy', 'Boi', 'happy@spot.com', 'doodoo', 'doodoo');
        assert.equal(actual, 'Your account is created!');
    });
});

describe('getting', function(){
    it('Should return true if the character exists',  async () => {
        var actual = await userDB.check_character_exist('987@gmail.com');
        assert.equal(actual, true);
    });
});

describe('get info', function(){
    it('Should return object when retreiving info',  async () => {
        var actual = await fightingSaves.get_info()
        assert.equal(typeof actual, 'object');
    });
});

describe('add info', function() {
    it('Should return message Info sucessfuly added', async () => {
        var actual = await fightingSaves.add_info('Bob', 100, 30, 100 ,30, 'Sword', 'Sword', 0, 'Yup');
        assert.equal(actual, 'Info sucessfully added')
    });
});

describe('advantage test', function() {
    it('Should return Player Advantage', async() => {
        var actual = await fightingSaves.check_advantage(1);
        assert.equal(actual, 'Player has advantage')
    });
});

describe('advantage test', function() {
    it('Should return Enemy Advantage', async() => {
        var actual = await fightingSaves.check_advantage(2);
        assert.equal(actual, 'Enemy has advantage')
    });
});

describe('advantage test', function() {
    it('Should return No Advantage', async() => {
        var actual = await fightingSaves.check_advantage(0);
        assert.equal(actual, 'No one has advantage')
    });
});

describe('Weapon Triangle Test Sword--Axe', function() {
    it('Should return with weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Sword', 'Axe');
        assert.equal(actual, 'You have the weapon advantage!')
    });
});

describe('Weapon Triangle Test Spear--Sword', function() {
    it('Should return with weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Spear', 'Sword');
        assert.equal(actual, 'You have the weapon advantage!')
    });
});

describe('Weapon Triangle Test Axe--Spear', function() {
    it('Should return with weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Axe', 'Spear');
        assert.equal(actual, 'You have the weapon advantage!')
    });
});

describe('Weapon Triangle Test Axe--Sword', function() {
    it('Should return with enemy weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Axe', 'Sword');
        assert.equal(actual, 'Enemy has the weapon advantage!')
    });
});

describe('Weapon Triangle Test Sword--Spear', function() {
    it('Should return with enemy weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Sword', 'Spear');
        assert.equal(actual, 'Enemy has the weapon advantage!')
    });
});

describe('Weapon Triangle Test Spear--Axe', function() {
    it('Should return with enemy weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Spear', 'Axe');
        assert.equal(actual, 'Enemy has the weapon advantage!')
    });
});

describe('Weapon Triangle Test Axe--Axe', function() {
    it('Should return with no weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Axe', 'Axe');
        assert.equal(actual, 'No weapon advantage given!')
    });
});

describe('Weapon Triangle Test Sword--Sword', function() {
    it('Should return with no weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Sword', 'Sword');
        assert.equal(actual, 'No weapon advantage given!')
    });
});

describe('Weapon Triangle Test Spear--Spear', function() {
    it('Should return with no weapon advantage', async() => {
        var actual = await fightingSaves.check_weapon_advantage('Spear', 'Spear');
        assert.equal(actual, 'No weapon advantage given!')
    });
});