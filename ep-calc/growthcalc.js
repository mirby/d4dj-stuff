function test() {
    var rarity = document.getElementById("rarity").value;
    var et = document.getElementById("et").value;
    var event = document.getElementById("event").value;
    var move = document.getElementById("move").value;
    var multi = document.getElementById("multi").value;

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
    console.log(etMulti);

    var eventBonus = 1;
    if (event === "y") {
        eventBonus = 1.1;
    }
    console.log(eventBonus);

    var moveMulti = parseInt(move);
    console.log(moveMulti);

    var actMulti = parseFloat(multi);
    console.log(actMulti);

    var result = Math.floor(baseVal * etMulti * eventBonus * moveMulti * actMulti);
    var charMatchResult = Math.floor(baseVal * etMulti * eventBonus * moveMulti * actMulti * 1.2);

    document.getElementById("result").innerHTML = result;
    document.getElementById("charResult").innerHTML = charMatchResult;
}