var refreshSelect1;
var refreshSelect2;
var refreshSelect3;
var refreshParamSelect;
var refreshParamSelect2;

$(document).ready(function() {
    $.refreshSelect1 = function() {
        $('.selectpicker#cards').selectpicker('refresh');
    };

    $.refreshSelect2 = function() {
        $('.selectpicker#eventmedleychar').selectpicker('refresh');
    };

    $.refreshSelect3 = function(id) {
        $('.selectpicker#' + id + '_et').selectpicker('refresh');
    };

    $.refreshParamSelect = function() {
        $('.selectpicker.paramchar').selectpicker('refresh');
    };

    $.refreshParamSelect2 = function() {
        $('.selectpicker.paramselect').selectpicker('refresh');
    };
});

$(document).on('changed.bs.select', 'select', function(event) {
    if ($(event.target).is("select#cards")) {
        fillStat($(this).val());
    } else if ($(event.target).is("select#eventtype")) {
        displayCharSelect($(event.target).val());
    } else if ($(event.target).is("select.eventbonuschar")) {
        populateCharSelect();
    }

    if ($(event.target).is("select#eventselector")) {
        fillEventDisplay();
        calcEventPower();
        calcDisplayPower();
    } else if ($(event.target).is("select.etselect")) {
        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    } else if ($(event.target).is("select.clubselect")) {
        calcClubPower();
        calcDisplayPower();
        calcDisplayParams();
    } else if ($(event.target).is("select.paramchar")) {
        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    }
});

jQuery(function($) {
    $('#showFilter').on('click', function() {
        var text=$('#showFilter').text();
        if (text === "Show Filters") {
            $(this).text("Hide Filters");
        } else {
            $(this).text("Show Filters");
        }
    });
    
    $('#clearFilters').on('click', function() {
        refreshFilters();
    });

    $('#addToTeam').on('click', function() {
        var selection = $('#partypicker').val();
        var cardId = $('#cards').val();
        var added = populateTeam(selection, cardId);

        if (added) {
            calcModPower();
            calcClubPower();
            calcEventPower();
            calcDisplayPower();
            calcDisplayParams();
    
            let text = document.getElementById("fadediv");
            text.classList.add("fade-in");
            setTimeout(function () {
              text.classList.remove("fade-in");
            }, 2000);
        }
    });

    $('#refreshmain').on('click', function() {
        if (confirm("Are you sure you want to reset the main team?")) {
            refreshMainTeam();

            calcModPower();
            calcClubPower();
            calcEventPower();
            calcDisplayPower();
            calcDisplayParams();
        }
    });

    $('#refreshsupp').on('click', function() {
        if (confirm("Are you sure you want to reset the support team?")) {
            refreshSupportTeam();
        
            calcModPower();
            calcClubPower();
            calcEventPower();
            calcDisplayPower();
            calcDisplayParams();
        }
    });

    $('table').on('click', 'tr.parent .fa-chevron-down', function(){
        $(this).closest('tbody').toggleClass('open');
    });
});

/*
    Add a card to team
*/
function populateTeam(selection, cardId) {
    if (cardId) {
        document.getElementById(selection + "_id").innerHTML = cardId;
        document.getElementById(selection + "_char").innerHTML = cards[cardId].character.toLowerCase();
        document.getElementById(selection + "_charfull").innerHTML = cards[cardId].character + ' - ' + cards[cardId].cardname;
        document.getElementById(selection + "_heartbase").innerHTML = cards[cardId].heart;
        document.getElementById(selection + "_techbase").innerHTML = cards[cardId].technical;
        document.getElementById(selection + "_physbase").innerHTML = cards[cardId].physical;

        // Check if ET exists and if so, set it
        var et = localEt.get(cardId) || 0;
        document.getElementById(selection + "_et").value = et;
        $.refreshSelect3(selection);

        if (selection.startsWith("m")) {
            document.getElementById(selection + "_unit").innerHTML = cards[cardId].unit;
            document.getElementById(selection + "_type").innerHTML = cards[cardId].type;
            var skill = Math.round(cards[cardId].skill * 100);
            document.getElementById(selection + "_skill").innerHTML = skill.toString() + "%";
        }

        return true;
    } else {
        return false;
    }
}

/*
    Fill out the card stats when selecting a card to add to team
*/
function fillStat(cardId) {

    if (cardId == null) {
        if (document.getElementById("charImageWrapper").hasChildNodes()) {
            document.getElementById("charImageWrapper").removeChild(document.getElementById("charImageWrapper").firstChild);
            document.getElementById("unitImageWrapper").removeChild(document.getElementById("unitImageWrapper").firstChild);
            document.getElementById("typeImageWrapper").removeChild(document.getElementById("typeImageWrapper").firstChild);
            document.getElementById("imgwrapper").removeChild(document.getElementById("imgwrapper").firstChild);
            document.querySelector('input[name="cardField"]').value = "";
            document.querySelector('input[name="heartField"]').value = "";
            document.querySelector('input[name="techField"]').value = "";
            document.querySelector('input[name="physField"]').value = "";
            document.querySelector('input[name="totalField"]').value = "";
            document.querySelector('input[name="skillField"]').value = "";
        }
        return;
    }

    var obj = standardArray[cardId];
    document.querySelector('input[name="cardField"]').value = obj.cardname;
    document.querySelector('input[name="heartField"]').value = obj.heart;
    document.querySelector('input[name="techField"]').value = obj.technical;
    document.querySelector('input[name="physField"]').value = obj.physical;
    document.querySelector('input[name="totalField"]').value = parseInt(obj.heart) + parseInt(obj.technical) + parseInt(obj.physical);
    var skill = Math.round(cards[cardId].skill * 100);
    document.querySelector('input[name="skillField"]').value = skill.toString() + "%";

    var img = document.createElement("img");
    img.src = "https://qwewqa.github.io/miyu-data/ondemand/card_icon/" + obj.icon.toString() + ".jpg";
    img.classList.add("img-thumbnail");
    img.width = '200';
    img.height = '200';
    img.title = obj.character;
    if (document.getElementById("imgwrapper").hasChildNodes()) {
        document.getElementById("imgwrapper").removeChild(document.getElementById("imgwrapper").firstChild);
    }
    document.getElementById("imgwrapper").appendChild(img);
    
    img = document.createElement('img');
    img.src = "../icons/icon_" + obj.character.toLowerCase() + ".png";
    img.width = '50';
    img.height = '50';
    img.title = obj.character
    if (document.getElementById("charImageWrapper").hasChildNodes()) {
        document.getElementById("charImageWrapper").removeChild(document.getElementById("charImageWrapper").firstChild);
    }
    document.getElementById("charImageWrapper").appendChild(img);

    img = document.createElement('img');
    img.width = '30';
    img.height = '30';
    img.title = obj.unit
    img.src = "../icons/icon_" + obj.unit.toLowerCase() + ".png";
    if (document.getElementById("unitImageWrapper").hasChildNodes()) {
        document.getElementById("unitImageWrapper").removeChild(document.getElementById("unitImageWrapper").firstChild);
    }
    document.getElementById("unitImageWrapper").appendChild(img);

    img = document.createElement('img');
    img.width = '30';
    img.height = '30';
    img.title = obj.type
    img.src = "../icons/type_" + obj.type.toLowerCase() + ".png";
    if (document.getElementById("typeImageWrapper").hasChildNodes()) {
        document.getElementById("typeImageWrapper").removeChild(document.getElementById("typeImageWrapper").firstChild);
    }
    document.getElementById("typeImageWrapper").appendChild(img);
}

/*
    Generate the main card selector object
*/
function displayCardsDropdown(arr) {

    var label = document.createElement("label");
    label.innerHTML = "Choose a card to view stats: ";
    label.htmlFor = "cards";

    if (arr.length == 0) {
        var nocard = document.createElement("label");
        nocard.innerHTML = "No cards meet the filter criteria";
        nocard.style.paddingLeft = "10px";
        nocard.style.color = "red";
        document.getElementById("cardDropdown").appendChild(label);
        document.getElementById("cardDropdown").appendChild(nocard);
        fillStat(null);
        return;
    }

    var select = document.createElement("select");
    select.name = "cards";
    select.id = "cards";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    var sortObj = document.querySelector('input[name="sortOptions"]:checked');
    var sort;
    if (sortObj) {
        sort = sortObj.value;
    }

    for(let i = 0; i < arr.length; i++) {
        option = document.createElement("option");
        option.value = arr[i].id;
        var rarityText = arr[i].rarity;
        if (rarityText !== "SP") {
            rarityText = rarityText + "★ ";
        } else {
            rarityText = rarityText + " ";
        }
        var sortValue = "";
        if (sort !== "None") {
            if (sort === "totalpower") {
                sortValue = " - " + arr[i].totalpower;
            } else if (sort === "heart") {
                sortValue = " - " + arr[i].heart;
            } else if (sort === "technical") {
                sortValue = " - " + arr[i].technical;
            } else if (sort === "physical") {
                sortValue = " - " + arr[i].physical;
            }
        }
        option.text = rarityText + arr[i].character + ' - ' + arr[i].cardname + sortValue;
        option.setAttribute("data-tokens", arr[i].type.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/type_" + arr[i].type.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        select.appendChild(option);
    }

    select.style.paddingLeft = "10px";
    document.getElementById("cardDropdown").appendChild(label);
    document.getElementById("cardDropdown").appendChild(select);
    
    fillStat(arr[0].id);
}

const sort_by = (field, reverse, primer) => {
    const key = primer ?
        function(x) {
            return primer(x[field])
        } :
        function(x) {
            return x[field]
        };
    reverse = !reverse ? 1 : -1;
  
    return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

const default_sort = () => {
    return function(a, b) {
        return -1 * ((parseInt(a.rarity) > parseInt(b.rarity)) - (parseInt(b.rarity) > parseInt(a.rarity))) ||
            (a.character.toUpperCase() > b.character.toUpperCase()) - (b.character.toUpperCase() > a.character.toUpperCase()) ||
            (a.cardname.toUpperCase() > b.cardname.toUpperCase()) - (b.cardname.toUpperCase() > a.cardname.toUpperCase());
    }
}

function refreshFilters() {
    var boxes = document.getElementsByClassName("filter_clear");
    for (let x of boxes) {
        x.checked = false;
    }
    generateFilters(cardArray);
}

// Apply filters when a filter is clicked
function generateFilters(arr) {

    // Remove old dropdown
    var elem = document.getElementById("cardDropdown");
    if (elem) {
        elem.remove();
        var newElem = document.createElement("div");
        newElem.id = "cardDropdown";
        document.getElementById("cardDropdown_wrapper").appendChild(newElem);
    }

    // Sort functions
    var sort = document.querySelector('input[name="sortOptions"]:checked').value;
    if (!sort || sort === "None" || sort === 'null' || sort === 'undefined' || sort === "") {
        arr.sort(default_sort());
    } else if (sort === "totalpower" || sort === "heart" || sort === "technical" || sort === "physical") {
        arr.sort(sort_by(sort, true, parseInt));
    }

    // Unit filters
    var filters = document.getElementsByClassName("filter_char");
    var filterArray = [];
    var hasFilter = false;
    for (let x of filters) {
        if (x.checked) {
            hasFilter = true;
            filterArray.push(o=>o.unit.includes(x.value));
        }
    }

    if (hasFilter) {
        arr = arr.filter(o => filterArray.some(fn => fn(o)));
    }

    // Type filters
    filters = document.getElementsByClassName("filter_type");
    filterArray = [];
    hasFilter = false;
    for (let x of filters) {
        if (x.checked) {
            hasFilter = true;
            filterArray.push(o=>o.type.includes(x.value));
        }
    }

    if (hasFilter) {
        arr = arr.filter(o => filterArray.some(fn => fn(o)));
    }

    // Rarity filters
    filters = document.getElementsByClassName("filter_rarity");
    filterArray = [];
    hasFilter = false;
    for (let x of filters) {
        if (x.checked) {
            hasFilter = true;
            filterArray.push(o=>(o.rarity == x.value));
        }
    }

    if (hasFilter) {
        arr = arr.filter(o => filterArray.some(fn => fn(o)));
    }

    displayCardsDropdown(arr);

    $.refreshSelect1();
}

// Display the event char bonus select if event type is medley, hide otherwise
// function displayCharSelect(eventtype) {
//     if (eventtype === "event-medley") {
//         document.getElementById("medleychar").style.display = "block";
//         populateCharSelect();
//     } else {
//         document.getElementById("medleychar").style.display = "none";
//     }
// }

// Populate the character select based on current event chars
function populateCharSelect() {
    let charSet = new Set().add(document.getElementById("eventbonus1").value).add(document.getElementById("eventbonus2").value)
        .add(document.getElementById("eventbonus3").value).add(document.getElementById("eventbonus4").value);
    
    if (document.getElementById("event-char").hasChildNodes()) {
        document.getElementById("event-char").removeChild(document.getElementById("event-char").firstChild);
    }

    var select = document.createElement("select");
    select.name = "eventmedleychar";
    select.id = "eventmedleychar";
    select.classList.add("selectpicker");
    select.classList.add("eventselect");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    charSet.forEach(function(x) {
        var option = document.createElement("option");
        option.value = "eventmedley" + x;
        option.setAttribute("data-tokens", x.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/icon_" + x.toLowerCase().substring(5) + ".png' width='30' height='30'></img>" + ' ' + x.substring(5));
        select.appendChild(option);        
    });
    document.getElementById("event-char").appendChild(select);
    $.refreshSelect2();
}

// Create all the character filters when the page is loaded
function createCharacterFilters() {

    var i = 1;
    units.forEach(function(x) {

        var newDiv = document.createElement("div");
        newDiv.classList.add("d4dj_filter");

        var newInput = document.createElement("input");
        newInput.type = "checkbox";
        newInput.id = "filter_" + x.unit;
        newInput.name = "filter_" + x.unit; 
        newInput.classList.add("filter_char");
        newInput.classList.add("filter_clear");
        newInput.value = x.unit;

        var newLabel = document.createElement("label");
        newLabel.setAttribute("for", "filter_" + x.unit);
        newLabel.classList.add("filter_label");
        newLabel.innerHTML = "<img src='../icons/icon_" + x.unit.toLowerCase() + ".png' width='30' height='30'></img>" + x.display;

        document.getElementById("filter-character").appendChild(newDiv);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newLabel);

        if (i % 3 == 0) {
            var divBreak = document.createElement("div");
            divBreak.classList.add("w=100");
            document.getElementById("filter-character").appendChild(divBreak);
        }

        i++;
    });

    var filters = document.querySelectorAll(".filter_char");
    filters.forEach(function(x) {
        x.addEventListener("click", function() {
            generateFilters(cardArray);
        });
    });

    // Create character param filters
    var table = document.getElementById("paramtable");
    let thead = table.createTHead();
    let row = thead.insertRow();
    var th = document.createElement("th");
    var text = document.createTextNode("Character");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Heart");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Technical");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Physical");
    th.appendChild(text);
    row.appendChild(th);

    for (let x of characters) {
        // For each character, create a new row
        var charRow = table.insertRow();
        charRow.insertCell().appendChild(document.createTextNode(x));

        // Create param select
        for (var i = 1; i < 4; i++) {
            var paramSelect = document.createElement("select");
            paramSelect.name = "param_" + x.toLowerCase() + "_" + i;
            paramSelect.id = "param_" + x.toLowerCase() + "_" + i;
            paramSelect.classList.add("selectpicker");
            paramSelect.classList.add("paramchar");
            paramSelect.setAttribute("data-live-search","true");
            paramSelect.setAttribute("data-width","fit");
            paramSelect.setAttribute("data-size","10");

            for (var j = 0; j <= 5; j+=.1) {
                var paramOption = document.createElement("option");
                j = Math.round(j * 10) / 10;
                paramOption.value = j;
                if (j == 0) {
                    paramOption.setAttribute("data-content","-");
                } else {
                    paramOption.setAttribute("data-content",j.toString() + "%");
                }
                
                paramSelect.appendChild(paramOption);
            }

            charRow.insertCell().appendChild(paramSelect);
        }
    }
}

function calcDisplayPower() {

    var totalMainPower = 0;
    var totalClubPower = 0;
    var totalSupportPower = 0;
    var totalEventPower = 0;
    for (let i = 1; i <= 4; i++) {
        totalMainPower += parseInt(document.getElementById("m" + i + "_cardpower").innerHTML) || 0;
        totalClubPower += parseInt(document.getElementById("m" + i + "_clubbonus").innerHTML) || 0;
        totalEventPower += parseInt(document.getElementById("m" + i + "_eventbonus").innerHTML) || 0;
        totalSupportPower += parseInt(document.getElementById("s" + i + "_supportpower").innerHTML) || 0;
    }

    document.getElementById("power_main").innerHTML = totalMainPower;
    document.getElementById("power_club").innerHTML = totalClubPower;
    document.getElementById("power_support").innerHTML = totalSupportPower;
    document.getElementById("power_event").innerHTML = totalEventPower;

    // Medley power
    var totalMedleyPower = 0;
    if (document.getElementById("eventtype").value === "event-medley") {
        for (let i = 1; i <= 4; i++) {
            if (("eventmedleybonus" + document.getElementById("m" + i + "_char").innerHTML.toLowerCase()) === document.getElementById("eventmedleychar").value.toLowerCase()) {
                var heart = Math.floor(parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) * .1);
                var tech = Math.floor(parseInt(document.getElementById("m" + i + "_techmod").innerHTML) * .1);
                var phys = Math.floor(parseInt(document.getElementById("m" + i + "_physmod").innerHTML) * .1);
                totalMedleyPower = heart + tech + phys;
                break;
            }
        }
    }
    document.getElementById("power_medley").innerHTML = totalMedleyPower;

    document.getElementById("power_totalwo").innerHTML = totalMainPower + totalClubPower + totalSupportPower;
    document.getElementById("power_total").innerHTML = totalMainPower + totalClubPower + totalSupportPower + totalEventPower + totalMedleyPower;
}

/*
    Calculate the modified card power, where modified is extra training or parameter upgrades
*/
function calcModPower() {

    var types = ["m","s"];

    for (let x of types) {
        for (let i = 1; i <=4; i++ ) {

            var cardId = document.getElementById(x + i + "_id").innerHTML;
            if (cardId === "") {
                continue;
            }

            var heartMod = 0;
            var techMod = 0;
            var physMod = 0;

            var heartBase = parseInt(document.getElementById(x + i + "_heartbase").innerText);
            var techBase = parseInt(document.getElementById(x + i + "_techbase").innerText);
            var physBase = parseInt(document.getElementById(x + i + "_physbase").innerText);
    
            // Extra training
            var et = document.getElementById(x + i + "_et").value;
            var etVal = 0;
    
            switch (et) {
                case "1":
                    etVal = 2000;
                    break;
                case "2":
                    etVal = 2500;
                    break;
                case "3":
                    etVal = 3000;
                    break;
                case "4":
                    etVal = 4500;
                    break;
                default:
                    etVal = 0;
            }

            if (heartBase > techBase) {
                if (heartBase > physBase) {
                    heartMod += etVal;
                } else {
                    physMod += etVal;
                }
            } else if (techBase > physBase) {
                techMod += etVal;
            } else {
                physMod += etVal;
            }

            // Get parameter upgrades
            var char = document.getElementById(x + i + "_char").innerHTML;
            var heartParamPerc = parseFloat(document.getElementById("param_" + char + "_1").value) / 100;
            heartMod += Math.floor((heartBase + heartMod) * heartParamPerc);
            var techParamPerc = parseFloat(document.getElementById("param_" + char + "_2").value) / 100;
            techMod += Math.floor((techBase + techMod) * techParamPerc);
            var physParamPerc = parseFloat(document.getElementById("param_" + char + "_3").value) / 100;
            physMod += Math.floor((physBase + physMod) * physParamPerc);

            // Save modified power as base + mods
            document.getElementById(x + i + "_heartmod").innerHTML = parseInt(heartBase + heartMod);
            document.getElementById(x + i + "_techmod").innerHTML = parseInt(techBase + techMod);
            document.getElementById(x + i + "_physmod").innerHTML = parseInt(physBase + physMod);
    
            // Display the base + mods as a string
            document.getElementById(x + i + "_heart").innerHTML = heartBase + " (+" + heartMod + ")";
            document.getElementById(x + i + "_tech").innerHTML = techBase + " (+" + techMod + ")";
            document.getElementById(x + i + "_phys").innerHTML = physBase + " (+" + physMod + ")";
    
            // Display total card power
            document.getElementById(x + i + "_cardpower").innerHTML = parseInt(heartBase + heartMod + techBase + techMod + physBase + physMod);

            if (x === "s") {
                // Display support power
                var suppPower = Math.floor(parseInt(heartBase + heartMod) / 4) + Math.floor(parseInt(techBase + techMod) / 4) + Math.floor(parseInt(physBase + physMod) / 4);
                document.getElementById(x + i + "_supportpower").innerHTML = suppPower;
            }
        }
    }
}

// Anytime club items are changed, recalculate club power
function calcClubPower() {

    for (let i = 1; i <= 4; i++) {
        var clubPercGain = 0;
        for (let type1 of clubTypes1) {
            clubPercGain += getClubPerc(type1, i);
            clubPercGain = Math.round((clubPercGain + Number.EPSILON) * 100) / 100
        }
    
        for (let type2 of clubTypes2) {
            clubPercGain += getClubPerc(type2, i);
            clubPercGain = Math.round((clubPercGain + Number.EPSILON) * 100) / 100
        }
    
        for (let type3 of clubTypes3) {
            clubPercGain += getClubPerc(type3, i);
            clubPercGain = Math.round((clubPercGain + Number.EPSILON) * 100) / 100
        }

        var heart = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
        var tech = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
        var phys = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;

        var heartClub = Math.floor(heart * clubPercGain);
        var techClub = Math.floor(tech * clubPercGain);
        var physClub = Math.floor(phys * clubPercGain);
        var clubTotal = heartClub + techClub + physClub;
    
        document.getElementById("m" + i + "_heartclub").innerHTML = heartClub;
        document.getElementById("m" + i + "_techclub").innerHTML = techClub;
        document.getElementById("m" + i + "_physclub").innerHTML = physClub;
        document.getElementById("m" + i + "_clubbonus").innerHTML = clubTotal;
    }
}

// Return the club percentage bonus for the club type and character
function getClubPerc(selectId, charId) {
    var clubItemCheck = {};
    switch (selectId) {
        case "display":
        case "djbooth":
        case "discl":
        case "discr":
            clubItemCheck = clubItems1;
            break;
        case "front":
        case "side":
        case "back":
        case "frame":
        case "light":
        case "accessory":
            clubItemCheck = clubItems2;
            break;
        case "decoration":
            clubItemCheck = clubItems3;
            break;
    }

    var clubVal = document.getElementById("club-" + selectId).value;
    var clubPerc = 0;
    if (clubItemCheck[clubVal].type === "unit") {
        if (document.getElementById("m" + charId + "_unit").innerText.toLowerCase() === clubItemCheck[clubVal].name) {
            clubPerc = clubItemCheck[clubVal].bonus;
        }
    } else if (clubItemCheck[clubVal].type === "character") {
        if (document.getElementById("m" + charId + "_char").innerText.toLowerCase() === clubItemCheck[clubVal].name) {
            clubPerc = clubItemCheck[clubVal].bonus;
        }
    } else if (clubItemCheck[clubVal].type === "type") {
        if (document.getElementById("m" + charId + "_type").innerText.toLowerCase() === clubItemCheck[clubVal].name) {
            clubPerc = clubItemCheck[clubVal].bonus;
        }
    } else {
        clubPerc = clubItemCheck[clubVal].bonus;
    }

    return clubPerc;
}

function calcEventPower() {
    for (let i = 1; i <= 4; i++) {
        var eventPercGain = getEventPerc(i);
        document.getElementById("m" + i + "_eventperc").innerHTML = eventPercGain;

        var heartMod = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
        var techMod = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
        var physMod = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;

        var heart = Math.floor(parseInt(heartMod) * eventPercGain);
        var tech = Math.floor(parseInt(techMod) * eventPercGain);
        var phys = Math.floor(parseInt(physMod) * eventPercGain);
        var eventTotal = heart + tech + phys;

        document.getElementById("m" + i + "_eventbonus").innerHTML = eventTotal;
    }
}

function getEventPerc(charId) {
    
    var eventId = document.getElementById("eventid").innerHTML;

    // For each char bonus, check if char matches
    var character = document.getElementById("m" + charId + "_char").innerText.toLowerCase();
    var charBonus = false;
    if (eventList[eventId].characters !== "None") {
        var charArray = eventList[eventId].characters.split(",");
        for (let x of charArray) {
            if (character === x.toLowerCase()) {
                charBonus = true;
            }
        }
    }

    var style = document.getElementById("m" + charId + "_type").innerText.toLowerCase();
    var styleBonus = (style === document.getElementById("eventstyleval").innerHTML.toLowerCase());

    var eventPerc = 0;
    if (charBonus) {
        eventPerc += .2;
    }

    if (styleBonus) {
        eventPerc += .2;
    }

    if ("Yes" === document.getElementById("eventbonus").innerHTML && (eventPerc == .4)) {
        eventPerc += .1;
    }

    return eventPerc;
}

function calcDisplayParams() {
    var totalHeart = 0;
    var totalTech = 0;
    var totalPhys = 0;

    for (let i = 1; i <= 4; i++) {
        totalHeart += parseInt(document.getElementById("m" + i + "_heartclub").innerHTML) || 0;
        totalHeart += parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;

        var suppMod = parseInt(document.getElementById("s" + i + "_heartmod").innerHTML) || 0;
        totalHeart += Math.floor(suppMod / 4);

        totalTech += parseInt(document.getElementById("m" + i + "_techclub").innerHTML) || 0;
        totalTech += parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;

        suppMod = parseInt(document.getElementById("s" + i + "_techmod").innerHTML) || 0;
        totalTech += Math.floor(suppMod / 4);

        totalPhys += parseInt(document.getElementById("m" + i + "_physclub").innerHTML) || 0;
        totalPhys += parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;

        suppMod = parseInt(document.getElementById("s" + i + "_physmod").innerHTML) || 0;
        totalPhys += Math.floor(suppMod / 4);
    }

    var highest = "";
    if (totalHeart > totalTech) {
        if (totalHeart > totalPhys) {
            highest = "heart";
        } else {
            highest = "phys";
        }
    } else if (totalTech > totalPhys) {
        highest = "tech";
    } else {
        highest = "phys";
    }

    document.getElementById("paramtotal_heart").innerHTML = totalHeart;
    document.getElementById("paramtotal_heartep").innerHTML = Math.round(((totalHeart / 600) + Number.EPSILON) * 100) / 100;
    document.getElementById("paramtotal_technical").innerHTML = totalTech;
    document.getElementById("paramtotal_technicalep").innerHTML = Math.round(((totalTech / 600) + Number.EPSILON) * 100) / 100;
    document.getElementById("paramtotal_physical").innerHTML = totalPhys;
    document.getElementById("paramtotal_physicalep").innerHTML = Math.round(((totalPhys / 600) + Number.EPSILON) * 100) / 100;

    $.refreshParamSelect2();
}

function refreshMainTeam() {
    for (var i=1; i<=4; i++) {
        var selection = "m" + i;
        document.getElementById(selection + "_charfull").innerHTML = "";
        document.getElementById(selection + "_id").innerHTML = "";
        document.getElementById(selection + "_char").innerHTML = "";
        document.getElementById(selection + "_unit").innerHTML = "";
        document.getElementById(selection + "_type").innerHTML = "";
        document.getElementById(selection + "_skill").innerHTML = "";
        document.getElementById(selection + "_et").value = 0;
        document.getElementById(selection + "_heartbase").innerHTML = "";
        document.getElementById(selection + "_heartmod").innerHTML = "";
        document.getElementById(selection + "_heartclub").innerHTML = "";
        document.getElementById(selection + "_heart").innerHTML = "";
        document.getElementById(selection + "_techbase").innerHTML = "";
        document.getElementById(selection + "_techmod").innerHTML = "";
        document.getElementById(selection + "_techclub").innerHTML = "";
        document.getElementById(selection + "_tech").innerHTML = "";
        document.getElementById(selection + "_physbase").innerHTML = "";
        document.getElementById(selection + "_physmod").innerHTML = "";
        document.getElementById(selection + "_physclub").innerHTML = "";
        document.getElementById(selection + "_phys").innerHTML = "";
        document.getElementById(selection + "_cardpower").innerHTML = "";
        document.getElementById(selection + "_clubbonus").innerHTML = "";
        document.getElementById(selection + "_eventbonus").innerHTML = "";
        $.refreshSelect3(selection);
    }
}

function refreshSupportTeam() {
    for (var i=1; i<=4; i++) {
        var selection = "s" + i;
        document.getElementById(selection + "_charfull").innerHTML = "";
        document.getElementById(selection + "_id").innerHTML = "";
        document.getElementById(selection + "_char").innerHTML = "";
        document.getElementById(selection + "_et").value = 0;
        document.getElementById(selection + "_heartbase").innerHTML = "";
        document.getElementById(selection + "_heartmod").innerHTML = "";
        document.getElementById(selection + "_heart").innerHTML = "";
        document.getElementById(selection + "_techbase").innerHTML = "";
        document.getElementById(selection + "_techmod").innerHTML = "";
        document.getElementById(selection + "_tech").innerHTML = "";
        document.getElementById(selection + "_physbase").innerHTML = "";
        document.getElementById(selection + "_physmod").innerHTML = "";
        document.getElementById(selection + "_phys").innerHTML = "";
        document.getElementById(selection + "_cardpower").innerHTML = "";
        document.getElementById(selection + "_supportpower").innerHTML = "";
        $.refreshSelect3(selection);
    }    
}

function refreshParamSelects() {

    for (let x of characters) {
        document.getElementById("param_" + x.toLowerCase() + "_1").value = 0;
        document.getElementById("param_" + x.toLowerCase() + "_2").value = 0;
        document.getElementById("param_" + x.toLowerCase() + "_3").value = 0;
    }
    
    $.refreshParamSelect();
}

var units = [
    {
        "unit":"HapiAra",
        "display":"Happy Around"
    },
    {
        "unit":"Peaky",
        "display":"Peaky P-Key"
    },
    {
        "unit":"Photon",
        "display":"Photon Maiden"
    },
    {
        "unit":"Mermaid",
        "display":"Merm4id"
    },
    {
        "unit":"Rondo",
        "display":"RONDO"
    },
    {
        "unit":"LyriLily",
        "display":"Lyrical Lily"
    },
    {
        "unit":"CallofArtemis",
        "display":"Call of Artemis"
    },
    {
        "unit":"Common",
        "display":"Other"
    }
];

var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", "Noa", "Rika", "Marika", "Saori", "Dalia", 
                    "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru", "Toka", "Shano", "Mana", "Airi"];
