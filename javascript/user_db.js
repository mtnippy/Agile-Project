// YOU MUST RUN THIS FIRST: "npm install firebase-admin --save"
// initialize firebase
// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = '../servicekey.json';
const fs = require('fs');
const _ = require('lodash');
var fbdb = admin.firestore();
var userid = '';
const firebase = require('firebase');


var readUser = fs.readFileSync("user_database.json");
var userObject = JSON.parse(readUser);

var add_new_user = (first_name, last_name, email, password, password_repeat) => {
    if (password !== password_repeat) {
        return 'Password does not match'
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('error'+ error.message);
        });
        fbdb.collection("users").doc(email).set({
            f_name: first_name,
            l_name: last_name,
            loss: 0,
            win: 0,
        })
            .then(function() {
                console.log("Document written with ID: ", userid);
            })
            .catch(function(error) {
                console.error("Error adding comment: ", error);
            });
        return 'Your account is created!'
    }
};

var login_check = (email, password) => {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessages = error.message;
            console.log('error' + error.message);
            return 'Login Failed'
        })
};

var check_character_exist = async (email) => {
    var ref = await fbdb.collection('characters').doc(email).get()
    ref2 = ref.exists
    return ref2
};

module.exports = {
    add_new_user: add_new_user,
    login_check: login_check,
    check_character_exist: check_character_exist
};


