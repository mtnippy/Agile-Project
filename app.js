// YOU MUST RUN THIS FIRST: "npm install firebase-admin --save"

// initialize firebase
const admin = require('firebase-admin');
var serviceAccount = require('../Agile-Project/servicekey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// declaring variable for firestore
var fbdb = admin.firestore();

// example of how to change the user 'frank'
var docRef = fbdb.collection('users').doc('frank');
var setfrank = docRef.set({
    First_Name: 'Ruru',
    Last_Name: 'Lulu'
});

// reading data from 'users' database
fbdb.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });


// existing code
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
const fight = require('./javascript/fighting_saves');

var name = user_db.email_get(user);
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

app.get('/index_b', (request, response) => {
    var name = user_db.email_get(user);
    response.render('index_b.hbs', {
        title_page: 'Official Front Page',
        header: 'Fight Simulator',
        welcome: `Welcome ${name}`,
        username: name
    })
});

app.post('/user_logging_in', (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    var output = user_db.login_check(email, password);

    if (output === 'Success!') {
        authentication = true;
        user = email;
        response.redirect('/index_b')
    } else {
        response.redirect('/')
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

app.get('/character', (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var db = character_db.getDb();
        db.collection('Character').find({email: user}).toArray((err, item) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    var character_name = item[0].character_name;
                    var health = item[0].health;
                    var dps = item[0].dps;
                    var name = user_db.email_get(user);

                    response.render('character.hbs', {
                        title_page: 'My Character Page',
                        header: 'Character Stats',
                        username: name,
                        character_name: `${character_name}`,
                        character_health: `${health}`,
                        character_dps: `${dps}`
                    })
                } catch (e) {
                    var name = user_db.email_get(user);
                    response.render('character.hbs', {
                        title_page: 'My Character Page',
                        header: 'Character Stats',
                        username: name,
                        character_name: 'CREATE CHARACTER NOW',
                        character_health: 'CREATE CHARACTER NOW',
                        character_dps: 'CREATE CHARACTER NOW'
                    })
                }
            }
        });
    }
});

app.get('/character_creation', (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var db = character_db.getDb();
        var name = user_db.email_get(user);
        db.collection('Character').find({email: user}).toArray((err, items) => {
            if (err) {
                response.send(`alert('Cannot find it')`)
            } else {
                try {
                    if (items[0].email === user) {
                        output = "You already have a character ready for battle!";
                        response.render('character_creation.hbs', {
                            title_page: 'Character Creation',
                            header: 'Create Character',
                            username: name,
                            output_error: `${output}`
                        })
                    }
                } catch (e) {
                    output = "Create a character now!";
                    response.render('character_creation.hbs', {
                        title_page: 'Character Creation',
                        header: 'Create Character',
                        username: name,
                        output_error: `${output}`
                    })
                }
            }
        });
    }
});

app.post('/create_character', (request, response) => {
    var character_name = request.body.character_name;
    var db = character_db.getDb();

    db.collection('Character').find({email: user}).toArray( (err, item) => {
        if (err) {
            response.send('Unable to get all students')
        } else {
            try {
                if(item[0].email === user) {
                    response.redirect('/character_creation')
                }
            } catch (e) {
                var healthy = _.random(1, 100);
                db.collection('Character').insertOne({
                    character_name: character_name,
                    email: user,
                    health: healthy,
                    dps: _.round(healthy/3),
                    win: 0,
                    lose: 0
                }, (err, result) => {
                    if (err) {
                        response.send('Unable to insert stats');
                    }
                    response.redirect('/character')
                });
            }
        }
    });
});


app.get('/account', (request, response) => {
    if (authentication === false) {
        response.redirect('/');
    } else {
        var name = user_db.email_get(user);
        character_db.getDb().collection('Character').find({email: user}).toArray((err, item) => {
            if (err) {
                console.log(err);
            } else{
                try {
                    var win = item[0].win;
                    var loses = item[0].lose;
                    var user = item[0].email;
                    response.render('account.hbs', {
                        name: name,
                        win: win,
                        losses: loses,
                        email: user,
                        header: 'Account'
                    })
                } catch {
                    response.redirect("/account_error");
                }
            }
        });
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

app.get('/fight', (request, response) => {
    var outcome = 'Win';

    if (authentication === false) {
        response.redirect('/');
    } else {
        // console.log(response.body);
        var db = character_db.getDb();
        db.collection('Character').find({email: user}).toArray( (err, item) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    var name_player = item[0].character_name;
                    var health_player = item[0].health;
                    var dps_player = item[0].dps;

                    var health_enemy = _.random(health_player - 10, _.round(health_player + 5));
                    var dps_enemy = _.random(dps_player - 10, dps_player + 3);

                    fight.add_info(name_player, health_player, dps_player, health_enemy, dps_enemy);

                    arena_stats = fight.get_info(); //This is a dictionary

                    response.render('fighting.hbs', {
                        title_page: `Let's fight!`,
                        header: 'Fight Fight Fight!',
                        username: user,
                        character_name: `${name_player}`,
                        enemy_name: `The Enemy`,
                        health_player: `Health: ${health_player}`,
                        dps_player: `DPS: ${dps_player}`,
                        health_enemy: `Health: ${arena_stats.enemy_health}`,
                        dps_enemy: `DPS: ${arena_stats.enemy_dps}`
                    })
                } catch (e) {
                    response.render('fighting.hbs', {
                        title_page: 'Error 404',
                        header: 'Error 404'
                    })
                }
            }
        })
    }
});

app.get('/battle', (request, response) => {
    if (authentication === false) {
        response.redirect('/')
    } else {
        var arena_stats = fight.get_info(); //This is a dictionary

        var player_name = arena_stats.player_name;

        var player_health = arena_stats.player_health;
        var player_dps = arena_stats.player_dps;

        var enemy_health = arena_stats.enemy_health;
        var enemy_dps = arena_stats.enemy_dps;

        var new_player_health = player_health - enemy_dps;
        var new_enemy_health = enemy_health - player_dps;

        if (new_player_health > new_enemy_health && new_player_health > 0) {
            reply = 'You are winning!'
        } else if (new_enemy_health > new_player_health && new_player_health > 0) {
            reply = 'Enemy is winning'
        }

        fight.add_info(player_name, new_player_health, player_dps, new_enemy_health, enemy_dps);

        if (new_player_health <= 0 && new_enemy_health > 0 || new_player_health <= 0 && new_enemy_health <= 0) {
            var db = character_db.getDb();
            db.collection('Character').find({email: user}).toArray((err, item) => {
                if (err) {
                    console.log(err)
                } else {
                    var lose = item[0].lose;
                    db.collection('Character').updateOne({email: user}, {'$set': {'lose': lose + 1}}, (err, item) => {
                        if (err) {
                            console.log(err)
                        } else {
                            var lose = 'YOU LOSE';
                            response.render('win_lose_page.hbs', {
                                win_lose: `${lose}`
                            })
                        }
                    })
                }
            })
        } else if (new_enemy_health <= 0 && new_player_health > 0) {
            character_db.getDb().collection('Character').find({email: user}).toArray((err, item) => {
                if (err) {
                    console.log(err)
                } else {
                    var win = item[0].win;
                    var health = item[0].health;
                    var dps = item[0].dps;
                    character_db.getDb().collection('Character').updateOne({email: user}, {'$set': {'health': health +5, 'dps': dps + 3, 'win': win + 1}}, (err, item) => {
                        if (err) {
                            console.log(err)
                        } else {
                            var win = 'YOU WIN!';
                            response.render('win_lose_page.hbs', {
                                win_lose: `${win}`
                            })
                        }
                    })
                }
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
    var db = character_db.getDb();
    db.collection('Character').updateOne({email:user},{'$set': {'character_name': request.body.new_name}});
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
    var db = character_db.getDb();
    db.collection('Character').deleteOne({email:user}, (err, items) => {
        console.log(items)
    });
    response.redirect("/character")
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    character_db.init();
});