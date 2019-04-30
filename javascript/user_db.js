// YOU MUST RUN THIS FIRST: "npm install firebase-admin --save"
// initialize firebase
// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = '../servicekey.json';
const fs = require('fs');
const _ = require('lodash');

// declaring variable for firestore
var fbdb = admin.firestore();
const firebase = require('firebase');

console.log(fbdb);

try{
    if (fs.existsSync(path)){
        console.log('user_database.json is found');
    } else {
        throw 'File user_database.json is not found, creating new file...'
    }
} catch(err) {
    console.log(err);
    fs.writeFileSync('user_database.json', "{}");
}

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
        return 'Your account is created!'
    }
};

var login_check = (email, password) => {
    // console.log(typeof userObject.Password);

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // error handling
            var errorCode = error.code;
            var errorMessages = error.message;
            console.log('error' + error.message);
            return 'Login Failed'
        })

    // if (email in userObject) {
    //     if (userObject[`${email}`].Password === password) {
    //         return 'Success!'
    //     } else {
    //         return 'Password incorrect'
    //     }
    // } else {
    //     return 'Email is not found'
    // }
};

var email_get = (email) => {
    if (email in userObject) {
        return userObject[`${email}`].First_Name
    }
};

module.exports = {
    add_new_user: add_new_user,
    login_check: login_check,
    email_get: email_get
};