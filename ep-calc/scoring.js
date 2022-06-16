jQuery(function($) {
    $('#calculateteam').on('click', function() {
        // TODO add validations for all the input fields
        calcByPower();
    });

    $('#calculatescore').on('click', function() {
        calcByScore();
    });

    $('#importteam').on('click', function() {
        importTeam();
    });

    $('#importteam2').on('click', function() {
        importTeam2();
    });
});

function calcByPower() {

    // Remove the old table rows
    var node = document.getElementById("outputtbody");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    var node = document.getElementById("outputtbody2");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    // Calculate the score based on the event type
    var type = document.getElementById("eventsel").value.toLowerCase();
    var scoreMap = calculateScore(type);
    var score = 0;
    
    if (type === "bingo") {
        score = scoreMap.get("scoreSolo2");
    } else {
        score = scoreMap.get("score");
    }
    
    var bonus = (parseInt(document.getElementById("teambonus").value) / 100) + 1;
    var param = Math.floor(parseInt(document.getElementById("paramselout").value) / 600);
    var volts = parseInt(document.getElementById("voltsel").value);
    var roomscore = parseInt(document.getElementById("roomscorein").value);
    if (isNaN(roomscore) || roomscore == 0) {
        roomscore = score * 4;
    }

    var valueMap = calculateEp(type, scoreMap, bonus, param, volts, roomscore);

    var table = document.getElementById("outputtable");
    valueMap.forEach(function(value, key) {
        insertRow(table, key, value);
    });

    insertRow(table, "Song", scoreMap.get("song"));
    insertRow(table, "Event Type", type.charAt(0).toUpperCase() + type.slice(1));
}

function calcByScore() {

    // Remove the old table rows
    var node = document.getElementById("outputtbody");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    var node = document.getElementById("outputtbody2");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    // Get values
    var score = parseInt(document.getElementById("scorein").value);
    var bonus = (parseInt(document.getElementById("teambonus2").value) / 100) + 1;
    var param = Math.floor(parseInt(document.getElementById("paramselout2").value) / 600);
    var volts = parseInt(document.getElementById("voltsel2").value);
    var type = document.getElementById("eventsel2").value.toLowerCase();
    var roomscore = parseInt(document.getElementById("roomscorein2").value);
    if (isNaN(roomscore) || roomscore == 0) {
        roomscore = score * 4;
    }

    var valueMap = calculateEpScore(type, score, bonus, param, volts, roomscore);

    var table = document.getElementById("outputtable2");
    valueMap.forEach(function(value, key) {
        insertRow(table, key, value);
    });

    insertRow(table, "Event Type", type.charAt(0).toUpperCase() + type.slice(1));
}

function calculateEp(type, scoreMap, bonus, param, volts, roomscore) {
    var valueMap = new Map();
    var result = 0;
    var scoreSolo = scoreMap.get("scoreSolo");
    var scoreSolo2 = scoreMap.get("scoreSolo2");
    var score = scoreMap.get("score");

    switch(type) {
        case "poker":
            result = volts * Math.floor(bonus * (30 + Math.floor(score / 10000)));
            valueMap.set("Bet Coins", result);

            result = volts * Math.floor(bonus * (50 + Math.floor(score / 4000) + param));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(bonus * (50 + Math.floor(scoreSolo / 4000) + param));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "slots":
            result = volts * Math.floor(bonus * (150 + Math.floor(score / 8000)));
            valueMap.set("Slot Medals", result);

            result = volts * Math.floor(bonus * (50 + Math.floor(score / 4000) + param));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(bonus * (50 + Math.floor(scoreSolo / 4000) + param));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "medley":
            result = Math.floor(bonus * (100 + Math.floor(scoreSolo2 / 1000) + param));
            valueMap.set("Task Medley EP (100 tickets)", result);

            valueMap.set("Task Medley Score (Estimated)", scoreSolo2);

            result = volts * (15 + Math.floor(score / 50000));
            var result2 = volts * (20 + Math.floor(score / 50000));
            valueMap.set("Challenge Tickets", (result || "-") + "-" + (result2 || "-"));

            result = volts * Math.floor(bonus * (10 + Math.floor(score / 10000) + Math.max(10, Math.floor(roomscore / 80000)) + param));
            valueMap.set("Multi-Medley Live EP", result);

            result = volts * Math.floor(bonus * (10 + Math.floor(score / 15000) + param));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(bonus * (10 + Math.floor(scoreSolo / 15000) + param));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "bingo":
            result = volts * Math.floor(bonus * (110 + Math.max(10, Math.floor(scoreSolo2 / 10000)) + param));
            valueMap.set("Battle Live EP (Fourth)", result);

            result = volts * Math.floor(bonus * (125 + Math.max(10, Math.floor(scoreSolo2 / 10000)) + param));
            valueMap.set("Battle Live EP (Third)", result);

            result = volts * Math.floor(bonus * (135 + Math.max(10, Math.floor(scoreSolo2 / 10000)) + param));
            valueMap.set("Battle Live EP (Second)", result);

            result = volts * Math.floor(bonus * (150 + Math.max(10, Math.floor(scoreSolo2 / 10000)) + param));
            valueMap.set("Battle Live EP (First)", result);

            valueMap.set("Battle Live Score (Estimated)", scoreSolo2);

            result = volts * Math.floor(bonus * (Math.max(10, Math.floor(score / 10000)) + param));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(bonus * (Math.max(10, Math.floor(scoreSolo / 10000)) + param));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "raid":
            result = volts * (300 + Math.floor(score / 6000));
            valueMap.set("Multi Live EP (1st Anni/Precure/NBC)", result);

            result = volts * Math.floor(bonus * (50 + Math.floor(score / 10000) + param));
            valueMap.set("Multi Live EP (D4FES)", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * (300 + Math.floor(scoreSolo / 6000));
            valueMap.set("Free Live EP (1st Anni/Precure/NBC)", result);

            result = volts * Math.floor(bonus * (50 + Math.floor(scoreSolo / 10000) + param));
            valueMap.set("Free Live EP (D4FES)", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
    }
    
    return valueMap;
}

function calculateEpScore(type, score, bonus, param, volts, roomscore) {
        var valueMap = new Map();
        var result = 0;

        switch(type) {
            case "poker":
                result = volts * Math.floor(bonus * (30 + Math.floor(score / 10000)));
                valueMap.set("Bet Coins", result);

                result = volts * Math.floor(bonus * (50 + Math.floor(score / 4000) + param));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "slots":
                result = volts * Math.floor(bonus * (150 + Math.floor(score / 8000)));
                valueMap.set("Slot Medals", result);

                result = volts * Math.floor(bonus * (50 + Math.floor(score / 4000) + param));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "medley":
                result = Math.floor(bonus * (100 + Math.floor(score / 1000) + param));
                valueMap.set("Task Medley EP", result);

                result = volts * (15 + Math.floor(score / 50000));
                var result2 = volts * (20 + Math.floor(score / 50000));
                valueMap.set("Challenge Tickets", (result || "-") + "-" + (result2 || "-"));

                result = volts * Math.floor(bonus * (10 + Math.floor(score / 10000) + Math.max(10, Math.floor(roomscore / 80000)) + param));
                valueMap.set("Multi-Medley Live EP", result);

                result = volts * Math.floor(bonus * (10 + Math.floor(score / 15000) + param));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "bingo":
                result = volts * Math.floor(bonus * (110 + Math.max(10, Math.floor(score / 10000)) + param));
                valueMap.set("Battle Live EP (Fourth)", result);

                result = volts * Math.floor(bonus * (125 + Math.max(10, Math.floor(score / 10000)) + param));
                valueMap.set("Battle Live EP (Third)", result);
    
                result = volts * Math.floor(bonus * (135 + Math.max(10, Math.floor(score / 10000)) + param));
                valueMap.set("Battle Live EP (Second)", result);

                result = volts * Math.floor(bonus * (150 + Math.max(10, Math.floor(score / 10000)) + param));
                valueMap.set("Battle Live EP (First)", result);

                result = volts * Math.floor(bonus * (Math.max(10, Math.floor(score / 10000)) + param));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "raid":
                result = volts * (300 + Math.floor(score / 6000));
                valueMap.set("Free Live/Multi Live EP (1st Anni/Precure/NBC)", result);

                result = volts * Math.floor(bonus * (50 + Math.floor(score / 10000) + param));
                valueMap.set("Free Live/Multi Live EP (D4FES)", result);

                break;
        }
        
        return valueMap;
}

function calculateScore(type) {
    var power = document.getElementById("powerin").value;
    var power2 = document.getElementById("powerin2").value;
    if (isNaN(power2) || power2 == 0) {
        power2 = power;
    }
    var skills = document.getElementById("skillin").value;
    var skillsList = [];
    skillsList = skills.split(",");

    // Whatever the highest skill is, add it as the 5th skill
    var highest = 0;
    skillsList.forEach((x) => {
        if (x > highest) {
            highest = x;
        }
    });
    skillsList.push(highest);

    // Get passive skills
    var gtboost = ((parseInt(document.getElementById("pass_gt").value) / 100) || 0) + 1;
    var lifeboost = (parseInt(document.getElementById("pass_life").value) / 100) || 0;
    var scoreupboost = (parseInt(document.getElementById("pass_scoreup").value) / 100) || 0;
    //var autoboost = (parseInt(document.getElementById("pass_auto").value) / 100) + 1;
    var autoboost = 1;
    lifeboost = lifeboost + scoreupboost + 1;

    var scoreMap = new Map();
    var scoreSolo = 0; // Free Live
    var scoreSolo2 = 0; // Bingo/Task Medley
    var scoreAutoSolo = 0; // Free Live - Auto
    var score = 0; // Multi w/ GT
    var scoreAuto = 0; // Multi w/ GT - Auto

    var chart = {};

    switch(type) {
        case "poker":
        case "slots":
        case "raid":
            chart = cats;
            break;
        case "bingo":
            chart = htl;
            break;
        case "medley":
            chart = directmedley;
            break;
    }

    var totalNotes = chart.totalNotes;
    var feverNotes = chart.feverNotes;
    var level = chart.level;

    var levelConstant = (95 + level) / 100;
    var baseNoteScore = (levelConstant * power * 3 * lifeboost) / totalNotes;
    var baseNoteScore2 = (levelConstant * power2 * 3 * lifeboost) / totalNotes;
    var autoNoteScore = (levelConstant * power * 3 * .85 * lifeboost * autoboost) / totalNotes;
    var feverMultiplier = Math.max(1.1, Math.min(2 * ((0.28 / (feverNotes / totalNotes)) ** 0.6), 5)) * gtboost;

    chart.sections.forEach((x) => {
        var skill = 1;
        if (x.skill != 0) {
            skill = (skillsList[x.skill-1] / 100) + 1;
        }
        var feverMult = 1;
        if (x.gt) {
            feverMult = feverMultiplier;
        }

        scoreSolo += Math.floor(baseNoteScore * skill * x.comboMult) * x.notes;
        scoreSolo2 += Math.floor(baseNoteScore2 * skill * x.comboMult) * x.notes;
        scoreAutoSolo += Math.floor(autoNoteScore * skill) * x.notes;
        score += Math.floor(baseNoteScore * skill * x.comboMult * feverMult) * x.notes;
        scoreAuto += Math.floor(autoNoteScore * skill * feverMult) * x.notes;
    });

    scoreMap.set("song", chart.name);
    scoreMap.set("scoreSolo", scoreSolo);
    scoreMap.set("scoreSolo2", scoreSolo2);
    scoreMap.set("scoreAutoSolo", scoreAutoSolo);
    scoreMap.set("score", score);
    scoreMap.set("scoreAuto", scoreAuto);

    return scoreMap;
}

function importTeam() {
    var power = parseInt(document.getElementById("power_totalwo").innerHTML);
    var power_event = parseInt(document.getElementById("power_total").innerHTML);
    var eventtype = document.getElementById("eventtype").innerHTML;
    var paramtype = document.getElementById("eventparamval").innerHTML;
    var param = document.getElementById("paramtotal_" + paramtype.toLowerCase()).innerHTML;

    var skillList = "";
    var bonus = 0;
    // Get team skills and bonus
    for (let i = 1; i <= 4; i++) {
        skillList += document.getElementById("m" + i + "_skill").innerHTML.slice(0, -1) + ",";
        bonus += parseFloat(document.getElementById("m" + i + "_eventperc").innerHTML);
    }
    skillList = skillList.slice(0, -1).split(",").sort().join(",");

    if (power != 0) {
        document.getElementById("powerin").value = power;
    } else {
        document.getElementById("powerin").value = 250000;
    }

    if (power_event != 0) {
        document.getElementById("powerin2").value = power_event;
    } else {
        document.getElementById("powerin2").value = 300000;
    }

    if (param != 0) {
        document.getElementById("paramselout").value = param;
    } else {
        document.getElementById("paramselout").value = 75000;
    }

    if (bonus != 0) {
        document.getElementById("teambonus").value = (bonus * 1000) / 10;
    } else {
        document.getElementById("teambonus").value = 200;
    }
    
    if (skillList !== "" && skillList !== ",,,") {
        document.getElementById("skillin").value = skillList;
    } else {
        document.getElementById("skillin").value = "50,50,50,50";
    }

    $("select[name=eventsel]").val(eventtype.toLowerCase());
    $('.selectpicker#eventsel').selectpicker('refresh');
}

function importTeam2() {
    var eventtype = document.getElementById("eventtype").innerHTML;
    var paramtype = document.getElementById("eventparamval").innerHTML;
    var param = document.getElementById("paramtotal_" + paramtype.toLowerCase()).innerHTML;

    var bonus = 0;
    for (let i = 1; i <= 4; i++) {
        bonus += parseFloat(document.getElementById("m" + i + "_eventperc").innerHTML);
    }

    if (param != 0) {
        document.getElementById("paramselout2").value = param;
    } else {
        document.getElementById("paramselout2").value = 75000;
    }

    if (bonus != 0) {
        document.getElementById("teambonus2").value = (bonus * 1000) / 10;
    } else {
        document.getElementById("teambonus2").value = 200;
    }

    $("select[name=eventsel2]").val(eventtype.toLowerCase());
    $('.selectpicker#eventsel2').selectpicker('refresh');
}

function insertRow(tableObj, cell1Text, cell2Text) {
    var row = tableObj.insertRow(0);
    row.style.borderBottom = "1px solid #000";
    var cell1 = row.insertCell(0);
    cell1.style.borderRight = "1px solid #000";
    var cell2 = row.insertCell(1);
    cell2.style.textAlign = "right";
    cell1.innerHTML = cell1Text;
    cell2.innerHTML = cell2Text;
}
