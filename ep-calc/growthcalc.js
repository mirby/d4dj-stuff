var refreshGrowthSelect;
var refreshGrowthSelect2;

// TODO: These need to get filled out every new growth event, maybe worth adding to event list and parse from there instead
var eventChars = ["Rika", "Marika", "Saori", "Dalia"];
var eventBonus = ["4:phys:1.5","3:tech:2","4:tech:1.5","4:phys:1.5"]

var stepArray = [];

$(document).ready(function() {
    $.refreshGrowthSelect = function() {
        $('.selectpicker#growthselector').selectpicker('refresh');
    };

    $.refreshGrowthSelect2 = function() {
        $('.selectpicker#squareColor').selectpicker('refresh');
    };
});

$(document).on('changed.bs.select', 'select', function(event) {
    if ($(event.target).is("select#growthselector")) {
        fillGrowthDisplay();
    } else if ($(event.target).is("select#charChar")) {
        removeBonusSelect();
        if ($(this).val() === "kurumi" || $(this).val() === "miiko") {
            displayBonusSelect();
        }
    }

    $('.selectpicker').selectpicker('refresh');
});

$(document).on('change keyup', function(event) {
    if ($(event.target).is("input#growthHeart")) {
        calculateTotal();
    } else if ($(event.target).is("input#growthTech")) {
        calculateTotal();
    } else if ($(event.target).is("input#growthPhys")) {
        calculateTotal();
    }
});

function createGrowthSelects() {

    document.getElementById("growthHeartResult").innerHTML = 0;
    document.getElementById("growthTechResult").innerHTML = 0;
    document.getElementById("growthPhysResult").innerHTML = 0;
    document.getElementById("growthTotalResult").innerHTML = 0;

    var label = document.createElement("label");
    label.innerHTML = "Character: ";
    label.htmlFor = "charChar";

    var node = document.getElementById("growthType_wrapper");
    node.appendChild(label);

    var select = bSelect("charChar");

    var tempArr = eventChars.map(i => i + '(event)');
    for (let x of characters.concat(tempArr)) {
        select.appendChild(bOption(x.toLowerCase(), x));
    }

    node.appendChild(select);

    calculateTotal();
}

function addStep(num) {
    var table = document.getElementById("growthStepTable");
    var currentCount = document.getElementById("growthStepBody").childElementCount;
    var text = "";

    if (num == 1) {
        var rarity = document.getElementById("calcRarity").value;
        var et = document.getElementById("calcEt").value;
        var event = document.getElementById("calcEvent").value;
        var move = document.getElementById("calcMove").value;
        var multi = document.getElementById("calcMulti").value;
        var match = document.getElementById("calcMatch").value;
    
        var baseResult = performCalc(rarity, et, event, move, multi);
        var result = 0;
        if (match === "no") {
            result = Math.round(baseResult);
        } else {
            result = Math.round(baseResult * 1.2);
        }

        var param1 = document.getElementById("calcParam").value;
        var param2 = document.getElementById("calcParam2").value;
        text += rarity + " star, lv" + (parseInt(et) + 1) + ", " + event + " event, " + move + " space, " + multi + "x mult, " + match + " char match: +" + result + " " + param1 + " +" + result + " " + param2;

        stepArray.push(param1 + ":" + result);
        stepArray.push(param2 + ":" + result);
    } else if (num == 2) {
        var color = document.getElementById("squareColor").value;
        var param = document.getElementById("squareParam").value;

        if (color === "green") {
            text = cap(color) + " square: +250 " + param;
            stepArray.push(param + ":250");
        } else {
            text = cap(color) + " square: -350 " + param;
            stepArray.push(param + ":-350");
        }
    } else if (num == 3) {
        var char = document.getElementById("charChar").value;
        if (charHeart.includes(char)) {
            text = cap(char) + ": +4% heart";
            stepArray.push("heart:4%");
        } else if (charTech.includes(char)) {
            text = cap(char) + ": +4% tech";
            stepArray.push("tech:4%");
        } else if (charPhys.includes(char)) {
            text = cap(char) + ": +4% phys";
            stepArray.push("phys:4%");
        } else if (charBonus.includes(char)) {
            text = cap(char) + ": 2x bonus effect for 2 turns";
        } else if (char === "kurumi" || char === "miiko") {
            var charSuccess = document.getElementById("charSuccess").value;
            if (charSuccess === "true") {
                text = cap(char) + ": +2.5% all stats"; 
                stepArray.push("heart:2.5%");
                stepArray.push("tech:2.5%");
                stepArray.push("phys:2.5%");
            } else {
                text = cap(char) + ": -2.5% all stats";
                stepArray.push("heart:-2.5%");
                stepArray.push("tech:-2.5%");
                stepArray.push("phys:-2.5%");
            }            
        } else { // event chars
            var eventChar = cap(char.substring(0, char.length-7));
            var index = eventChars.indexOf(eventChar);
            var bonusArr = eventBonus[index].split(":");

            stepArray.push(bonusArr[1] + ":" + bonusArr[0] + "%");

            text = cap(char) + ": " + bonusArr[0] + "% " + bonusArr[1] + ", " + bonusArr[2] + "x bonus effect for 2 turns";
        }
    }

    insertRow(table, currentCount + 1, text);

    calculateTotal();
}

function calculateTotal() {
    var startingHeart = parseInt(document.getElementById("growthHeart").value);
    var startingTech = parseInt(document.getElementById("growthTech").value);
    var startingPhys = parseInt(document.getElementById("growthPhys").value);

    var heartChange = 0;
    var techChange = 0;
    var physChange = 0;

    for (step of stepArray) {
        var param = step.split(":")[0];
        var value = step.split(":")[1];

        console.log("Param: " + param);
        console.log("Value: " + value);

        if (value.includes("%")) {
            var bonusPerc = "";
            if (value.includes("-")) {
                bonusPerc = "-2.5";
            } else {
                bonusPerc = value.substring(0, value.length-1);
            }
            if (param === "heart") {
                var bonus = Math.round(startingHeart * (parseFloat(bonusPerc) / 100));
                startingHeart += bonus;
                heartChange += bonus;
            } else if (param === "tech") {
                var bonus = Math.round(startingTech * (parseFloat(bonusPerc) / 100));
                startingTech += bonus;
                techChange += bonus;
            } else if (param === "phys") {
                var bonus = Math.round(startingPhys * (parseFloat(bonusPerc) / 100));
                startingPhys += bonus;
                physChange += bonus;
            }
        } else {
            var bonus = parseInt(value);
            if (param === "heart") {
                startingHeart += bonus;
                heartChange += bonus;
            } else if (param === "tech") {
                startingTech += bonus;
                techChange += bonus;
            } else if (param === "phys") {
                startingPhys += bonus;
                physChange += bonus;
            }
        }
    }

    var totalChange = heartChange + techChange + physChange;

    document.getElementById("growthHeartResult").innerHTML = startingHeart;
    if (heartChange >= 0) {
        heartChange = "+" + heartChange;
    }
    document.getElementById("heartChange").innerHTML = heartChange;
    document.getElementById("growthTechResult").innerHTML = startingTech;
    if (techChange >= 0) {
        techChange = "+" + techChange;
    }
    document.getElementById("techChange").innerHTML = techChange;
    document.getElementById("growthPhysResult").innerHTML = startingPhys;
    if (physChange >= 0) {
        physChange = "+" + physChange;
    }
    document.getElementById("physChange").innerHTML = physChange;
    document.getElementById("growthTotalResult").innerHTML = startingHeart + startingTech + startingPhys;
    if (totalChange >= 0) {
        totalChange = "+" + totalChange;
    }
    document.getElementById("totalChange").innerHTML = totalChange;
}

// Display extra select for Kurumi/Miiko
function displayBonusSelect() {
    var node = document.getElementById("growthType_wrapper");

    var label = document.createElement("label");
    label.innerHTML = "Success: ";
    label.htmlFor = "charSuccess";

    node.appendChild(label);

    var select = bSelect("charSuccess");
    select.appendChild(bOption("true", "True"));
    select.appendChild(bOption("false", "False"));

    node.appendChild(select);
}

// Remove extra select from Kurumi/Miiko when choosing other chars
function removeBonusSelect() {
    if (document.getElementById("growthType_wrapper").childElementCount > 2) {
        document.getElementById("growthType_wrapper").removeChild(document.getElementById("growthType_wrapper").lastChild);
        document.getElementById("growthType_wrapper").removeChild(document.getElementById("growthType_wrapper").lastChild);
    }
}

function insertRow(tableObj, cell1Text, cell2Text) {
    var row = tableObj.insertRow(cell1Text - 1);
    row.style.borderBottom = "1px solid #000";
    var cell1 = row.insertCell(0);
    cell1.style.borderRight = "1px solid #000";
    cell1.style.width = "100px";
    cell1.style.textAlign = "center";
    var cell2 = row.insertCell(1);
    cell2.style.textAlign = "right";
    cell1.innerHTML = cell1Text;
    cell2.innerHTML = cell2Text;
}

function resetSteps() {
    var node = document.getElementById("growthStepBody");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    stepArray.length = 0;
    calculateTotal();
}

// Calculate param bonus for single action cards
function calcBonus() {
    var rarity = document.getElementById("rarity").value;
    var et = document.getElementById("et").value;
    var event = document.getElementById("event").value;
    var move = document.getElementById("move").value;
    var multi = document.getElementById("multi").value;

    var baseResult = performCalc(rarity, et, event, move, multi);
    var result = Math.round(baseResult);
    var charMatchResult = Math.round(baseResult * 1.2);

    document.getElementById("result").innerHTML = result;
    document.getElementById("result2").innerHTML = result * 2;
    document.getElementById("charResult").innerHTML = charMatchResult;
    document.getElementById("charResult2").innerHTML = charMatchResult * 2;
}

function performCalc(rarity, et, event, move, multi) {
    var baseVal = 0;
    if (rarity === "4") {
        baseVal = 120;
    } else {
        baseVal = 100;
    }

    var etMulti = 1;
    if (et === "1") {
        etMulti = 1.1;
    } else if (et === "2") {
        etMulti = 1.15;
    } else if (et === "3") {
        etMulti = 1.175;
    } else if (et === "4") {
        etMulti = 1.2;
    }

    var eventBonus = 1;
    if (event === "yes") {
        eventBonus = 1.1;
    }

    var moveMulti = parseInt(move);

    var actMulti = parseFloat(multi);

    return baseVal * etMulti * eventBonus * moveMulti * actMulti;
}

// Helper functions

// Capitalize the first letter of a string
function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Build a Select object
function bSelect(name) {
    var select = document.createElement("select");
    select.name = name;
    select.id = name;
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","false");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    return select;
}

// Build an Option object
function bOption(value, name) {
    var option = document.createElement("option");
    option.value = value;
    option.setAttribute("data-content", name);
    return option;
}

var charHeart = ["rinku", "muni", "esora", "towa", "noa", "tsubaki", "michiru"];
var charTech = ["rei", "shinobu", "saki", "saori", "hiiro", "haruna"];
var charPhys = ["maho", "yuka", "ibuki", "rika", "dalia", "nagisa"];
var charBonus = ["kyoko", "marika", "aoi", "miyu"];
var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", "Noa", "Rika", "Marika", "Saori", "Dalia", 
                    "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru"];