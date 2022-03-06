var refreshSelect1;
var refreshSelect2;

$(document).ready(function() {
    $.refreshSelect1 = function() {
        $('.selectpicker#cards').selectpicker('refresh');
    };

    $.refreshSelect2 = function() {
        $('.selectpicker#eventmedleychar').selectpicker('refresh');
    };
})

$(document).on('changed.bs.select', 'select', function(event) {
    if ($(event.target).is("select#cards")) {
        fillStat(cards[$(this).val()]);
    } else if ($(event.target).is("select#eventtype")) {
        displayCharSelect($(event.target).val());
    } else if ($(event.target).is("select.eventbonuschar")) {
        populateCharSelect();
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
        var boxes = document.getElementsByClassName("d4dj_filter");
        for (let x of boxes) {
            x.checked = false;
        }
        generateFilters(cardArray);
    });

    $('#addToTeam').on('click', function() {
        var selection = $('#partypicker').val();
        var cardId = $('#cards').val();
        populateTeam(selection, cardId);

        let text = document.getElementById("fadediv");
        text.classList.add("fade-in");
        setTimeout(function () {
          text.classList.remove("fade-in");
        }, 2000);
    });
});

function populateTeam(selection, cardId) {
    if (cardId) {
        document.getElementById(selection + "_id").innerHTML = cardId;
        document.getElementById("team_" + selection).innerHTML = cards[cardId].character + ' - ' + cards[cardId].cardname;
        document.getElementById(selection + "_char").innerHTML = cards[cardId].character.toLowerCase();
        document.getElementById(selection + "_charfull").innerHTML = cards[cardId].character + ' - ' + cards[cardId].cardname;
        if (selection.startsWith("m")) {
            document.getElementById(selection + "_unit").innerHTML = cards[cardId].unit
            document.getElementById(selection + "_type").innerHTML = cards[cardId].type
        }
        document.getElementById(selection + "_heart").innerHTML = cards[cardId].heart
        document.getElementById(selection + "_tech").innerHTML = cards[cardId].technical
        document.getElementById(selection + "_phys").innerHTML = cards[cardId].physical
        document.getElementById(selection + "_cardpower").innerHTML = cards[cardId].heart + cards[cardId].technical + cards[cardId].physical
        if (selection.startsWith("s")) {
            var suppPower = Math.floor(cards[cardId].heart / 4) + Math.floor(cards[cardId].technical / 4) + Math.floor(cards[cardId].physical / 4);
            document.getElementById(selection + "_supportpower").innerHTML = suppPower;
        }
    }
}

function fillStat(obj) {

    if (!obj) {
        document.getElementById("charImageWrapper").removeChild(document.getElementById("charImageWrapper").firstChild);
        document.getElementById("unitImageWrapper").removeChild(document.getElementById("unitImageWrapper").firstChild);
        document.getElementById("typeImageWrapper").removeChild(document.getElementById("typeImageWrapper").firstChild);
        document.querySelector('input[name="cardField"]').value = "";
        document.querySelector('input[name="heartField"]').value = "";
        document.querySelector('input[name="techField"]').value = "";
        document.querySelector('input[name="physField"]').value = "";
        document.querySelector('input[name="totalField"]').value = "";
        return;
    }
    document.querySelector('input[name="cardField"]').value = obj.cardname;
    document.querySelector('input[name="heartField"]').value = obj.heart;
    document.querySelector('input[name="techField"]').value = obj.technical;
    document.querySelector('input[name="physField"]').value = obj.physical;
    document.querySelector('input[name="totalField"]').value = obj.totalpower;

    var img = document.createElement('img');
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

// Display every card in a dropdown
function displayCardsDropdown(arr) {

    var select = document.createElement("select");
    select.name = "cards";
    select.id = "cards";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    var i;
    var sortObj = document.querySelector('input[name="sortOptions"]:checked');
    var sort;
    if (sortObj) {
        sort = sortObj.value;
    }

    for(i = 0; i < arr.length; i++) {
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

    var label = document.createElement("label");
    label.innerHTML = "Choose a card to view stats: ";
    label.htmlFor = "cards";

    if (arr.length == 0) {
        var nocard = document.createElement("label");
        nocard.innerHTML = "No cards meet the filter criteria";
        nocard.style.paddingLeft = "10px";
        nocard.style.color = "red";
        document.getElementById("cardDropdown").appendChild(label)
        document.getElementById("cardDropdown").appendChild(nocard);
    } else {
        select.style.paddingLeft = "10px";
        document.getElementById("cardDropdown").appendChild(label);
        document.getElementById("cardDropdown").appendChild(select);
    }

    fillStat(arr[0]);
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
function displayCharSelect(eventtype) {
    if (eventtype === "event-medley") {
        document.getElementById("medleychar").style.display = "block";
        populateCharSelect();
    } else {
        document.getElementById("medleychar").style.display = "none";
    }
}

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

    units.forEach(function(x) {
        var newInput = document.createElement("input");
        newInput.type = "checkbox";
        newInput.id = "filter_" + x.unit;
        newInput.name = "filter_" + x.unit;
        newInput.classList.add("filter_char");
        newInput.classList.add("d4dj_filter");
        newInput.value = x.unit;

        var newLabel = document.createElement("label");
        newLabel.setAttribute("for", "filter_" + x.unit);
        newLabel.classList.add("filter_label");
        newLabel.innerHTML = "<img src='../icons/icon_" + x.unit.toLowerCase() + ".png' width='30' height='30'></img>" + x.display;

        document.getElementById("filter-character").appendChild(newInput);
        document.getElementById("filter-character").appendChild(newLabel);
    });

    var filters = document.querySelectorAll(".filter_char");
    filters.forEach(function(x) {
        x.addEventListener("click", function() {
            generateFilters(cardArray);
        });
    });

    // Create event bonus character filters
    for (var i = 1; i < 5; i++) {
        var select = document.createElement("select");
        select.name = "eventbonus" + i;
        select.id = "eventbonus" + i;
        select.classList.add("selectpicker");
        select.classList.add("eventbonuschar");
        select.setAttribute("data-width","fit");
        select.setAttribute("data-size","10");

        characters.forEach(function(x) {
            var option = document.createElement("option");
            option.value = "bonus" + x;
            option.setAttribute("data-tokens", x.toLowerCase());
            option.setAttribute("data-content","<img src='../icons/icon_" + x.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + x);
            select.appendChild(option);
        });

        document.getElementById("bonus" + i).appendChild(select);
    }

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
            paramSelect.setAttribute("data-width","fit");
            paramSelect.setAttribute("data-size","10");

            for (var j = 0; j <= 5; j+=.1) {
                var paramOption = document.createElement("option");
                j = Math.round(j * 10) / 10;
                paramOption.value = j;
                paramOption.setAttribute("data-content",j);
                paramSelect.appendChild(paramOption);
            }

            charRow.insertCell().appendChild(paramSelect);
        }
    }
}
function calculatePower() {
    // Main team
    var teamPower = parseInt(document.getElementById("m1_cardpower").innerHTML) + parseInt(document.getElementById("m2_cardpower").innerHTML) + 
        parseInt(document.getElementById("m3_cardpower").innerHTML) + parseInt(document.getElementById("m4_cardpower").innerHTML);

    document.getElementById("power_main").innerHTML = teamPower;

    var clubGain = 0;
    for (let i = 1; i <= 4; i++) {
        var dispVal = document.getElementById("club-display").value;
        var displayPerc = 0;
        if (clubItems1[dispVal].type === "unit") {
            if (document.getElementById("m" + i + "_unit").innerText === clubItems1[dispVal].name) {
                displayPerc = clubItems1[dispVal].bonus;
            }
        } else if (clubItems1[dispVal].type === "character") {
            if (document.getElementById("m" + i + "_char").innerText === clubItems1[dispVal].name) {
                displayPerc = clubItems1[dispVal].bonus;
            }
        } else {
            displayPerc = .2;
        }
        console.log(displayPerc);
    }    
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
        "unit":"Lyrilily",
        "display":"Lyrical Lily"
    },
    {
        "unit":"Common",
        "display":"Other"
    }
];
var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", 
                    "Noa", "Rika", "Marika", "Saori", "Dalia", "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru"];
