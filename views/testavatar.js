function next() {
    var ima = document.getElementById('myImage');
    if (ima.src.match("images/helmet1.png")) {
        ima.src = "images/helmet2.png"
    } else if (ima.src.match("images/helmet2.png")){
        ima.src = "images/helmet3.jpg"
    } else {
        ima.src = "images/helmet1.png";
    }
}
function prev() {
    var ima = document.getElementById('myImage');
    if (ima.src.match("images/helmet2.jpg")) {
        ima.src = "images/helmet1.png"
    } else if (ima.src.match("images/helmet3.jpg")){
        ima.src = "images/helmet2.jpg"
    } else {
        ima.src = "images/helmet2.jpg";
    }
}
function nextarm() {
    var ima = document.getElementById('armor');
    if (ima.src.match("images/armor1.jpg")) {
        ima.src = "images/armor2.jpg"
    } else if (ima.src.match("images/armor2.jpg")){
        ima.src = "images/armor3.jpg"
    } else {
        ima.src = "images/armor1.jpg";
    }
}
function prevarm() {
    var ima = document.getElementById('armor');
    if (ima.src.match("images/armor2.jpg")) {
        ima.src = "images/armor1.jpg"
    } else if (ima.src.match("images/armor3.jpg")){
        ima.src = "images/armor2.jpg"
    } else {
        ima.src = "images/armor2.jpg";
    }
}
function nextleg() {
    var ima = document.getElementById('legging');
    if (ima.src.match("images/legging1.jpg")) {
        ima.src = "images/legging2.jpg"
    } else if (ima.src.match("images/legging2.jpg")){
        ima.src = "images/legging3.jpg"
    } else {
        ima.src = "images/legging1.jpg";
    }
}
function prevleg() {
    var ima = document.getElementById('legging');
    if (ima.src.match("images/legging2.jpg")) {
        ima.src = "images/legging1.jpg"
    } else if (ima.src.match("images/legging3.jpg")){
        ima.src = "images/legging2.jpg"
    } else {
        ima.src = "images/legging2.jpg";
    }
}
