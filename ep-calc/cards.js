var refreshSelect;

$(document).ready(function() {
    $.refreshSelect = function() {
        $('.selectpicker').selectpicker('refresh');
    };
})

jQuery(function($) {
    $('#showFilter').on('click', function() {
        var text=$('#showFilter').text();
        if (text === "Show Filters") {
            $(this).text("Hide Filters");
        } else {
            $(this).text("Show Filters");
        }
    });

    $(document).on('changed.bs.select', 'select', function() {
        console.log(cards[$(this).val()]);
        console.log(cards[$(this).val()].character);
    });
});

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
    for(i = 0; i < arr.length; i++) {
        var option = document.createElement("option");
        option.value = arr[i].id;
        option.text = arr[i].character + ' - ' + arr[i].cardname;
        option.setAttribute("data-tokens", arr[i].type.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/type_" + arr[i].type.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        select.appendChild(option);
    }

    var label = document.createElement("label");
    label.innerHTML = "Choose a card to view stats: ";
    label.htmlFor = "cards";

    document.getElementById("cardDropdown").appendChild(label).appendChild(select);
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

function generateFilters(arr) {
    // Remove old dropdown
    var elem = document.getElementById("cardDropdown");
    if (elem) {
        elem.remove();
        var newElem = document.createElement("div");
        newElem.id = "cardDropdown";
        document.getElementById("cardDropdown_wrapper").appendChild(newElem);
    }

    // // Sort functions
    // if (sort === "" || sort === "character") { // Default sort is character
    //     arr.sort(sort_by('character'), false, (a) => a.toUpperCase());
    // } else if (sort === "heart" || sort === "technical" || sort === "physical") {
    //     arr.sort(sort_by(sort, true, parseInt));
    // }

    // Character filters
    filters = document.getElementsByClassName("filter_char");
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

    displayCardsDropdown(arr);

    $.refreshSelect();
}

function createCharacterFilters() {
    var i = 1;
    characters.forEach(function(x) {
        var newInput = document.createElement("input");
        newInput.type = "checkbox";
        newInput.id = "filter_" + x;
        newInput.name = "filter_" + x;
        newInput.classList.add("filter_char");
        newInput.value = x;

        var newLabel = document.createElement("label");
        newLabel.setAttribute("for", "filter_" + x);
        newLabel.classList.add("filter_label");
        newLabel.innerHTML = "<img src='../icons/icon_" + x.toLowerCase() + ".png' width='30' height='30'></img>" + x;

        document.getElementById("filter-character").appendChild(newInput);
        document.getElementById("filter-character").appendChild(newLabel);

        if ((i % 4) == 0) {
            var br = document.createElement("br");
            document.getElementById("filter-character").appendChild(br);
        }
        i++;
    });

    var filters = document.querySelectorAll(".filter_char");
    filters.forEach(function(x) {
        x.addEventListener("click", function() {
            generateFilters(cardArray);
        });
    });
}

var characters = ["Rinku", "Maho", "Muni", "Rei", "Kyoko", "Shinobu", "Yuka", "Esora", "Saki", "Ibuki", "Towa", 
                    "Noa", "Rika", "Marika", "Saori", "Dalia", "Tsubaki", "Nagisa", "Hiiro", "Aoi", "Miyu", "Haruna", "Kurumi", "Miiko", "Michiru"];