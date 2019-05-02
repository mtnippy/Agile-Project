// YOU MUST RUN THIS FIRST: "npm install firebase-admin --save"

// initialize firebase
// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../Agile-Project/servicekey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
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

// declaring variable for firestore
var fbdb = admin.firestore();
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const axios = require('axios');
const _ = require('lodash');
const port = process.env.PORT || 8080;
const fs = require('fs');


var authentication = false;
var user = 'Characters';


const user_db = require('./javascript/user_db.js');
const character_db = require('./javascript/character_db.js');
const fight = require('./javascript/fighting_saves.js');

var f_name = '';
var user_email = '';

var app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/views'));

app.get('/', (request, response) => {
    if (authentication === true) {
        response.redirect('/index_b');
    } else {
        response.render('index.hbs', {
            title_page: 'Official Front Page',
            header: 'Fight Simulator',
            welcome: `Welcome ${user}`,
            username: user
        })
    }
});

app.get('/logout', (request, response) => {
    authentication = false;
    user = 'Characters';
    response.redirect('/');
});

app.get('/index_b', async (request, response) => {
    response.render('index_b.hbs', {
        title_page: 'Official Front Page',
        header: 'Fight Simulator',
        welcome: `Welcome ${f_name}`,
        username: f_name
    })
});

app.post('/user_logging_in', async (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    var output = user_db.login_check(email, password);

    if (output === 'Login Failed') {
        response.redirect('/')
    } else {
        authentication = true;
        var alex = await fbdb.collection('users').doc(email).get();
        f_name = await alex.data()['f_name'];
        user_email = email;
        response.redirect('/index_b');
    }
});

app.get('/sign_up', (request, response) => {
    response.render('sign_up.hbs', {
        title_page: 'Sign Up Form',
        header: 'Registration Form',
        username: user
    })
});

app.post('/insert', (request, response) => {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var password = request.body.password;
    var password_repeat = request.body.password_repeat;
    var output = user_db.add_new_user(first_name, last_name, email, password, password_repeat);

    response.render('sign_up.hbs', {
        title_page: 'Sign Up Form',
        header: 'Registration Form',
        username: user,
        output_error: `${output}`
    })
});

app.get('/character', async (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var exist = await user_db.check_character_exist(user_email);
        console.log(exist);
        if ( exist === true) {
            try {
                var users_character = await fbdb.collection('characters').doc(user_email).get();
                var character_name = await users_character.data()['character_name'];
                var health = await users_character.data()['character_health'];
                var dps = await users_character.data()['character_dps']

                response.render('character.hbs', {
                    title_page: 'My Character Page',
                    header: 'Character Stats',
                    username: f_name,
                    character_name: `${character_name}`,
                    character_health: `${health}`,
                    character_dps: `${dps}`
                })
            } catch (e) {
                response.render('character.hbs', {
                    title_page: 'My Character Page',
                    header: 'Character Stats',
                    username: f_name,
                    character_name: 'CREATE CHARACTER NOW',
                    character_health: 'CREATE CHARACTER NOW',
                    character_dps: 'CREATE CHARACTER NOW'
                })
            }
        } else {
            response.render('character.hbs', {
                title_page: 'My Character Page',
                header: 'Character Stats',
                username: f_name,
                character_name: 'CREATE CHARACTER NOW',
                character_health: 'CREATE CHARACTER NOW',
                character_dps: 'CREATE CHARACTER NOW'
            })
        }
    }
});

app.get('/character_creation', async (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var exist = await user_db.check_character_exist(user_email);
        if ( exist === true) {
            output = "You already have a character ready for battle!";
            response.render('character_creation.hbs', {
                title_page: 'Character Creation',
                header: 'Create Character',
                username: f_name,
                output_error: `${output}`
            })
        }
        output = "Create a character now!";
        response.render('character_creation.hbs', {
            title_page: 'Character Creation',
            header: 'Create Character',
            username: f_name,
            output_error: `${output}`
        })
    }
});

app.post('/create_character', async (request, response) => {
    var character_name = request.body.character_name;
    var exist = await user_db.check_character_exist(user_email);
    if (exist === true) {
        response.redirect('/character_creation')
    } else {
        var healthy = _.random(1, 100);
        var dps = _.round(healthy/3);
        fbdb.collection('characters').doc(user_email).set({
            character_name: character_name,
            character_health: healthy,
            character_dps: dps,
            win: 0,
            loss: 0
        });
            response.redirect('/character')
    }       
});


app.get('/account', async (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        var alex = await fbdb.collection('users').doc(user_email).get();
        try {
            var win = alex.data()['win'];
            var loses = alex.data()['loss'];
            var name = alex.data()['f_name'];
            response.render('account.hbs', {
                name: name,
                win: win,
                losses: loses,
                email: user_email,
                header: 'Account'
            })
        } catch {
            response.redirect("/account_error");
        }
    }
});

app.get('/account_error', (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        var name = user_db.email_get(user);
        response.render('account_error.hbs',{
            email: user,
            header: 'Account',
            name: name
        })
    }
});

app.get('/fight', async (request, response) => {
    var outcome = 'Win';

    if (authentication === false) {
        response.redirect('/');
    } else {
        var character_db = await fbdb.collection('characters').doc(user_email).get();
            try {
                var name_player = character_db.data()['character_name'];
                var health_player = character_db.data()['character_health']
                var dps_player = character_db.data()['character_dps'];
                var health_enemy = _.random(health_player - 10, _.round(health_player + 5));
                var dps_enemy = _.random(dps_player - 10, dps_player + 3);

                fight.add_info(name_player, health_player, dps_player, health_enemy, dps_enemy);

                response.render('fighting.hbs', {
                    title_page: `Let's fight!`,
                    header: 'Fight Fight Fight!',
                    username: f_name,
                    character_name: `${name_player}`,
                    enemy_name: `The Enemy`,
                    health_player: `Health: ${health_player}`,
                    dps_player: `DPS: ${dps_player}`,
                    health_enemy: `Health: ${health_enemy}`,
                    dps_enemy: `DPS: ${dps_enemy}`
                })
            } catch (e) {
                response.render('fighting.hbs', {
                    title_page: 'Error 404',
                    header: 'Error 404'
                })
            }
    }
});

app.get('/battle', async (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var arena_stats = await fight.get_info(); //This is a dictionary
        var player_name = arena_stats.name;
        var player_health = arena_stats.health;
        var player_dps = arena_stats.dps;
        var enemy_health = arena_stats.health_enemy;
        var enemy_dps = arena_stats.dps_enemy;
        var new_player_health = player_health - enemy_dps;
        var new_enemy_health = enemy_health - player_dps;

        if (new_player_health > new_enemy_health && new_player_health > 0) {
            reply = 'You are winning!'
        } else if (new_enemy_health > new_player_health && new_player_health > 0) {
            reply = 'Enemy is winning'
        }
        fight.add_info(player_name, new_player_health, player_dps, new_enemy_health, enemy_dps);

        if (new_player_health <= 0 && new_enemy_health > 0 || new_player_health <= 0 && new_enemy_health <= 0) {
            var current = await fbdb.collection('users').doc(user_email).get();
            var lose = {
                loss: (current.data()['loss'] + 1)
            };
            fbdb.collection('users').doc(user_email).update(lose);
            var lost = 'YOU LOSE';
            response.render('win_lose_page.hbs', {
                win_lose: `${lost}`
            });
        } else if (new_enemy_health <= 0 && new_player_health > 0) {
            var current = await fbdb.collection('users').doc(user_email).get();
            var win = {
                win: (current.data()['win'] + 1)
            };
            fbdb.collection('users').doc(user_email).update(win);
            var won = 'YOU WIN!';
            response.render('win_lose_page.hbs', {
                win_lose: `${won}`
            })
        } else {
            response.render('fighting.hbs', {
                title_page: `Let's fight!`,
                header: 'Fight Fight Fight!',
                username: user,
                character_name: `${player_name}`,
                enemy_name: `The Enemy`,
                health_player: `Health: ${new_player_health}`,
                dps_player: `DPS: ${player_dps}`,
                health_enemy: `Health: ${new_enemy_health}`,
                dps_enemy: `DPS: ${enemy_dps}`,
                outcome: `${reply}`
            })
        }
    }
});

app.get('/win_lose_page', (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        response.render('win_lose_page.hbs',{
        })
    }
});

app.post('/update', (request, response) => {
    var new_name = {
        character_name: request.body.new_name
    };
    fbdb.collection('characters').doc(user_email).update(new_name)
    response.redirect('/character')
});

app.get('/update_name', (request, response) => {
    response.render('update_name.hbs', {
        title_page: "Update Name",
        header: "Update Character Name",
        username: user
    })
});

app.post('/delete', (request, response) => {
    fbdb.collection('characters').doc(user_email).delete();
    response.redirect("/character")
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});


