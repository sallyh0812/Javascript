"use strict";
const checkboxes = document.querySelectorAll("input[type='checkbox']");

//get the answer
function getAns() {
    var ans = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            //remove non-digit char and get the integer part
            var i = parseInt(checkbox.name.replace(/\D/g, ''), 10);
            //console.log(i);
            ans += Math.pow(2, i-1); //card1 => 2^0, card2 => 2^1, ...
        } else {
            ans += 0;
        }
    });
    alert(`你想的數字是 ${ans} `);
    location.reload(); //refresh the page
}

//clear all checked card
function clearAll() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        var name = checkbox.name;
        var card = document.getElementById(name);
        //Revert back to default color
        card.style.backgroundColor = 'white';
        card.style.color = 'black';
    });
}

//change color when checked
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        var name = checkbox.name;
        var card = document.getElementById(name);
        if (checkbox.checked) {
            card.style.backgroundColor = 'rgba(0, 156, 78, 1)'; //Change to desired color when checked
            card.style.color = 'white';
        } else {
            card.style.backgroundColor = 'white'; //Revert back to default color
            card.style.color = 'black';
        }
    })
});