var refreshSelect;

$(document).ready(function() {
    $.refreshSelect = function() {
        $('.selectpicker').selectpicker('refresh');
    };
})


// Display every card in a dropdown. This is the default
function displayCardsDropdown(arr, id) {
   
    var select = document.createElement("select");
    select.name = "cards_" + id;
    select.id = "cards_" + id;
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    var i;
    for(i = 0; i < arr.length; i++) {
        var option = document.createElement("option");
        option.value = arr[i].id;
        option.text = arr[i].character + ' - ' + arr[i].cardname;
        option.setAttribute("data-tokens", arr[i].type.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/type_" + arr[i].type.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        select.appendChild(option);
    }

    var label = document.createElement("label");
    label.innerHTML = "Choose a card";
    label.htmlFor = "cards_" + id;

    document.getElementById(id).appendChild(label).appendChild(select);
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

function generateFilters(arr, id) {
    // Remove old dropdown
    var elem = document.getElementById(id);
    if (elem) {
        elem.remove();
        var newElem = document.createElement("div");
        newElem.id = id;
        document.getElementById(id + "_wrapper").appendChild(newElem);
    }

    // // Sort functions
    // if (sort === "" || sort === "character") { // Default sort is character
    //     arr.sort(sort_by('character'), false, (a) => a.toUpperCase());
    // } else if (sort === "heart" || sort === "technical" || sort === "physical") {
    //     arr.sort(sort_by(sort, true, parseInt));
    // }

    // Character filters
    filters = document.getElementsByClassName(id + "_filter_char");
    var filterArray = [];
    var hasFilter = false;
    for (let x of filters) {
        if (x.checked) {
            hasFilter = true;
            filterArray.push(o=>o.character.includes(x.value));
        }
    }

    if (hasFilter) {
        arr = arr.filter(o => filterArray.some(fn => fn(o)));
    }
    

    // Type filters
    filters = document.getElementsByClassName(id + "_filter_type");
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

    displayCardsDropdown(arr, id);

    $.refreshSelect();
}

// deprecated in favor of using dropdown, for now
function displayCardsTable(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        var newRow = document.createElement("tr");
        newRow.setAttribute("scope","row");
        var id = document.createElement("td");
        id.innerHTML = arr[i].id;
        var character = document.createElement("td");
        character.innerHTML = arr[i].character;
        var cardname = document.createElement("td");
        cardname.innerHTML = arr[i].cardname;
        var unit = document.createElement("td");
        unit.innerHTML = arr[i].unit;
        newRow.append(id);
        newRow.append(character);
        newRow.append(cardname);
        newRow.append(unit);
        document.getElementById("cardRows").appendChild(newRow);
    }
}