var refreshClubSelect;

$(document).ready(function() {
    $.refreshClubSelect = function() {
        $('.selectpicker.clubselect').selectpicker('refresh');
    };
})

/*
    Set all club dropdowns to default values
*/
function refreshClubSelects() {
    for (let type of clubTypes1) {
        document.getElementById("club-" + type).value = "1";
    }

    for (let type of clubTypes2) {
        document.getElementById("club-" + type).value = "1";
    }

    for (let type of clubTypes3) {
        document.getElementById("club-" + type).value = "1";
    }

    $.refreshClubSelect();
}

function createClubSelects() {
    for (let type of clubTypes1) {
        var select = createClubSelect(clubItems1, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }

    for (let type of clubTypes2) {
        var select = createClubSelect(clubItems2, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }

    for (let type of clubTypes3) {
        var select = createClubSelect(clubItems3, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }
}

function createClubSelect(obj, id) {
    var tempSelect = document.createElement("select");
    tempSelect.name = id;
    tempSelect.id = id;
    tempSelect.classList.add("selectpicker");
    tempSelect.classList.add("clubselect");
    tempSelect.setAttribute("data-live-search","true");
    tempSelect.setAttribute("data-width","fit");
    tempSelect.setAttribute("data-size","10");

    for (var x in obj) {
        option = document.createElement("option");
        option.value = x;
        option.text = obj[x].displayname;
        option.setAttribute("data-content", option.text);
        if (obj[x].type === "type") {
            option.setAttribute("data-content","<img src='../icons/type_" + obj[x].name.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        } else if (obj[x].type === "decoration") {
            option.setAttribute("data-content",option.text);
        } else if (obj[x].type === "character") {
            option.setAttribute("data-content","<img src='../icons/icon_" + obj[x].name.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + option.text);
        } else {
            option.setAttribute("data-content","<img src='../icons/icon_" + obj[x].name.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        }
        tempSelect.appendChild(option);
    }
    return tempSelect;
}

var clubTypes1 = ["display", "djbooth", "discl", "discr"];
var clubTypes2 = ["front", "side", "back", "frame", "light", "accessory"];
var clubTypes3 = ["decoration"];

var clubItems1 = {
    "1": {
        "name":"hapiara",
        "displayname":"Happy Around",
        "type":"unit",
        "bonus":.03
    },
    "2": {
        "name":"peaky",
        "displayname":"Peaky P-Key",
        "type":"unit",
        "bonus":.03
    },
    "3": {
        "name":"photon",
        "displayname":"Photon Maiden",
        "type":"unit",
        "bonus":.03
    },
    "4": {
        "name":"mermaid",
        "displayname":"Merm4id",
        "type":"unit",
        "bonus":.03
    },
    "5": {
        "name":"rondo",
        "displayname":"RONDO",
        "type":"unit",
        "bonus":.03
    },
    "6": {
        "name":"lyrilily",
        "displayname":"Lyrical Lily",
        "type":"unit",
        "bonus":.03
    },
    "7": {
        "name":"common",
        "displayname":"All Units",
        "type":"all",
        "bonus":.02
    },
    "8": {
        "name":"rinku",
        "displayname":"Rinku",
        "type":"character",
        "bonus":.12
    },
    "9": {
        "name":"maho",
        "displayname":"Maho",
        "type":"character",
        "bonus":.12
    },
    "10": {
        "name":"muni",
        "displayname":"Muni",
        "type":"character",
        "bonus":.12
    },
    "11": {
        "name":"rei",
        "displayname":"Rei",
        "type":"character",
        "bonus":.12
    },
    "12": {
        "name":"kyoko",
        "displayname":"Kyoko",
        "type":"character",
        "bonus":.12
    },
    "13": {
        "name":"shinobu",
        "displayname":"Shinobu",
        "type":"character",
        "bonus":.12
    },
    "14": {
        "name":"yuka",
        "displayname":"Yuka",
        "type":"character",
        "bonus":.12
    },
    "15": {
        "name":"esora",
        "displayname":"Esora",
        "type":"character",
        "bonus":.12
    },
    "16": {
        "name":"saki",
        "displayname":"Saki",
        "type":"character",
        "bonus":.12
    },
    "17": {
        "name":"ibuki",
        "displayname":"Ibuki",
        "type":"character",
        "bonus":.12
    },
    "18": {
        "name":"towa",
        "displayname":"Towa",
        "type":"character",
        "bonus":.12
    },
    "19": {
        "name":"noa",
        "displayname":"Noa",
        "type":"character",
        "bonus":.12
    },
    "20": {
        "name":"rika",
        "displayname":"Rika",
        "type":"character",
        "bonus":.12
    },
    "21": {
        "name":"marika",
        "displayname":"Marika",
        "type":"character",
        "bonus":.12
    },
    "22": {
        "name":"saori",
        "displayname":"Saori",
        "type":"character",
        "bonus":.12
    },
    "23": {
        "name":"dalia",
        "displayname":"Dalia",
        "type":"character",
        "bonus":.12
    },
    "24": {
        "name":"tsubaki",
        "displayname":"Tsubaki",
        "type":"character",
        "bonus":.12
    },
    "25": {
        "name":"nagisa",
        "displayname":"Nagisa",
        "type":"character",
        "bonus":.12
    },
    "26": {
        "name":"hiiro",
        "displayname":"Hiiro",
        "type":"character",
        "bonus":.12
    },
    "27": {
        "name":"aoi",
        "displayname":"Aoi",
        "type":"character",
        "bonus":.12
    },
    "28": {
        "name":"miyu",
        "displayname":"Miyu",
        "type":"character",
        "bonus":.12
    },
    "29": {
        "name":"haruna",
        "displayname":"Haruna",
        "type":"character",
        "bonus":.12
    },
    "30": {
        "name":"kurumi",
        "displayname":"Kurumi",
        "type":"character",
        "bonus":.12
    },
    "31": {
        "name":"miiko",
        "displayname":"Miiko",
        "type":"character",
        "bonus":.12
    },
    "32": {
        "name":"michiru",
        "displayname":"Michiru",
        "type":"character",
        "bonus":.12
    }
}

var clubItems2 = {
    "1": {
        "name":"hapiara",
        "displayname":"Happy Around",
        "type":"unit",
        "bonus":.03
    },
    "2": {
        "name":"peaky",
        "displayname":"Peaky P-Key",
        "type":"unit",
        "bonus":.03
    },
    "3": {
        "name":"photon",
        "displayname":"Photon Maiden",
        "type":"unit",
        "bonus":.03
    },
    "4": {
        "name":"mermaid",
        "displayname":"Merm4id",
        "type":"unit",
        "bonus":.03
    },
    "5": {
        "name":"rondo",
        "displayname":"RONDO",
        "type":"unit",
        "bonus":.03
    },
    "6": {
        "name":"lyrilily",
        "displayname":"Lyrical Lily",
        "type":"unit",
        "bonus":.03
    },
    "7": {
        "name":"common",
        "displayname":"All Units",
        "type":"all",
        "bonus":.02
    },
    "8": {
        "name":"street",
        "displayname":"Street",
        "type":"type",
        "bonus":.03
    },
    "9": {
        "name":"party",
        "displayname":"Party",
        "type":"type",
        "bonus":.03
    },
    "10": {
        "name":"cute",
        "displayname":"Cute",
        "type":"type",
        "bonus":.03
    },
    "11": {
        "name":"elegant",
        "displayname":"Elegant",
        "type":"type",
        "bonus":.03
    },
    "12": {
        "name":"cool",
        "displayname":"Cool",
        "type":"type",
        "bonus":.03
    }
}

var clubItems3 = {
    "1": {
        "name":"snowman",
        "displayname":"Snowman",
        "type":"decoration",
        "bonus":.02
    },
    "2": {
        "name":"wings",
        "displayname":"Wings",
        "type":"decoration",
        "bonus":.02
    },
    "3": {
        "name":"archwings",
        "displayname":"Archangel Wings",
        "type":"decoration",
        "bonus":.02
    }
}