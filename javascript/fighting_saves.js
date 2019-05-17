const fs = require('fs');
const _ = require('lodash');
const admin = require('firebase-admin');
var fbdb = admin.firestore();
const firebase = require('firebase');

var add_info = (name, player_health, player_dps, enemy_health, enemy_dps, player_class, enemy_class, advantage, advantage_msg) => {
    fbdb.collection('arena').doc('arena').set({
        player_name: name,
        player_health: player_health,
        player_dps: player_dps,
        enemy_health: enemy_health,
        enemy_dps: enemy_dps,
        player_class: player_class,
        enemy_class: enemy_class,
        advantage_msg: advantage_msg
    }) 
    return 'Info sucessfully added'
};

var get_info = async () => {
    var info = await fbdb.collection('arena').doc('arena').get();

    var name_player = info.data()['player_name'];
    var health_player = info.data()['player_health'];
    var dps_player = info.data()['player_dps'];
    var enemy_health = info.data()['enemy_health'];
    var enemy_dps = info.data()['enemy_dps'];

    var arena_info = {
        name: name_player,
        health: health_player,
        dps: dps_player,
        dps_enemy: enemy_dps,
        health_enemy: enemy_health
    };
    return arena_info
};

module.exports = {
    add_info: add_info,
    get_info: get_info
};