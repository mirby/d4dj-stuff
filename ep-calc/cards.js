var refreshSelect;

$(document).ready(function() {
    $.refreshSelect = function() {
        $('.selectpicker').selectpicker('refresh');
    };
})

$(document).on('changed.bs.select', 'select', function() {
    fillStat(cards[$(this).val()]);
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
});

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
    img.width = '40';
    img.height = '40';
    if (document.getElementById("charImageWrapper").hasChildNodes()) {
        document.getElementById("charImageWrapper").removeChild(document.getElementById("charImageWrapper").firstChild);
    }
    document.getElementById("charImageWrapper").appendChild(img);

    img = document.createElement('img');
    img.width = '40';
    img.height = '40';
    img.src = "../icons/icon_" + obj.unit.toLowerCase() + ".png";
    if (document.getElementById("unitImageWrapper").hasChildNodes()) {
        document.getElementById("unitImageWrapper").removeChild(document.getElementById("unitImageWrapper").firstChild);
    }
    document.getElementById("unitImageWrapper").appendChild(img);

    img = document.createElement('img');
    img.width = '40';
    img.height = '40';
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

    $.refreshSelect();
}

// Create all the character filters when the page is loaded
function createCharacterFilters() {

    units.forEach(function(x) {
        var newInput = document.createElement("input");
        newInput.type = "checkbox";
        newInput.id = "filter_" + x;
        newInput.name = "filter_" + x;
        newInput.classList.add("filter_char");
        newInput.classList.add("d4dj_filter");
        newInput.value = x;

        var newLabel = document.createElement("label");
        newLabel.setAttribute("for", "filter_" + x);
        newLabel.classList.add("filter_label");
        newLabel.innerHTML = "<img src='../icons/icon_" + x.toLowerCase() + ".png' width='30' height='30'></img>" + x;

        document.getElementById("filter-character").appendChild(newInput);
        document.getElementById("filter-character").appendChild(newLabel);
    });

    var filters = document.querySelectorAll(".filter_char");
    filters.forEach(function(x) {
        x.addEventListener("click", function() {
            generateFilters(cardArray);
        });
    });
}

var units = ["HapiAra", "Peaky", "Photon", "Mermaid", "Rondo", "LyriLily", "Common"];
var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", 
                    "Noa", "Rika", "Marika", "Saori", "Dalia", "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru"];