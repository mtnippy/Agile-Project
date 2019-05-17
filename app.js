// YOU MUST RUN THIS FIRST: "npm install firebase-admin --save"

// initialize firebase
// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../Real_Agile_Project/servicekey.json');
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
var hbucks = 0;


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
    var getmoney = await fbdb.collection('users').doc(user_email).get();
    hbucks = await getmoney.data()['hbucks'];
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
    var output = '';
    // var output = await user_db.login_check(email, password);
    var output = firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async function () {
        authentication = true;
        var alex = await fbdb.collection('users').doc(email).get();
        f_name = await alex.data()['f_name'];
        user_email = email;
        response.redirect('/index_b');
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessages = error.message;
        if (error.code === 'auth/invalid-email') {
            response.redirect('/')
        } else if (error.code === 'auth/user-disabled') {
            response.redirect('/')
        } else if (error.code === 'auth/user-not-found') {
            response.redirect('/')
        } else (
            response.redirect('/')
        )
    });
});

app.get('/sign_up', (request, response) => {
    response.render('sign_up.hbs', {
        title_page: 'Sign Up Form',
        header: 'Registration Form',
        username: user
    })
});

app.get('/store', async (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var exist = await user_db.check_character_exist(user_email);
        if (exist === true) {
            try {
                var users_character = await fbdb.collection('characters').doc(user_email).get();
                var character_name = await users_character.data()['character_name'];
                var health = await users_character.data()['character_health'];
                var dps = await users_character.data()['character_dps']
                var current_user = await fbdb.collection('users').doc(user_email).get();
                var money = await current_user.data()['hbucks'];
                var user_class = await users_character.data()['class'];
                var user_item = await users_character.data()['item'];
                
                if (user_class == 'Sword') {
                    response.render('store_sword.hbs', {
                        title_page: 'Sword',
                        header: 'Sword',
                        username: f_name,
                        character_name: `${character_name}`,
                        character_health: `${health}`,
                        character_dps: `${dps}`,
                        character_class: `${user_class}`,
                        character_item: `${user_item}`,
                        currency: `${money}`
                    })
                } else if (user_class == 'Axe') {
                    response.render('store_blunt.hbs', {
                        title_page: 'Axe',
                        header: 'Axe',
                        username: f_name,
                        character_name: `${character_name}`,
                        character_health: `${health}`,
                        character_dps: `${dps}`,
                        character_class: `${user_class}`,
                        character_item: `${user_item}`,
                        currency: `${money}`
                    })
                } else if (user_class == 'Spear') {
                    response.render('store_spear.hbs', {
                        title_page: 'Spear',
                        header: 'Spear',
                        username: f_name,
                        character_name: `${character_name}`,
                        character_health: `${health}`,
                        character_dps: `${dps}`,
                        character_class: `${user_class}`,
                        character_item: `${user_item}`,
                        currency: `${money}`
                    })
                }
                
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
        if (exist === true) {
            try {
                var users_character = await fbdb.collection('characters').doc(user_email).get();
                var character_name = await users_character.data()['character_name'];
                var health = await users_character.data()['character_health'];
                var dps = await users_character.data()['character_dps'];
                var user_class = await users_character.data()['class'];
                var gender = await users_character.data()['gender'];
                var item = await users_character.data()['item'];

                response.render('character.hbs', {
                    title_page: 'My Character Page',
                    header: 'Character Stats',
                    username: f_name,
                    character_name: `${character_name}`,
                    character_health: `${health}`,
                    character_dps: `${dps}`,
                    character_class: `${user_class}`,
                    character_gender: `${gender}`,
                    character_item: `${item}`
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
        if (exist === true) {
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
    var character_class = request.body.character_class;
    var exist = await user_db.check_character_exist(user_email);
    if (exist === true) {
        response.redirect('/character_creation')
    } else {
        if (character_class == 'Sword') {
            var base_healthy = _.random(1, 100);
            var base_dps = _.round(base_healthy / 3);
            var modified_health = base_healthy + 1;
            var modified_dps = base_dps + 1;
            var character_class = request.body.character_class;
            await fbdb.collection('characters').doc(user_email).set({
                character_name: character_name,
                character_health: modified_health,
                character_dps: modified_dps,
                base_health: base_healthy,
                base_dps: base_dps, 
                class: character_class,
                item: 'Butter Knife',
                win: 0,
                loss: 0
            });
            response.redirect('/character')
        } else if (character_class == 'Spear') {
            var base_healthy = _.random(1, 100);
            var base_dps = _.round(base_healthy / 3);
            var modified_health = base_healthy + 1;
            var modified_dps = base_dps + 1;
            var user_class = request.body.character_class;
            await fbdb.collection('characters').doc(user_email).set({
                character_name: character_name,
                character_health: modified_health,
                character_dps: modified_dps,
                base_health: base_healthy,
                base_dps: base_dps, 
                class: user_class,
                item: 'Stick',
                win: 0,
                loss: 0
            });
            response.redirect('/character')
        } else {
            var base_healthy = _.random(1, 100);
            var base_dps = _.round(base_healthy / 3);
            var character_class = request.body.character_class;
            var modified_health = base_healthy + 1;
            var modified_dps = base_dps + 1;
            await fbdb.collection('characters').doc(user_email).set({
                character_name: character_name,
                character_health: modified_health,
                character_dps: modified_dps,
                base_health: base_healthy,
                base_dps: base_dps, 
                class: character_class,
                item: 'Shovel',
                win: 0,
                loss: 0
            });
            response.redirect('/character')
        }
        
    }
});

app.get('/account', async (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        var alex = await fbdb.collection('users').doc(user_email).get();
        var char = await fbdb.collection('characters').doc(user_email).get();
        try {
            var win = char.data()['win'];
            var loses = char.data()['loss'];
            var name = char.data()['f_name'];
            response.render('account.hbs', {
                win: win,
                losses: loses,
                email: user_email,
                header: 'Account',
                name: f_name
            })
        } catch {
            response.redirect("/account_error");
        }
    }
});

app.get('/sword_bought1', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 50) {
        hbucks = hbucks - 50 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 50
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 3
        };
        var new_dps = {
            character_dps: old_dps + 3
        };
        var new_item = {
            item: 'Long Sword'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/sword_bought2', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 100) {
        hbucks = hbucks - 100 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 100
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 7
        };
        var new_dps = {
            character_dps: old_dps + 7
        };
        var new_item = {
            item: 'Great Sword'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/sword_bought3', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 200) {
        hbucks = hbucks - 200 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 200
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 20
        };
        var new_dps = {
            character_dps: old_dps + 20
        };
        var new_item = {
            item: 'Katana'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/spear_bought1', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 50) {
        hbucks = hbucks - 50 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 50
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 2
        };
        var new_dps = {
            character_dps: old_dps + 4
        };
        var new_item = {
            item: 'Lance'
        };
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        fbdb.collection('characters').doc(user_email).update(new_item);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/spear_bought2', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 100) {
        hbucks = hbucks - 100 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 100
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 4
        };
        var new_dps = {
            character_dps: old_dps + 10
        };
        var new_item = {
            item: 'Javalin'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/spear_bought3', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 200) {
        hbucks = hbucks - 200 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 200
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 10
        };
        var new_dps = {
            character_dps: old_dps + 30
        };
        var new_item = {
            item: 'Glaive'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/blunt_bought1', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 50) {
        hbucks = hbucks - 50 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 50
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 1
        };
        var new_dps = {
            character_dps: old_dps + 6
        };
        var new_item = {
            item: 'Tomahawk'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/blunt_bought2', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 100) {
        hbucks = hbucks - 100 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 100
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 2
        };
        var new_dps = {
            character_dps: old_dps + 15
        };
        var new_item = {
            item: 'Battle Axe'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/blunt_bought3', async (request, response) => {
    var user_current = await fbdb.collection('users').doc(user_email).get();
    hbucks = user_current.data()['hbucks'];
    if (hbucks >= 200) {
        hbucks = hbucks - 200 
        var hbucks_object = {
            hbucks : (user_current.data()['hbucks']) - 200
        }
        fbdb.collection('users').doc(user_email).update(hbucks_object)
        var current = await fbdb.collection('characters').doc(user_email).get();
        var old_health = await current.data()['base_health'];
        var old_dps = await current.data()['base_dps'];
        var new_health = {
            character_health: old_health + 5
        };
        var new_dps = {
            character_dps: old_dps + 50
        };
        var new_item = {
            item: 'Glaive'
        };
        fbdb.collection('characters').doc(user_email).update(new_item);
        fbdb.collection('characters').doc(user_email).update(new_health);
        fbdb.collection('characters').doc(user_email).update(new_dps);
        
        response.render('bought.hbs', {
            name: f_name
        })
    } else {
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var character_name = await users_character.data()['character_name'];
        var health = await users_character.data()['character_health'];
        var dps = await users_character.data()['character_dps']
        var current_user = await fbdb.collection('users').doc(user_email).get();
        var money = await current_user.data()['hbucks'];
        var character_class = await users_character.data()['class'];
        var character_item = await users_character.data()['item']

        response.render('store_sword.hbs', {
            output: 'You do not have enough hbucks!',
            title_page: 'Sword',
            header: 'Sword',
            username: f_name,
            character_name: `${character_name}`,
            character_health: `${health}`,
            character_dps: `${dps}`,
            character_class: character_class,
            character_item: character_item,
            currency: `${money}`
        })
    }
});

app.get('/account_error', (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        var name = user_db.email_get(user);
        response.render('account_error.hbs', {
            email: user,
            header: 'Account',
            name: name
        })
    }
});

var advantage = 0;
var advantage_msg = '';
var enemy_class = '';
var player_class = '';

app.get('/fight', async (request, response) => {
    var outcome = 'Win';
    var classes = ['Sword', 'Spear', 'Axe'];

    if (authentication === false) {
        response.redirect('/');
    } else {
        var character_db = await fbdb.collection('characters').doc(user_email).get();
        try {
            var player_item = await character_db.data()['item'];
            var name_player = await character_db.data()['character_name'];
            var health_player = await character_db.data()['character_health'];
            var dps_player = await character_db.data()['character_dps'];
            player_class = await character_db.data()['class'];
            var health_enemy =  await _.random(health_player - 10, _.round(health_player + 5));
            var dps_enemy = await _.random(dps_player - 10, dps_player + 3);
            enemy_class = await classes[_.random(0,2)];

            if (player_class == 'Sword' && enemy_class == 'Axe' || player_class == 'Spear' && enemy_class == 'Sword' || player_class == 'Axe' && enemy_class == 'Spear') {
                advantage = 1;
                advantage_msg = `You have the weapon advantage! +8 DPS and +8 Health for ${name_player}!`;
                health_player = health_player + 8;
                dps_player = dps_player + 8;
            } else if (player_class == 'Axe' && enemy_class == 'Sword' || player_class == 'Sword' && enemy_class == 'Spear' || player_class == 'Spear' && enemy_class == 'Axe') {
                advantage = 2;
                advantage_msg = 'Enemy has the weapon advantage! +8 DPS and +8 Health for the Enemy!'
                dps_enemy = dps_enemy + 8;
                health_enemy = health_enemy + 8; 
            } else {
                advantage = 0;
                advantage_msg = `No weapon advantage given!`
            }


            await fight.add_info(name_player, health_player, dps_player, health_enemy, dps_enemy, player_class, enemy_class, advantage, advantage_msg);

            response.render('fighting.hbs', {
                title_page: `Let's fight!`,
                header: 'Fight Fight Fight!',
                username: f_name,
                character_name: `${name_player}`,
                enemy_name: `The Enemy`,
                health_player: `Health: ${health_player}`,
                dps_player: `DPS: ${dps_player}`,
                health_enemy: `Health: ${health_enemy}`,
                dps_enemy: `DPS: ${dps_enemy}`,
                enemy_class: `Enemy Item: ${enemy_class}`,
                player_class: `Player Class: ${player_class}`,
                player_item: `Player's Item: ${player_item}`,
                advantage_msg: advantage_msg
            })
        } catch (e) {
            console.log(e);
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
        var users_character = await fbdb.collection('characters').doc(user_email).get();
        var arena_stats = await fight.get_info(); //This is a dictionary
        var player_name = arena_stats.name;
        var player_health = arena_stats.health;
        var player_dps = arena_stats.dps;
        var enemy_health = arena_stats.health_enemy;
        var enemy_dps = arena_stats.dps_enemy;
        var player_item = users_character.data()['item'];
        var new_player_health = player_health - enemy_dps;
        var new_enemy_health = enemy_health - player_dps;

        if (new_player_health > new_enemy_health && new_player_health > 0) {
            reply = 'You are winning!'
        } else if (new_enemy_health > new_player_health && new_player_health > 0) {
            reply = 'Enemy is winning'
        }
        fight.add_info(player_name, new_player_health, player_dps, new_enemy_health, enemy_dps, player_class, enemy_class, advantage, advantage_msg);

        if (new_player_health <= 0 && new_enemy_health > 0 || new_player_health <= 0 && new_enemy_health <= 0) {
            var current = await fbdb.collection('characters').doc(user_email).get();
            var lose = {
                loss: (current.data()['loss'] + 1)
            };
            fbdb.collection('characters').doc(user_email).update(lose);
            var lost = 'YOU LOSE';
            response.render('win_lose_page.hbs', {
                win_lose: `${lost}`,
                currency_earned: 0
            });
        } else if (new_enemy_health <= 0 && new_player_health > 0) {
            var current = await fbdb.collection('characters').doc(user_email).get();
            var win = {
                win: (current.data()['win'] + 1)
            };
            fbdb.collection('characters').doc(user_email).update(win);
            var won = 'YOU WIN!';
            var randomaward = Math.floor((Math.random() * 10) + 1);
            var user_current = await fbdb.collection('users').doc(user_email).get()
            hbucks = {
                hbucks: (user_current.data()['hbucks'] + randomaward)
            };
            fbdb.collection('users').doc(user_email).update(hbucks);
            response.render('win_lose_page.hbs', {
                win_lose: `${won}`,
                currency_earned: randomaward
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
                enemy_class: `Enemy Item: ${enemy_class}`,
                player_class: `Player Class: ${player_class}`,
                player_item: `Player's Item: ${player_item}`,
                advantage_msg: advantage_msg,
                outcome: `${reply}`
            })
        }
    }
});

app.get('/win_lose_page', (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        response.render('win_lose_page.hbs', {
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



module.exports = app;

