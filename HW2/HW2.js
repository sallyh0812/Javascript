"use strict";

function openNav() {
    let nav = document.getElementById("navbar-collapse");
    if (document.querySelector(".show")){
        nav.classList.remove("show");
    }
    else{
        nav.classList.add("show");
    }
}

//445,420,465,450
function find_correct1() {
    let pic = document.getElementById("findme-map")
    alert("Correct!");
    pic.setAttribute("src", "./380909.jpg");
    let area = document.querySelector("area");
    area.setAttribute("coords", "400,380,435,430");
    area.setAttribute("onclick", "find_correct2()");
}

function find_correct2(){
    let pic = document.getElementById("findme-map")
    alert("Correct!");
    pic.setAttribute("src", "./380908.jpg");
    let area = document.querySelector("area");
    area.setAttribute("coords", "202,370,230,410");
    area.setAttribute("onclick", "find_correct3()");
}
function find_correct3(){
    let pic = document.getElementById("findme-map")
    alert("Correct!");
    pic.setAttribute("src", "./380883.jpg");
    let area = document.querySelector("area");
    area.setAttribute("coords", "320,110,430,260");
    area.setAttribute("onclick", "find_correct4()");
}

function find_correct4(){
    let pic = document.getElementById("findme-map")
    alert("Correct!");
    pic.setAttribute("src", "./DSC09604.jpg");
    let area = document.querySelector("area");
    area.setAttribute("coords", "822,312,840,340");
    area.setAttribute("onclick", "find_correct5()");
}

function find_correct5(){
    let pic = document.getElementById("findme-map")
    alert("You've done a great job🤩");
    pic.setAttribute("src", "./380891.jpg");
    let area = document.querySelector("area");
    area.setAttribute("coords", "445,420,465,450");
    area.setAttribute("onclick", "find_correct1()");
}

function find_wrong(){
    alert("Wrong! I'll give you another try. You'd better get it :(");
}