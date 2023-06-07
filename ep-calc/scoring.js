var refreshSelect;

$(document).ready(function() {
    $.refreshSelect = function() {
        $('.selectpicker#eventchars').selectpicker('refresh');
    };
});

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
    var param = (parseInt(document.getElementById("paramselout").value) / 100) + 1;
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
    var param = (parseInt(document.getElementById("paramselout2").value) / 100) + 1;
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
    var scoreSolo3 = scoreMap.get("scoreSolo3");
    var scoreAuto = scoreMap.get("scoreAuto");
    var scoreAuto2 = scoreMap.get("scoreAuto2");
    var scoreAutoSolo2 = scoreMap.get("scoreAutoSolo2");
    var scoreAutoSolo3 = scoreMap.get("scoreAutoSolo3");
    var score = scoreMap.get("score");
    var score2 = scoreMap.get("score2");

    switch(type) {
        case "poker":
            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(scoreAuto / 4000))));
            valueMap.set("Multi Live EP - Auto", result);

            valueMap.set("Multi Live Score - Auto (Estimated)", scoreAuto);

            result = volts * Math.floor(bonus * (30 + Math.floor(score / 10000)));
            valueMap.set("Bet Coins", result);

            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(score / 4000))));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(scoreSolo / 4000))));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "slots":
            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(scoreAuto / 4000))));
            valueMap.set("Multi Live EP - Auto", result);

            valueMap.set("Multi Live Score - Auto (Estimated)", scoreAuto);

            result = volts * Math.floor(bonus * (150 + Math.floor(score / 8000)));
            valueMap.set("Slot Medals", result);

            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(score / 4000))));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(scoreSolo / 4000))));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "medley":
            result = Math.floor(param * Math.floor(bonus * (100 + Math.floor(scoreSolo2 / 1000))));
            valueMap.set("Task Medley EP (100 tickets)", result);

            valueMap.set("Task Medley Score (Estimated)", scoreSolo2);

            result = volts * (15 + Math.floor(scoreAuto / 50000));
            var result2 = volts * (20 + Math.floor(scoreAuto / 50000));
            valueMap.set("Challenge Tickets - Auto", (result || "-") + "-" + (result2 || "-"));

            var roomscoreAuto = scoreAuto * 4;
            result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(scoreAuto / 10000) + Math.max(10, Math.floor(roomscoreAuto / 80000)))));
            valueMap.set("Multi-Medley Live EP - Auto", result);

            valueMap.set("Multi-Medley Live Score - Auto (Estimated)", scoreAuto);

            result = volts * (15 + Math.floor(score / 50000));
            result2 = volts * (20 + Math.floor(score / 50000));
            valueMap.set("Challenge Tickets", (result || "-") + "-" + (result2 || "-"));

            result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(score / 10000) + Math.max(10, Math.floor(roomscore / 80000)))));
            valueMap.set("Multi-Medley Live EP", result);

            result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(score / 15000))));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(scoreSolo / 15000))));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "bingo":
            result = volts * Math.floor(param * Math.floor(bonus * (150 + Math.max(10, Math.floor(scoreAutoSolo2 / 8000)))));
            valueMap.set("Battle Live EP - Auto (First)", result);

            valueMap.set("Battle Live Score - Auto (Estimated)", scoreAutoSolo2);

            result = volts * Math.floor(param * Math.floor(bonus * (110 + Math.max(10, Math.floor(scoreSolo2 / 8000)))));
            valueMap.set("Battle Live EP (Fourth)", result);

            result = volts * Math.floor(param * Math.floor(bonus * (125 + Math.max(10, Math.floor(scoreSolo2 / 8000)))));
            valueMap.set("Battle Live EP (Third)", result);

            result = volts * Math.floor(param * Math.floor(bonus * (135 + Math.max(10, Math.floor(scoreSolo2 / 8000)))));
            valueMap.set("Battle Live EP (Second)", result);

            result = volts * Math.floor(param * Math.floor(bonus * (150 + Math.max(10, Math.floor(scoreSolo2 / 8000)))));
            valueMap.set("Battle Live EP (First)", result);

            valueMap.set("Battle Live Score (Estimated)", scoreSolo2);

            result = volts * Math.floor(param * Math.floor(bonus * (Math.max(10, Math.floor(score / 8000)))));
            valueMap.set("Multi Live EP", result);

            valueMap.set("Multi Live Score (Estimated)", score);

            result = volts * Math.floor(param * Math.floor(bonus * (Math.max(10, Math.floor(scoreSolo / 8000)))));
            valueMap.set("Free Live EP", result);

            valueMap.set("Free Live Score (Estimated)", scoreSolo);

            break;
        case "raid":
            result = 7 * (300 + Math.floor(scoreAutoSolo3 / 2000));
            valueMap.set("Special Solo Live EP - Auto", result);

            valueMap.set("Special Solo Live Score - Auto (Estimated)", scoreAutoSolo3);

            result = 7 * (300 + Math.floor(scoreSolo3 / 2000));
            valueMap.set("Special Solo Live EP", result);

            valueMap.set("Special Solo Live Score (Estimated)", scoreSolo3);

            result = volts * (100 + Math.floor(scoreAuto2 / 4000));
            valueMap.set("(Raid) Multi Live EP - Auto", result);

            valueMap.set("(Raid) Multi Live Score - Auto (Estimated)", scoreAuto2);

            result = volts * (100 + Math.floor(score2 / 4000));
            valueMap.set("(Raid) Multi Live EP", result);

            valueMap.set("(Raid) Multi Live Score (Estimated)", score2);

            result = volts * (100 + Math.floor(scoreSolo2 / 4000));
            valueMap.set("(Raid) Free Live EP", result);

            valueMap.set("(Raid) Free Live Score (Estimated)", scoreSolo2);

            // result = volts * Math.floor(bonus * (50 + Math.floor(scoreAuto / 10000) + param));
            // valueMap.set("D4FES - Multi Live EP - Auto", result);

            // valueMap.set("D4FES - Multi Live Score - Auto (Estimated)", scoreAuto);

            // result = volts * Math.floor(bonus * (50 + Math.floor(score / 10000) + param));
            // valueMap.set("D4FES - Multi Live EP", result);

            // valueMap.set("D4FES - Multi Live Score (Estimated)", score);

            // result = volts * Math.floor(bonus * (50 + Math.floor(scoreSolo / 10000) + param));
            // valueMap.set("D4FES - Free Live EP", result);

            // valueMap.set("D4FES - Free Live Score (Estimated)", scoreSolo);

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

                result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(score / 4000))));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "slots":
                result = volts * Math.floor(bonus * (150 + Math.floor(score / 8000)));
                valueMap.set("Slot Medals", result);

                result = volts * Math.floor(param * Math.floor(bonus * (50 + Math.floor(score / 4000))));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "medley":
                result = Math.floor(param * Math.floor(bonus * (100 + Math.floor(score / 1000))));
                valueMap.set("Task Medley EP", result);

                result = volts * (15 + Math.floor(score / 50000));
                var result2 = volts * (20 + Math.floor(score / 50000));
                valueMap.set("Challenge Tickets", (result || "-") + "-" + (result2 || "-"));

                result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(score / 10000) + Math.max(10, Math.floor(roomscore / 80000)))));
                valueMap.set("Multi-Medley Live EP", result);

                result = volts * Math.floor(param * Math.floor(bonus * (10 + Math.floor(score / 15000))));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "bingo":
                result = volts * Math.floor(param * Math.floor(bonus * (110 + Math.max(10, Math.floor(score / 8000)))));
                valueMap.set("Battle Live EP (Fourth)", result);

                result = volts * Math.floor(param * Math.floor(bonus * (125 + Math.max(10, Math.floor(score / 8000)))));
                valueMap.set("Battle Live EP (Third)", result);
    
                result = volts * Math.floor(param * Math.floor(bonus * (135 + Math.max(10, Math.floor(score / 8000)))));
                valueMap.set("Battle Live EP (Second)", result);

                result = volts * Math.floor(param * Math.floor(bonus * (150 + Math.max(10, Math.floor(score / 8000)))));
                valueMap.set("Battle Live EP (First)", result);

                result = volts * Math.floor(param * Math.floor(bonus * (Math.max(10, Math.floor(score / 8000)))));
                valueMap.set("Free Live/Multi Live EP", result);

                break;
            case "raid":
                result = 7 * (300 + Math.floor(score / 2000));
                valueMap.set("Special Solo Live EP", result);

                result = volts * (100 + Math.floor(score / 4000));
                valueMap.set("(Raid) Free Live/Multi Live EP", result);

                // result = volts * Math.floor(bonus * (50 + Math.floor(score / 10000) + param));
                // valueMap.set("Free Live/Multi Live EP (D4FES)", result);

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
    var power3 = power;
    var power3 = document.getElementById("powerin3").value;
    if (isNaN(power3) || power3 == 0) {
        power3 = power;
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

    // FIXME: Replaces all instances of 80 with 60. 80 skills have a different duration and I can't fix it easily, so treat it as a 60 value
    skillsList.forEach(function(item, i) { if (item == 80) skillsList[i] = 60; });

    // Get event bonus power if raid for the target Support Live room
    var bonusPower = getBonusPower(type);
    power2 = parseInt(power2) + parseInt(bonusPower);
    
    // Get passive skills
    var gtboost = ((parseFloat(document.getElementById("pass_gt").value) / 100) || 0) + 1;
    var lifeboost = (parseFloat(document.getElementById("pass_life").value) / 100) || 0;
    var scoreupboost = (parseFloat(document.getElementById("pass_scoreup").value) / 100) || 0;
    var skillDuration = (parseInt(document.getElementById("pass_skilldur").value)) || 0;
    if (![0, 10, 15, 20, 25, 30, 35, 40, 45].includes(skillDuration)) {
        skillDuration = 0;
    }
    var autoboost = ((parseFloat(document.getElementById("pass_auto").value) / 100) || 0) + 1;
    var manualBoost = ((parseFloat(document.getElementById("pass_manual").value) / 100) || 0) + 1;
    lifeboost = lifeboost + scoreupboost + 1;

    var scoreMap = new Map();
    var scoreSolo = 0; // Free Live
    var scoreSolo2 = 0; // Bingo/Task Medley
    var scoreSolo3 = 0; // Super dengeki live
    var scoreAutoSolo = 0; // Free Live - Auto
    var scoreAutoSolo2 = 0; // Bingo/Task Medley - Auto
    var scoreAutoSolo3 = 0; // Super dengeki live - Auto
    var score = 0; // Multi w/ GT
    var score2 = 0; // Multi with event power w/ GT (raids)
    var scoreAuto = 0; // Multi w/ GT - Auto
    var scoreAuto2 = 0; // Multi with event power w/ GT - Auto (raids)

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
    var baseNoteScore = (levelConstant * power * 3 * lifeboost * manualBoost) / totalNotes;
    var baseNoteScore2 = (levelConstant * power2 * 3 * lifeboost * manualBoost) / totalNotes;
    var baseNoteScore3 = (levelConstant * power3 * 3 * lifeboost * manualBoost) / totalNotes;
    var autoNoteScore = (levelConstant * power * 3 * .85 * lifeboost * autoboost) / totalNotes;
    var autoNoteScore2 = (levelConstant * power2 * 3 * .85 * lifeboost * autoboost) / totalNotes;
    var autoNoteScore3 = (levelConstant * power3 * 3 * .85 * lifeboost * autoboost) / totalNotes;
    var feverMultiplier = Math.max(1.1, Math.min(2 * ((0.28 / (feverNotes / totalNotes)) ** 0.6), 5)) * gtboost;

    for (let i = 1; i <= totalNotes; i++) {

        // Combo multiplier
        var comboMult = getComboMult(i);
        
        // Skills
        var skill = 1;
        if (i >= chart.s1Start && i < (chart.s1Start + chart["s1_" + skillDuration + "_Notes"])) {
            skill = (skillsList[0] / 100) + 1;
        } else if (i >= chart.s2Start && i < (chart.s2Start + chart["s2_" + skillDuration + "_Notes"])) {
            skill = (skillsList[1] / 100) + 1;
        } else if (i >= chart.s3Start && i < (chart.s3Start + chart["s3_" + skillDuration + "_Notes"])) {
            skill = (skillsList[2] / 100) + 1;
        } else if (i >= chart.s4Start && i < (chart.s4Start + chart["s4_" + skillDuration + "_Notes"])) {
            skill = (skillsList[3] / 100) + 1;
        } else if (i >= chart.s5Start && i < (chart.s5Start + chart["s5_" + skillDuration + "_Notes"])) {
            skill = (skillsList[4] / 100) + 1;
        }

        // Groovy Time
        var feverMult = 1;
        if (i >= chart.gtStart && i < (chart.gtStart + feverNotes)) {
            feverMult = feverMultiplier;
        }

        scoreSolo += Math.floor(baseNoteScore * skill * comboMult);
        scoreSolo2 += Math.floor(baseNoteScore2 * skill * comboMult);
        scoreSolo3 += Math.floor(baseNoteScore3 * skill * comboMult);
        scoreAutoSolo += Math.floor(autoNoteScore * skill);
        scoreAutoSolo2 += Math.floor(autoNoteScore2 * skill);
        scoreAutoSolo3 += Math.floor(autoNoteScore3 * skill);
        score += Math.floor(baseNoteScore * skill * comboMult * feverMult);
        score2 += Math.floor(baseNoteScore2 * skill * comboMult * feverMult);
        scoreAuto += Math.floor(autoNoteScore * skill * feverMult);
        scoreAuto2 += Math.floor(autoNoteScore2 * skill * feverMult);
    }

    scoreMap.set("song", chart.name);
    scoreMap.set("scoreSolo", scoreSolo);
    scoreMap.set("scoreSolo2", scoreSolo2);
    scoreMap.set("scoreSolo3", scoreSolo3);
    scoreMap.set("scoreAutoSolo", scoreAutoSolo);
    scoreMap.set("scoreAutoSolo2", scoreAutoSolo2);
    scoreMap.set("scoreAutoSolo3", scoreAutoSolo3);
    scoreMap.set("score", score);
    scoreMap.set("score2", score2);
    scoreMap.set("scoreAuto", scoreAuto);
    scoreMap.set("scoreAuto2", scoreAuto2);

    return scoreMap;
}

// Get bonus power for Raid bonus room
function getBonusPower(eventType) {
    var bonusPower = 0;
    if (eventType === "raid") {
        var character = document.getElementById("eventchars").value.toLowerCase();
        for (let i = 1; i <= 4; i++) {
            var char = document.getElementById("m" + i + "_char").innerHTML;
            if (char === character) {
                var cardpower = document.getElementById("m" + i + "_cardpower").innerHTML;
                var eventbonus = document.getElementById("m" + i + "_eventbonus").innerHTML;

                // If the card power matches the event bonus, it means it's a collab card, and gets an extra 50% bonus for playing in the support room
                if (cardpower == eventbonus) {
                    var eventPerc = .5;
                    var heartMod = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
                    var techMod = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
                    var physMod = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;
            
                    var heart = Math.floor(parseInt(heartMod) * eventPerc);
                    var tech = Math.floor(parseInt(techMod) * eventPerc);
                    var phys = Math.floor(parseInt(physMod) * eventPerc);
                    bonusPower = heart + tech + phys;
                }
            }
        }
    }

    return bonusPower;
}

function getComboMult(num) {
    if (num <= 20) {
        return 1.00;
    } else if (num <= 50) {
        return 1.01;
    } else if (num <= 100) {
        return 1.02;
    } else if (num <= 150) {
        return 1.03;
    } else if (num <= 200) {
        return 1.04;
    } else if (num <= 250) {
        return 1.05;
    } else if (num <= 300) {
        return 1.06;
    } else if (num <= 400) {
        return 1.07;
    } else if (num <= 500) {
        return 1.08;
    } else if (num <= 600) {
        return 1.09;
    } else if (num <= 700) {
        return 1.10;
    } else {
        return 1.11;
    }
}

function importTeam() {
    var power = parseInt(document.getElementById("power_totalwo").innerHTML);
    var power_event = parseInt(document.getElementById("power_total").innerHTML);

    // Get power for super dengeki
    var power_event_dengeki = power;
    for (let i = 1; i <= 4; i++) {
        power_event_dengeki += parseInt(document.getElementById("m" + i + "_eventbonus2").innerHTML);
    }

    var eventtype = document.getElementById("eventtype").innerHTML.toLowerCase();

    displayEventBonus(eventtype);

    var paramtype = document.getElementById("eventparamval").innerHTML;
    if (paramtype === "None") {
        paramtype = "heart";
    }
    var param = document.getElementById("paramtotal_" + paramtype.toLowerCase() + "ep").innerHTML.slice(0, -1);

    var skillList = "";
    var bonus = 0;
    var highestSkill = 0;
    // Get team skills and bonus
    for (let i = 1; i <= 4; i++) {
        var skill = document.getElementById("m" + i + "_skill").innerHTML.slice(0, -1);

        // If the card is Navigation, need to calculate how much actual skill it is
        var cardname = document.getElementById("m" + i + "_charfull").innerHTML;
        if (cardname.includes("Navigation")) {
            var currUnit = document.getElementById("m" + i + "_unit").innerHTML;
            var counter = 0;
            for (let j = 1; j <= 4; j++) {
                if (i == j) {
                    continue;
                } else {
                    var otherUnit = document.getElementById("m" + j + "_unit").innerHTML;
                    if (otherUnit === currUnit) {
                        counter++;
                    }
                }
            }
            if (counter == 1) {
                skill = "55";
            } else if (counter == 2) {
                skill = "60";
            } else if (counter == 3) {
                skill = "65";
            }
        }

        if (parseInt(skill) > highestSkill) {
            highestSkill = parseInt(skill);
        }
        skillList += skill + ",";
        bonus += parseFloat(document.getElementById("m" + i + "_eventperc").innerHTML);
        bonus = parseFloat(bonus.toFixed(2));
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

    if (power_event_dengeki != 0) {
        document.getElementById("powerin3").value = power_event_dengeki;
    } else {
        document.getElementById("powerin3").value = 400000;
    }

    // Don't import param when raid type
    if (eventtype === "raid") {
        document.getElementById("paramselout").value = 0;
    } else {
        document.getElementById("paramselout").value = param;
    }

    if (isNaN(bonus)) {
        bonus = 0;
    }
    document.getElementById("teambonus").value = (bonus * 1000) / 10;
    
    if (skillList !== "" && skillList !== ",,,") {
        if (eventtype === "poker" || eventtype === "slots" || eventtype === "raid") {
            document.getElementById("skillin").value = highestSkill + "," + highestSkill + "," + highestSkill + "," + highestSkill;
        } else {
            document.getElementById("skillin").value = skillList;
        }        
    } else {
        document.getElementById("skillin").value = "50,50,50,50";
    }

    $("select[name=eventsel]").val(eventtype);
    $('.selectpicker#eventsel').selectpicker('refresh');

    // Import passives
    var groovyBonus = 0;
    var lifeBoost = 0;
    var scoreUp = 0;
    var autoBoost = 0;
    var manualBoost = 0;
    var skillDuration = 0;

    var hasShano = false;
    var hasToka = false;
    var hasAiri = false;
    var hasMana = false;

    // Set variables if any CoA members are in team
    for (let x of ["m", "s"]) {
        for (let i = 1; i <= 4; i++) {
            var char = document.getElementById(x + i + "_char").innerHTML;
            switch (char) {
                case "shano":
                    hasShano = true;
                    break;
                case "toka":
                    hasToka = true;
                    break;
                case "airi":
                    hasAiri = true;
                    break;
                case "mana":
                    hasMana = true;
                    break;
            }
        }
    }

    for (let i = 1; i <= 4; i++) {
        var pskillString = document.getElementById("m" + i + "_pskill").innerHTML;
        if (pskillString.startsWith("Life Boost")) {
            var et = document.getElementById("m" + i + "_et").value;
            var lifeBoostTemp = getPassiveValue(pskillString, "Life Boost", et);
            if (lifeBoostTemp > lifeBoost) {
                lifeBoost = lifeBoostTemp;
            }
        } else if (pskillString.startsWith("Auto Boost")) {
            var et = document.getElementById("m" + i + "_et").value;
            var autoBoostTemp = getPassiveValue(pskillString, "Auto Boost", et);
            if (autoBoostTemp > autoBoost) {
                autoBoost = autoBoostTemp;
            }
        } else if (pskillString.startsWith("Manual Up")) {
            var et = document.getElementById("m" + i + "_et").value;
            var manualBoostTemp = getPassiveValue(pskillString, "Manual Up", et);
            if (manualBoostTemp > manualBoost) {
                manualBoost = manualBoostTemp;
            }
        } else if (pskillString.startsWith("Groovy Bonus")) {
            var et = document.getElementById("m" + i + "_et").value;
            var groovyBonusTemp = getPassiveValue(pskillString, "Groovy Bonus", et);
            if (groovyBonusTemp > groovyBonus) {
                groovyBonus = groovyBonusTemp;
            }
        } else if (pskillString.startsWith("Score Up")) {
            var et = document.getElementById("m" + i + "_et").value;
            var char = document.getElementById("m" + i + "_char").innerHTML;
            var bonus = 0;
            if (char === "shano") {
                if (hasToka) {
                    bonus += 1.5;
                }
            } else if (char === "airi") {
                if (hasMana) {
                    bonus += 1.5;
                }
            }
            var scoreUpTemp = getPassiveValue(pskillString, "Score Up", et) + bonus;
            if (scoreUpTemp > scoreUp) {
                scoreUp = scoreUpTemp;
            }
        } else if (pskillString.startsWith("Skill Duration")) {
            var et = document.getElementById("m" + i + "_et").value;
            var char = document.getElementById("m" + i + "_char").innerHTML;
            var bonus = 0;
            if (char === "mana" && hasAiri) {
                bonus += 15;
            } else if (char === "toka" && hasShano) {
                bonus += 15;
            } else if (char === "airi" && hasMana) {
                bonus += 15;
            } else if (char === "shano" && hasToka) {
                bonus += 15;
            }
            var skillDurTemp = getPassiveValue(pskillString, "Skill Duration", et) + bonus;
            if (skillDurTemp > skillDuration) {
                skillDuration = skillDurTemp;
            }
        }
    }

    // Check for support passive CoA
    for (let i = 1; i <= 4; i++) {
        var pskillStringSupp = document.getElementById("s" + i + "_pskill").innerHTML;
        if (pskillStringSupp.startsWith("Score Up")){
            var et = document.getElementById("s" + i + "_et").value;
            var char = document.getElementById("s" + i + "_char").innerHTML;
            var bonus = 0;
            if (char === "shano") {
                if (hasToka) {
                    bonus += 1.5;
                }
            } else if (char === "airi") {
                if (hasMana) {
                    bonus += 1.5;
                }
            }
            var scoreUpTemp = getPassiveValue(pskillStringSupp, "Score Up", et) + bonus;
            if (scoreUpTemp > scoreUp) {
                scoreUp = scoreUpTemp;
            }
        } else if (pskillStringSupp.startsWith("Skill Duration")) {
            var et = document.getElementById("s" + i + "_et").value;
            var char = document.getElementById("s" + i + "_char").innerHTML;
            var bonus = 0;
            if (char === "mana" && hasAiri) {
                bonus += 15;
            } else if (char === "toka" && hasShano) {
                bonus += 15;
            } else if (char === "airi" && hasMana) {
                bonus += 15;
            } else if (char === "shano" && hasToka) {
                bonus += 15;
            }
            var skillDurTemp = getPassiveValue(pskillStringSupp, "Skill Duration", et) + bonus;
            if (skillDurTemp > skillDuration) {
                skillDuration = skillDurTemp;
            }
        }
    }

    document.getElementById("pass_gt").value = groovyBonus;
    document.getElementById("pass_life").value = lifeBoost;
    document.getElementById("pass_scoreup").value = scoreUp;
    document.getElementById("pass_skilldur").value = skillDuration;
    document.getElementById("pass_auto").value = autoBoost;
    document.getElementById("pass_manual").value = manualBoost;
}

function getPassiveValue(pString, type,  et) {
    var pSkill = pString.substring(type.length + 1).slice(0, -1);
    var pSkillParts = pSkill.split("-");
    var interval = (parseFloat(pSkillParts[1]) - parseFloat(pSkillParts[0])) * 100 / 400;
    return parseFloat(pSkillParts[0]) + (interval * et);
}

function importTeam2() {
    var eventtype = document.getElementById("eventtype").innerHTML.toLowerCase();
    var paramtype = document.getElementById("eventparamval").innerHTML;
    if (paramtype === "None") {
        paramtype = "heart";
    }
    var param = document.getElementById("paramtotal_" + paramtype.toLowerCase() + "ep").innerHTML.slice(0, -1);

    var bonus = 0;
    for (let i = 1; i <= 4; i++) {
        bonus += parseFloat(document.getElementById("m" + i + "_eventperc").innerHTML);
        bonus = parseFloat(bonus.toFixed(2));
    }

    if (eventtype === "raid") {
        document.getElementById("paramselout2").value = 0;    
    } else {
        document.getElementById("paramselout2").value = param;
    }

    if (isNaN(bonus)) {
        bonus = 0;
    }
    document.getElementById("teambonus2").value = (bonus * 1000) / 10;

    $("select[name=eventsel2]").val(eventtype);
    $('.selectpicker#eventsel2').selectpicker('refresh');
}

function insertRow(tableObj, cell1Text, cell2Text) {
    var row = tableObj.insertRow(0);
    row.style.borderBottom = "1px solid #000";
    var cell1 = row.insertCell(0);
    cell1.style.borderRight = "1px solid #000";
    var cell2 = row.insertCell(1);
    cell2.style.textAlign = "right";
    cell2.style.width = "100px";
    cell1.innerHTML = cell1Text;
    cell2.innerHTML = cell2Text;
}

// Display extra selector if event type is Raid
function displayEventBonus(eventType) {
    if (eventType === "raid") {
        document.getElementById("eventcharselect").style.display = "block";
        populateCharSelect();
    } else {
        document.getElementById("eventcharselect").style.display = "none";
    }    
}

// Populate the character select based on current event chars
function populateCharSelect() {
    var eventid = document.getElementById("eventid").innerHTML;
    var charArray = eventList[eventid].characters.split(",");
    var charSet = new Set();
    for (let x of charArray) {
        charSet.add(x);
    }

    if (document.getElementById("eventraidchar").hasChildNodes()) {
        document.getElementById("eventraidchar").removeChild(document.getElementById("eventraidchar").firstChild);
    }

    var select = document.createElement("select");
    select.name = "eventchars";
    select.id = "eventchars";
    select.classList.add("selectpicker");
    select.classList.add("voltselect");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    charSet.forEach(function(x) {
        var option = document.createElement("option");
        option.value = x;
        option.setAttribute("data-tokens", x.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/icon_" + x.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + x);
        select.appendChild(option);        
    });
    document.getElementById("eventraidchar").appendChild(select);

    $.refreshSelect();
}