var refreshSelect1;
var refreshSelect3;
var refreshParamSelect;
var refreshParamSelect2;
var refreshGrowthSelect;
var refreshSpecificParam;

$(document).ready(function() {
    $.refreshSelect1 = function() {
        $('.selectpicker#cards').selectpicker('refresh');
    };

    $.refreshSelect3 = function(id) {
        $('.selectpicker#' + id + '_et').selectpicker('refresh');
    };

    $.refreshParamSelect = function() {
        $('.selectpicker.paramchar').selectpicker('refresh');
    };

    $.refreshSpecificParam = function(char) {
        $('.selectpicker#param_' + char + '_1').selectpicker('refresh');
        $('.selectpicker#param_' + char + '_2').selectpicker('refresh');
        $('.selectpicker#param_' + char + '_3').selectpicker('refresh');
    };

    $.refreshParamSelect2 = function() {
        $('.selectpicker.paramselect').selectpicker('refresh');
    };

    $.refreshGrowthSelects = function() {
        $('.selectpicker#growthEt').selectpicker('refresh');
        $('.selectpicker.growthparamchar').selectpicker('refresh');
    };
});

$(document).on('changed.bs.select', 'select', function(event) {
    if ($(event.target).is("select#cards")) {
        fillStat($(this).val());
    } else if ($(event.target).is("select#growthCards")) {
        populateStats($(this).val());
    }

    if ($(event.target).is("select#eventselector")) {
        fillEventDisplay();
        $.refreshMedleySelect();
        populateCharSelect();
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
    } else if ($(event.target).is("select#eventsel")) {
        displayEventBonus($(this).val());
    } else if ($(event.target).is("select#medleychars")) {
        calcDisplayPower();
        calcDisplayParams();
    } else if ($(event.target).is("select.growthselector")) {
        calcGrowthDisp();
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
        var selection = document.getElementById("idToReplace").innerHTML;
        var cardId = $('#cards').val();
        var added = populateTeam(selection, cardId);

        if (added) {
            calcModPower();
            calcClubPower();
            calcEventPower();
            calcDisplayPower();
            calcDisplayParams();
    
            // let text = document.getElementById("fadediv");
            // text.classList.add("fade-in");
            // setTimeout(function () {
            //   text.classList.remove("fade-in");
            // }, 2000);

            $('#teamSelectSection').toggleClass('show');
        }
    });

    $('#refreshall').on('click', function() {
        if (confirm("Are you sure you want to reset your team?")) {
            if ($('#teamSelectSection').hasClass('show')) {
                $('#teamSelectSection').toggleClass('show');
            }
            refreshTeam();

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

    $('.charbutton').on('click', function() {

        // If the team details pane is open, close it
        if ($('#mainTeamTable').hasClass('open')) {
            $('#mainTeamTable').toggleClass('open');
        }

        if (! $('#teamSelectSection').hasClass('show')) {
            $('#teamSelectSection').toggleClass('show');
        }

        var ids = $(this).attr('id').split('_');
        setReplaceCard(ids[0]);
    });

    $('#cancelAdd').on('click', function() {
        $('#teamSelectSection').toggleClass('show');
    });
});

/*
    Add a card to team
*/
function populateTeam(selection, cardId) {
    if (cardId) {
        var img = document.createElement("img");
        img.id = selection + "_charImage";
        img.src = "https://miyu-data.qwewqa.xyz/ondemand/card_icon/" + cards[cardId].icon + ".jpg";
        img.width = '100';
        img.height = '100';
        img.title = cards[cardId].character.toLowerCase();
        if (document.getElementById(selection + "_charImageWrapper").hasChildNodes()) {
            document.getElementById(selection + "_charImageWrapper").removeChild(document.getElementById(selection + "_charImageWrapper").firstChild);
        }
        document.getElementById(selection + "_charImageWrapper").appendChild(img);
        document.getElementById(selection + "_id").innerHTML = cardId;
        document.getElementById(selection + "_char").innerHTML = cards[cardId].character.toLowerCase();
        document.getElementById(selection + "_charfull").innerHTML = cards[cardId].character + ' - ' + cards[cardId].cardname;

        var heart = cards[cardId].heart;
        var technical = cards[cardId].technical;
        var physical = cards[cardId].physical;
        var tempHeart = localStats.get(cardId + "_heart");
        if (tempHeart) {
            heart = parseInt(tempHeart);
        }
        var tempTech = localStats.get(cardId + "_tech");
        if (tempTech) {
            technical = parseInt(tempTech);
        }
        var tempPhys = localStats.get(cardId + "_phys");
        if (tempPhys) {
            physical = parseInt(tempPhys);
        }

        document.getElementById(selection + "_heartbase").innerHTML = heart;
        document.getElementById(selection + "_techbase").innerHTML = technical;
        document.getElementById(selection + "_physbase").innerHTML = physical;
        document.getElementById(selection + "_pskill").innerHTML = cards[cardId].passive;

        // Check if ET exists and if so, set it
        var et = localEt.get(cardId) || 0;
        document.getElementById(selection + "_et").value = et;
        $.refreshSelect3(selection);

        document.getElementById(selection + "_unit").innerHTML = cards[cardId].unit;
        document.getElementById(selection + "_type").innerHTML = cards[cardId].type;
        var skill = Math.round(cards[cardId].skill * 100);
        var tempSkill = parseFloat(localStats.get(cardId + "_skill"));
        if (tempSkill) {
            skill = Math.round(tempSkill * 100);
        }
        document.getElementById(selection + "_skill").innerHTML = skill.toString() + "%";

        return true;
    } else {
        var img = document.createElement("img");
        img.src = "../icons/icon_none.png";
        img.width = '100';
        img.height = '100';
        if (document.getElementById(selection + "_charImageWrapper").hasChildNodes()) {
            document.getElementById(selection + "_charImageWrapper").removeChild(document.getElementById(selection + "_charImageWrapper").firstChild);
        }
        document.getElementById(selection + "_charImageWrapper").appendChild(img);
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
            document.querySelector('input[name="pskillField"]').value = "";
            document.querySelector('input[name="etField"]').value = "";
            document.getElementById("addnew_heart").innerHTML = "";
            document.getElementById("addnew_tech").innerHTML = "";
            document.getElementById("addnew_phys").innerHTML = "";
            document.getElementById("addnew_total").innerHTML = "";
        }
        return;
    }

    var cardIdString = cardId.toString();

    var obj = standardArray[cardIdString];
    document.querySelector('input[name="cardField"]').value = obj.cardname;
    document.querySelector('input[name="heartField"]').value = obj.heart;
    document.getElementById("addnew_heart").innerHTML = obj.heart;
    document.querySelector('input[name="techField"]').value = obj.technical;
    document.getElementById("addnew_tech").innerHTML = obj.technical;
    document.querySelector('input[name="physField"]').value = obj.physical;
    document.getElementById("addnew_phys").innerHTML = obj.physical;
    document.querySelector('input[name="totalField"]').value = parseInt(obj.heart) + parseInt(obj.technical) + parseInt(obj.physical);
    document.getElementById("addnew_total").innerHTML = parseInt(obj.heart) + parseInt(obj.technical) + parseInt(obj.physical);
    var skill = Math.round(obj.skill * 100);
    document.querySelector('input[name="skillField"]').value = skill.toString() + "%";
    document.querySelector('input[name="pskillField"]').value = obj.passive;
    var et = localEt.get(cardIdString) || 0;

    document.querySelector('input[name="etField"]').value = et;

    var img = document.createElement("img");
    img.src = "https://miyu-data.qwewqa.xyz/ondemand/card_icon/" + obj.icon.toString() + ".jpg";
    img.classList.add("img-thumbnail");
    img.style = 'margin-left:auto;margin-right:auto;display:block';
    img.width = '100';
    img.height = '100';
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

/*
    Generate the card selector for growth menu
*/
function displayCardsDropdown2(arr) {

    var label = document.createElement("label");
    label.innerHTML = "Select card: ";
    label.htmlFor = "cards";

    var select = document.createElement("select");
    select.name = "growthCards";
    select.id = "growthCards";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    for(let i = 0; i < arr.length; i++) {
        option = document.createElement("option");
        option.value = arr[i].id;
        var rarityText = arr[i].rarity;
        if (rarityText !== "SP") {
            rarityText = rarityText + "★ ";
        } else {
            rarityText = rarityText + " ";
        }

        option.text = rarityText + arr[i].character + ' - ' + arr[i].cardname;
        option.setAttribute("data-tokens", arr[i].type.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/type_" + arr[i].type.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        select.appendChild(option);
    }

    select.style.paddingLeft = "10px";
    document.getElementById("growthDropdown").appendChild(label);
    document.getElementById("growthDropdown").appendChild(select);
}

// Display card stats in the growth upgrade section
function populateStats(id) {

    var char = cards[id].character.toLowerCase();

    var heart = cards[id].heart;
    var tech = cards[id].technical;
    var phys = cards[id].physical;
    var skill = Math.round(cards[id].skill * 100);

    // populate original stats
    document.getElementById("growthHeartBase").value = heart;
    document.getElementById("growthTechBase").value = tech;
    document.getElementById("growthPhysBase").value = phys;
    document.getElementById("growthSkillBase").value = skill;

    // populate ET
    var et = localEt.get(id) || 0;
    document.getElementById("growthEt").value = et;

    // populate param
    var paramHeart = localParam.get("param_" + char + "_1") || 0;
    var paramTech = localParam.get("param_" + char + "_2") || 0;
    var paramPhys = localParam.get("param_" + char + "_3") || 0;

    document.getElementById("growthParamHeart").value = paramHeart;
    document.getElementById("growthParamTech").value = paramTech;
    document.getElementById("growthParamPhys").value = paramPhys;

    $.refreshGrowthSelects();

    calcGrowthDisp();
}

// recalculate growth value when changing ET or param
function calcGrowthDisp() {

    var id = document.getElementById("growthCards").value;
    var char = cards[id].character.toLowerCase();
    var et = document.getElementById("growthEt").value;
    var heart = cards[id].heart;
    var tech = cards[id].technical;
    var phys = cards[id].physical;
    var skill = cards[id].skill;
    var paramHeart = document.getElementById("growthParamHeart").value;
    var paramTech = document.getElementById("growthParamTech").value;
    var paramPhys = document.getElementById("growthParamPhys").value;

    // populate new stats (with mods)
    var tempHeart = localStats.get(id + "_heart");
    if (tempHeart) {
        heart = parseInt(tempHeart);
    }
    var tempTech = localStats.get(id + "_tech");
    if (tempTech) {
        tech = parseInt(tempTech);
    }
    var tempPhys = localStats.get(id + "_phys");
    if (tempPhys) {
        phys = parseInt(tempPhys);
    }
    var tempSkill = localStats.get(id + "_skill");
    if (tempSkill) {
        skill = parseFloat(tempSkill);
    }

    // show base (modified) card stats still
    document.getElementById("growthHeartBase2").innerHTML = heart;
    document.getElementById("growthTechBase2").innerHTML = tech;
    document.getElementById("growthPhysBase2").innerHTML = phys;

    var heartMod = 0;
    var techMod = 0;
    var physMod = 0;

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

    if (heart > tech) {
        if (heart > phys) {
            heartMod += etVal;
        } else {
            physMod += etVal;
        }
    } else if (tech > phys) {
        techMod += etVal;
    } else {
        physMod += etVal;
    }
    
    var heartParamPerc = parseFloat(paramHeart) / 100;
    heartMod += Math.floor((heart + heartMod) * heartParamPerc);
    var techParamPerc = parseFloat(paramTech) / 100;
    techMod += Math.floor((tech + techMod) * techParamPerc);
    var physParamPerc = parseFloat(paramPhys) / 100;
    physMod += Math.floor((phys + physMod) * physParamPerc);

    document.getElementById("growthHeartNew").value = heart + heartMod;
    document.getElementById("growthTechNew").value = tech + techMod;
    document.getElementById("growthPhysNew").value = phys + physMod;
    document.getElementById("growthSkillNew").value = Math.round(skill * 100);
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

        if (i % 6 == 0) {
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

/*
    Set details and image for the selected card when adding new card to team
*/
function setReplaceCard(selection) {

    document.getElementById("idToReplace").innerHTML = selection;

    // Using the selection, set the previous card's info, if it exists
    if (document.getElementById(selection + "_charfull").innerHTML != "") {
        var heart = document.getElementById(selection + "_heartmod").innerHTML;
        var tech = document.getElementById(selection + "_techmod").innerHTML;
        var phys = document.getElementById(selection + "_physmod").innerHTML;
        var power = parseInt(heart) + parseInt(tech) + parseInt(phys);

        var source = document.getElementById(selection + "_charImage").src;
        var img = document.createElement("img");
        img.src = source;
        img.classList.add("img-thumbnail");
        img.style = 'margin-left:auto;margin-right:auto;display:block';
        img.width = '100';
        img.height = '100';
        if (document.getElementById("imgwrapperprev").hasChildNodes()) {
            document.getElementById("imgwrapperprev").removeChild(document.getElementById("imgwrapperprev").firstChild);
        }
        document.getElementById("imgwrapperprev").appendChild(img);

        document.getElementById("addold_heart").innerHTML = heart;
        document.getElementById("addold_tech").innerHTML = tech;
        document.getElementById("addold_phys").innerHTML = phys;
        document.getElementById("addold_total").innerHTML = power;
    } else {
        var img = document.createElement("img");
        img.src = "../icons/icon_none.png";
        img.width = '100';
        img.height = '100';
        img.style = 'margin-left:auto;margin-right:auto;display:block';
        if (document.getElementById("imgwrapperprev").hasChildNodes()) {
            document.getElementById("imgwrapperprev").removeChild(document.getElementById("imgwrapperprev").firstChild);
        }
        document.getElementById("imgwrapperprev").appendChild(img);
        
        document.getElementById("addold_heart").innerHTML = 0;
        document.getElementById("addold_tech").innerHTML = 0;
        document.getElementById("addold_phys").innerHTML = 0;
        document.getElementById("addold_total").innerHTML = 0;
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

    var totalMedleyPower = getMedleyPower();
    document.getElementById("power_medley").innerHTML = totalMedleyPower;

    document.getElementById("power_totalwo").innerHTML = totalMainPower + totalClubPower + totalSupportPower;
    document.getElementById("power_total").innerHTML = totalMainPower + totalClubPower + totalSupportPower + totalEventPower + totalMedleyPower;
}

function getMedleyPower() {

    // Medley event cards 
    var cardSet = getCardSet("medley");

    var charList = [];
    var eventId = document.getElementById("eventid").innerHTML;
    var type = document.getElementById("eventtype").innerHTML;
    for (let x of eventList[eventId].characters.split(",")) {
        charList.push(x.toLowerCase());
    }

    var isNewType = false;
    if (cardSet.hasOwnProperty(eventId)) {
        isNewType = true;
    }

    // Medley power
    if (document.getElementById("eventtype").innerHTML === "Medley") {
        var medleyChar = document.getElementById("medleychars").value.toLowerCase();
        if (isNewType) { // New medleys give +50% to specific card per medley
            for (let i = 1; i <= 4; i++) {
                if ((document.getElementById("m" + i + "_char").innerHTML.toLowerCase()) === medleyChar) {
                    if (isEventCard(type, "m" + i)) {
                        var heart = Math.floor(parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) * .5);
                        var tech = Math.floor(parseInt(document.getElementById("m" + i + "_techmod").innerHTML) * .5);
                        var phys = Math.floor(parseInt(document.getElementById("m" + i + "_physmod").innerHTML) * .5);
                        return heart + tech + phys;
                    }
                }
            }
        } else { // Old medleys gave +10% to specific character per medley
            if (medleyChar !== "none") {
                for (let i = 1; i <= 4; i++) {
                    if ((document.getElementById("m" + i + "_char").innerHTML.toLowerCase()) === medleyChar) {
                        var heart = Math.floor(parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) * .1);
                        var tech = Math.floor(parseInt(document.getElementById("m" + i + "_techmod").innerHTML) * .1);
                        var phys = Math.floor(parseInt(document.getElementById("m" + i + "_physmod").innerHTML) * .1);
                        return heart + tech + phys;
                    }
                }
            }
        }
    }

    return 0;
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

        for (let type0 of clubTypesDisplay) {
            clubPercGain += getClubPerc(type0, i);
            clubPercGain = Math.round((clubPercGain + Number.EPSILON) * 100) / 100
        }

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
            clubItemCheck = clubItemsDisplay;
            break;
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
    var type = document.getElementById("eventtype").innerHTML;
    // For now, just assume all raids the same for Dengeki. Will need to tweak further for 1st Anni or possibly old D4FES type again
    if (type === "Raid") {
        // Power for newer special raids (dengeki, precure, quint2, etc)
        // +50% for matching char, +50% for collab

        var charList = [];
        var eventId = document.getElementById("eventid").innerHTML;
        for (let x of eventList[eventId].characters.split(",")) {
            charList.push(x.toLowerCase());
        }

        for (let i = 1; i <= 4; i++) {
            setEventPerc("m" + i);

            var char = document.getElementById("m" + i + "_char").innerHTML;
            if (charList.includes(char)) {

                var eventPerc = .5;
                if (isEventCard(type, "m" + i)) {
                    eventPerc = 1;
                }

                // Re-run of old quints event. No power bonus except for matching card to support live room
                // which is handled in scoring section
                if (eventId == 109) {
                    eventPerc = 0;    
                }

                var heartMod = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
                var techMod = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
                var physMod = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;
        
                var heart = Math.floor(parseInt(heartMod) * eventPerc);
                var tech = Math.floor(parseInt(techMod) * eventPerc);
                var phys = Math.floor(parseInt(physMod) * eventPerc);
                var eventTotal = heart + tech + phys;

                // Power for super dengeki live
                var heart2 = Math.floor(parseInt(heartMod) * eventPerc * 2);
                var tech2 = Math.floor(parseInt(techMod) * eventPerc * 2);
                var phys2 = Math.floor(parseInt(physMod) * eventPerc * 2);
                var eventTotal2 = heart2 + tech2 + phys2;

                document.getElementById("m" + i + "_eventbonus").innerHTML = eventTotal;
                document.getElementById("m" + i + "_eventbonus2").innerHTML = eventTotal2;
            } else {
                document.getElementById("m" + i + "_eventbonus").innerHTML = 0;
                document.getElementById("m" + i + "_eventbonus2").innerHTML = 0;
            }
        }
    } else {
        for (let i = 1; i <= 4; i++) {
            var eventPercGain = setEventPerc("m" + i);

            var heartMod = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
            var techMod = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
            var physMod = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;
        
            var heart = Math.floor(parseInt(heartMod) * eventPercGain);
            var tech = Math.floor(parseInt(techMod) * eventPercGain);
            var phys = Math.floor(parseInt(physMod) * eventPercGain);
            var eventTotal = heart + tech + phys;
        
            document.getElementById("m" + i + "_eventbonus").innerHTML = eventTotal;
            document.getElementById("m" + i + "_eventbonus2").innerHTML = 0;
        }
    }
}

// Function to determine if card at specified identifier is an event card
function isEventCard(type, identifier) {
    var eventId = document.getElementById("eventid").innerHTML;
    var cardSet = getCardSet(type.toLowerCase());
    var cardList = cardSet[eventId];
    var cardNameFull = document.getElementById(identifier + "_charfull").innerHTML;
    var cardName = cardNameFull.slice(cardNameFull.indexOf("-") + 1).substring(1);
    for (let card of cardList) {
        if (cardName.includes(card)) {
            return true;
        }
    }
    return false;
}

function setEventPerc(identifier) {
    
    var eventId = document.getElementById("eventid").innerHTML;

    // For each char bonus, check if char matches
    var character = document.getElementById(identifier + "_char").innerText.toLowerCase();
    var charBonus = false;
    if (eventList[eventId].characters !== "None") {
        var charArray = eventList[eventId].characters.split(",");
        for (let x of charArray) {
            if (character === x.toLowerCase()) {
                charBonus = true;
            }
        }
    }

    var style = document.getElementById(identifier + "_type").innerText.toLowerCase();
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

    document.getElementById(identifier + "_eventperc").innerHTML = eventPerc;

    return eventPerc;
}

function calcDisplayParams() {
    var totalHeart = 0;
    var totalTech = 0;
    var totalPhys = 0;

    var heartPerc = 0;
    var techPerc = 0;
    var physPerc = 0;

    for (let i = 1; i <= 4; i++) {
        totalHeart += parseInt(document.getElementById("m" + i + "_heartclub").innerHTML) || 0;
        var heartMod = parseInt(document.getElementById("m" + i + "_heartmod").innerHTML) || 0;
        totalHeart += heartMod;

        var suppMod = parseInt(document.getElementById("s" + i + "_heartmod").innerHTML) || 0;
        totalHeart += Math.floor(suppMod / 4);

        totalTech += parseInt(document.getElementById("m" + i + "_techclub").innerHTML) || 0;
        var techMod = parseInt(document.getElementById("m" + i + "_techmod").innerHTML) || 0;
        totalTech += techMod;

        suppMod = parseInt(document.getElementById("s" + i + "_techmod").innerHTML) || 0;
        totalTech += Math.floor(suppMod / 4);

        totalPhys += parseInt(document.getElementById("m" + i + "_physclub").innerHTML) || 0;
        var physMod = parseInt(document.getElementById("m" + i + "_physmod").innerHTML) || 0;
        totalPhys += physMod;

        suppMod = parseInt(document.getElementById("s" + i + "_physmod").innerHTML) || 0;
        totalPhys += Math.floor(suppMod / 4);

        var highest = "";
        if (heartMod > techMod) {
            if (heartMod > physMod) {
                highest = "heart";
            } else {
                highest = "phys";
            }
        } else if (techMod > physMod) {
            highest = "tech";
        } else if (physMod != 0) {
            highest = "phys";
        }

        if (highest === "heart") {
            heartPerc += 10;
            if (heartMod >= 21000) {
                heartPerc += Math.floor((heartMod - 20000) / 1000);
            } 
        } else if (highest === "tech") {
            techPerc += 10;
            if (techMod >= 21000) {
                techPerc += Math.floor((techMod - 20000) / 1000);
            }
        } else if (highest === "phys") {
            physPerc += 10;
            if (physMod >= 21000) {
                physPerc += Math.floor((physMod - 20000) / 1000);
            }
        }
    }

    document.getElementById("paramtotal_heart").innerHTML = totalHeart;
    document.getElementById("paramtotal_heartep").innerHTML = heartPerc + "%";
    document.getElementById("paramtotal_technical").innerHTML = totalTech;
    document.getElementById("paramtotal_technicalep").innerHTML = techPerc + "%";
    document.getElementById("paramtotal_physical").innerHTML = totalPhys;
    document.getElementById("paramtotal_physicalep").innerHTML = physPerc + "%";

    $.refreshParamSelect2();
}

function refreshTeam() {
    var types = ["m","s"];
    for (let x of types) {
        for (var i=1; i<=4; i++) {
            var selection = x + i;
            if (document.getElementById(selection + "_charImageWrapper").hasChildNodes()) {
                document.getElementById(selection + "_charImageWrapper").removeChild(document.getElementById(selection + "_charImageWrapper").firstChild);
            }
            var img = document.createElement("img");
            img.src = "../icons/icon_none.png";
            img.width = '100';
            img.height = '100';
            img.title = 'Add card to team';
            document.getElementById(selection + "_charImageWrapper").appendChild(img);
            document.getElementById(selection + "_charfull").innerHTML = "";
            document.getElementById(selection + "_id").innerHTML = "";
            document.getElementById(selection + "_char").innerHTML = "";
            document.getElementById(selection + "_unit").innerHTML = "";
            document.getElementById(selection + "_type").innerHTML = "";
            document.getElementById(selection + "_skill").innerHTML = "";
            document.getElementById(selection + "_pskill").innerHTML = "";
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
            document.getElementById(selection + "_eventbonus2").innerHTML = "";
            document.getElementById(selection + "_supportpower").innerHTML = "";
            $.refreshSelect3(selection);
        }
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

function setupGrowthUpgradeSection() {
    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamHeart";
    paramSelect.id = "growthParamHeart";
    paramSelect.classList.add("selectpicker");
    paramSelect.classList.add("growthparamchar");
    paramSelect.classList.add("growthselector");
    paramSelect.setAttribute("data-live-search","false");
    paramSelect.setAttribute("data-width","fit");
    paramSelect.setAttribute("data-size","10");

    for (var j = 0; j <= 5; j+=.1) {
        var paramOption = document.createElement("option");
        j = Math.round(j * 10) / 10;
        paramOption.value = j;
        paramOption.setAttribute("data-content",j.toString() + "%");
        
        paramSelect.appendChild(paramOption);
    }

    document.getElementById("growthParamHeartWrapper").appendChild(paramSelect);

    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamTech";
    paramSelect.id = "growthParamTech";
    paramSelect.classList.add("selectpicker");
    paramSelect.classList.add("growthparamchar");
    paramSelect.classList.add("growthselector");
    paramSelect.setAttribute("data-live-search","false");
    paramSelect.setAttribute("data-width","fit");
    paramSelect.setAttribute("data-size","10");

    for (var j = 0; j <= 5; j+=.1) {
        var paramOption = document.createElement("option");
        j = Math.round(j * 10) / 10;
        paramOption.value = j;
        paramOption.setAttribute("data-content",j.toString() + "%");
        
        paramSelect.appendChild(paramOption);
    }

    document.getElementById("growthParamTechWrapper").appendChild(paramSelect);

    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamPhys";
    paramSelect.id = "growthParamPhys";
    paramSelect.classList.add("selectpicker");
    paramSelect.classList.add("growthparamchar");
    paramSelect.classList.add("growthselector");
    paramSelect.setAttribute("data-live-search","false");
    paramSelect.setAttribute("data-width","fit");
    paramSelect.setAttribute("data-size","10");

    for (var j = 0; j <= 5; j+=.1) {
        var paramOption = document.createElement("option");
        j = Math.round(j * 10) / 10;
        paramOption.value = j;
        paramOption.setAttribute("data-content",j.toString() + "%");
        
        paramSelect.appendChild(paramOption);
    }

    document.getElementById("growthParamPhysWrapper").appendChild(paramSelect);
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
        "unit":"Unichord",
        "display":"UniChØrd"
    },
    {
        "unit":"Abyssmare",
        "display":"Abyssmare"
    },
    {
        "unit":"Common",
        "display":"Other"
    }
];

var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", "Noa", "Rika", "Marika", "Saori", "Dalia", 
                    "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru", "Lumina", "Kokoa", "Hayate", "Neo", "Sophia", "Elsie", "Weronika",
                     "Toka", "Shano", "Mana", "Airi"];