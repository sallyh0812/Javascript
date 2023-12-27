"use strict";

const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', '\u2190' + 'ZXCVBNM' + '\u23ce'] //String.fromCharCode(0xBB)

//keyboard/////////////////////////////////////////////
let keyboard = document.getElementById("keyboard");
let oKeys = {}, o;
for (let i of KEYS) {
    let key_row = document.createElement(`div`);
    key_row.classList.add('keyboard-row');
    for (let j of i) {
        o = document.createElement('div');
        if (j === '\u2190') {
            o.id = 'Backspace';
        }
        else if (j === '\u23ce') {
            o.id = 'Enter';
        }
        else {
            o.id = `Key${j}`;
        }
        o.innerText = j;
        o.className = 'key';
        key_row.appendChild(o);
        oKeys[o.id] = o;
    }
    keyboard.appendChild(key_row);
}

//playarea//////////////////////////////////////////////
let playArea = document.getElementById('playarea')
let aLetter = Array(30);
let divLetterRow = document.createElement('div');
divLetterRow.classList.add('letter-row');
for (let i = 0; i < aLetter.length; i++) {
    let divLetter = document.createElement('div');
    divLetter.id = `Letter${i}`;
    divLetter.className = 'letter';
    divLetterRow.appendChild(divLetter);
    aLetter[i] = divLetter;
    if (i % 5 == 4) {
        playArea.appendChild(divLetterRow);
        divLetterRow = document.createElement('div');
        divLetterRow.classList.add('letter-row');
    }
}

//init//////////////////////////////////////////////////
let secret = DICTIONARY[Math.floor(Math.random() * 500)]; //DICTIONARY.length
console.log("secret: ", secret);
let cursor = 0;
let gameOver = false;
function init() {
    msgbox.style.visibility = 'hidden';
    cursor = 0;
    gameOver = false;
    secret = DICTIONARY[Math.floor(Math.random() * 500)]; //DICTIONARY.length
    console.log("secret: ", secret);
    for (let i = 0; i < 30; i++) {
        aLetter[i].innerText = "";
        aLetter[i].classList.remove('green','yellow','darkgray','filled');
        aLetter[i].setAttribute('animation', 'none');
    }
    for (let key in oKeys) {
        oKeys[key].classList.remove('green','yellow','darkgray');
    }
}

//event listener///////////////////////////////////////
keyboard.addEventListener('click', function (e) {
    e = e || window.event;
    //console.log("e.target.id: ", e.target.id); //keyA, Enter, Backspace
    if (!gameOver) {
        keyProcess(e.target.id);
    }
});
window.addEventListener('keydown', function (e) {
    e = e || window.event;
    //("e.code: ", e.code); //keyA, Enter, Backspace
    //console.log("innerText: ", document.getElementById(e.code).innerText)
    if (!gameOver) {
        keyProcess(e.code);
    }
});
function keyProcess(code) {
    document.getElementById(code).setAttribute('animation', 'pop');
        setTimeout(function(){
            document.getElementById(code).setAttribute('animation', 'none');
        },300);
    if (code === 'Enter') {
        if (cursor % 5 === 4 && aLetter[cursor].innerText != "") {
            //console.log("check");
            let answer = '', letter;
            for (let i = 0; i < 5; i++) {
                letter = aLetter[cursor - 4 + i].innerText.toLowerCase();
                answer += letter;
            }
            console.log("answer: ", answer);
            if (DICTIONARY.includes(answer)) {
                for (let i = 0, j; i < 5; i++) {
                    j = cursor - 4 + i;
                    setTimeout(function () {
                        aLetter[j].setAttribute('animation', 'flip-in');
                        letter = aLetter[j].innerText.toLowerCase();
                        //console.log(letter);
                        if (letter === secret[i]) {
                            aLetter[j].classList.add('green');
                            oKeys[`Key${aLetter[j].innerText}`].classList.add('green');
                        }
                        else if (secret.indexOf(letter) > -1) {
                            aLetter[j].classList.add('yellow');
                            oKeys[`Key${aLetter[j].innerText}`].classList.add('yellow');
                        }
                        else {
                            aLetter[j].classList.add('darkgray');
                            oKeys[`Key${aLetter[j].innerText}`].classList.add('darkgray');
                        }
                    }, (j % 5) * 300);
                    setTimeout(function () {
                        aLetter[j].setAttribute('animation', 'flip-out');

                    }, (j % 5) * 300 + 200);

                }
                //console.log(answer, aLetter[cursor].id);
                if (answer === secret) {
                    console.log("Congratulation!");
                    displayGameover("Congratulation!\nYou won!");
                    gameOver = true;
                }
                else if (cursor === 29) {
                    console.log("Oh no :(");
                    displayGameover("Oh no :(\nYou lost...");
                    //audioAgain.play();
                    gameOver = true;
                }
                else {
                    cursor++;
                }
            } else {
                console.log("Word not found!");
                displayHint("Word not found!");
            }
        }
        else {
            console.log("Word too short!");
            displayHint("Word too short!");
        }
    }
    else if (code === 'Backspace') {
        //console.log(cursor);
        if (aLetter[cursor].innerText != "") {
            aLetter[cursor].innerText = "";
            aLetter[cursor].setAttribute('animation', 'none');
            aLetter[cursor].classList.remove('filled');
            if (cursor % 5 != 0 && cursor % 5 != 4) {
                cursor--;
            }
        }
        else if (cursor % 5 != 0) {
            cursor--;
            aLetter[cursor].innerText = "";
            aLetter[cursor].setAttribute('animation', 'none');
            aLetter[cursor].classList.remove('filled');
        }
    }
    else if (code >= 'KeyA' && code <= 'KeyZ') {
        aLetter[cursor].innerText = document.getElementById(code).innerText;
        aLetter[cursor].setAttribute('animation', 'pop');
        aLetter[cursor].classList.add('filled');
        if (cursor % 5 != 4) {
            cursor++;
        }
    }
    //console.log("cursor: ", cursor);
}

//msg/////////////////////////////////////////////////
let msgbox = document.createElement('div');
msgbox.id = 'msgbox';
playArea.appendChild(msgbox);
function closeMessage() {
    msgbox.style.visibility = 'hidden';
}
function displayHint(msg) {
    msgbox.style.visibility = 'visible';
    msgbox.innerHTML =
        `<div>${msg}</div>
     <button onclick = 'closeMessage()'>x</button>`;
    setTimeout(function () {
        msgbox.style.visibility = 'hidden';
    }, 3000);
}
function displayGameover(msg) {
    msgbox.style.visibility = 'visible';
    msgbox.innerHTML =
        `<div>${msg}</div>
        <div>secret: ${secret.toUpperCase()}</div>
     <button onclick = 'init()'>again</button>
     <button onclick = 'closeMessage()'>x</button>`;
}

function giveup() {
    console.log('Give up');
    displayGameover('You lost...');
}

//let audioAgain = new Audio('again.mp3');

//darkmode//////////////////////////////////
let modebtn = document.getElementById('modebtn');
function darkmode() {
    document.body.classList.add('dark-mode');
    //document.getElementById('msgbox').classList.add('dark-mode');
    //document.querySelector('.container').classList.add('dark-mode');
    modebtn.setAttribute('onclick', 'daymode()');
    modebtn.innerText = 'Day Mode';
}

function daymode() {
    document.body.classList.remove('dark-mode');
    //document.getElementById('msgbox').classList.remove('dark-mode');
    //document.querySelector('.container').classList.remove('dark-mode');
    modebtn.setAttribute('onclick', 'darkmode()');
    modebtn.innerText = 'Dark Mode';
}

