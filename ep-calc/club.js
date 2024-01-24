var refreshClubSelect;

$(document).ready(function() {
    $.refreshClubSelect = function() {
        $('.selectpicker.clubselect').selectpicker('refresh');
    };
})

jQuery(function($) {
    $('#autoClub').on('click', function() {
        autoClub();
    });
});

/*
    Set all club dropdowns to default values
*/
function refreshClubSelects() {
    for (let type of clubTypesDisplay) {
        document.getElementById("club-" + type).value = "rinku";
    }

    for (let type of clubTypes1) {
        document.getElementById("club-" + type).value = "rinku";
    }

    for (let type of clubTypes2) {
        document.getElementById("club-" + type).value = "hapiara";
    }

    for (let type of clubTypes3) {
        document.getElementById("club-" + type).value = "snowman";
    }

    for (let type of clubTypes4) {
        document.getElementById("club-" + type).value = "out-yuka";
    }

    for (let type of clubTypes5) {
        document.getElementById("club-" + type).value = "mizuhiki";
    }

    $.refreshClubSelect();
}

function createClubSelects() {
    for (let type of clubTypesDisplay) {
        var select = createClubSelect(clubItemsDisplay, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }

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

    for (let type of clubTypes4) {
        var select = createClubSelect(clubItems4, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }

    for (let type of clubTypes5) {
        var select = createClubSelect(clubItems5, "club-" + type);
        document.getElementById("club-" + type + "-div").appendChild(select);
    }

    generateClubArrays();
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
        } else if (obj[x].type === "decoration" || obj[x].type === "frameline") {
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

function autoClub() {

    // Get strongest member, and unit/style counts from current team
    var highestPower = 0;
    var highestChar = "";
    var clubUse = "";
    var chars = {};
    var styleArr = [];
    var unitArr = [];
    for (let i = 1; i <= 4; i++) {
        var tempPower = document.getElementById("m" + i + "_cardpower").innerHTML;
        var char = document.getElementById("m" + i + "_char").innerHTML;
        chars[char] = tempPower;

        if (tempPower > highestPower) {
            highestPower = tempPower;
            highestChar = char;
        }

        if (tempPower != 0) {
            styleArr.push(document.getElementById("m" + i + "_type").innerHTML.toLowerCase());
            unitArr.push(document.getElementById("m" + i + "_unit").innerHTML.toLowerCase());
        }
    }

    charArray = Object.entries(chars);
    charArray.sort((a, b) => b[1] - a[1]);

    // Don't bother setting club items if a team isn't built yet
    if (highestPower != 0) {
        var styleNum = 0;
        var unitNum = 0;
        var styleUse = "";
        var unitUse = "";
        var styleCount = {};
        var unitCount = {};
        styleArr.forEach(function(i) { styleCount[i] = (styleCount[i]||0) + 1;});
        unitArr.forEach(function(i) { unitCount[i] = (unitCount[i]||0) + 1;});
        for (var key of Object.keys(styleCount)) {
            styleNum = styleCount[key];
            if (styleNum >= 3) {
                styleUse = key;
                break;
            }            
        }
        for (var key of Object.keys(unitCount)) {
            unitNum = unitCount[key];
            if (unitNum >= 3) {
                unitUse = key;
                break;
            }            
        }

        // Unichord and Abyssmare club items exist now
        if (unitNum >= styleNum) {
            if (unitUse !== "") {
                clubUse = unitUse;
            } else {
                clubUse = "common";
            }
        } else {
            if (styleUse !== "") {
                clubUse = styleUse;
            } else {
                clubUse = "common";
            }
        }

        for (var type of clubTypesDisplay) {
            $("select[name=club-" + type + "]").val(highestChar);
        }

        for (var type of clubTypes1) {
            $("select[name=club-" + type + "]").val(highestChar);
        }
    
        for (var type of clubTypes2) {
            $("select[name=club-" + type + "]").val(clubUse);
        }

        // Set the decoration item 
        // Since the decorations are all 2%, no point in setting it during auto

        // Set the outframe item
        // Set yuka by default
        $("select[name=club-outframe]").val("out-yuka");
        for (var char of charArray) {
            if (containsChar(char[0])) {
                $("select[name=club-outframe]").val("out-" + char[0]);
                break;
            }
        }

        // Set the frameline item
        // Since all frameline items are 1%, no point in setting it
    
        $.refreshClubSelect();

        calcClubPower();
        calcDisplayPower();
        calcDisplayParams();
    }
}

function containsChar(char) {
    for (let key in clubItems4) {
        if (clubItems4.hasOwnProperty(key)) {
            const value = clubItems4[key];
            if (value.name === char) {
                return true;
            }
        }
    }
    
    return false;
}

var clubTypesDisplay = ["display"];
var clubTypes1 = ["djbooth", "discl", "discr"];
var clubTypes2 = ["front", "side", "back", "frame", "light", "accessory"];
var clubTypes3 = ["decoration"];
var clubTypes4 = ["outframe"];
var clubTypes5 = ["frameline"];
var clubArrayDisplay = [];
var clubArray1 = [];
var clubArray2 = [];
var clubArray3 = [];
var clubArray4 = [];
var clubArray5 = [];

function generateClubArrays() {
    for (var x in clubItemsDisplay) {
        clubArrayDisplay.push(x);
    }

    for (var x in clubItems1) {
        clubArray1.push(x);
    }

    for (var x in clubItems2) {
        clubArray2.push(x);
    }

    for (var x in clubItems3) {
        clubArray3.push(x);
    }

    for (var x in clubItems4) {
        clubArray4.push(x);
    }

    for (var x in clubItems5) {
        clubArray5.push(x);
    }
}

var clubItemsDisplay = {
    "hapiara": {
        "name":"hapiara",
        "displayname":"Happy Around",
        "type":"unit",
        "bonus":.03
    },
    "peaky": {
        "name":"peaky",
        "displayname":"Peaky P-Key",
        "type":"unit",
        "bonus":.03
    },
    "photon": {
        "name":"photon",
        "displayname":"Photon Maiden",
        "type":"unit",
        "bonus":.03
    },
    "mermaid": {
        "name":"mermaid",
        "displayname":"Merm4id",
        "type":"unit",
        "bonus":.03
    },
    "rondo": {
        "name":"rondo",
        "displayname":"RONDO",
        "type":"unit",
        "bonus":.03
    },
    "lyrilily": {
        "name":"lyrilily",
        "displayname":"Lyrical Lily",
        "type":"unit",
        "bonus":.03
    },
    "unichord": {
        "name":"unichord",
        "displayname":"UniChØrd",
        "type":"unit",
        "bonus":.03
    },
    "abyssmare": {
        "name":"abyssmare",
        "displayname":"Abyssmare",
        "type":"unit",
        "bonus":.03
    },
    "callofartemis": {
        "name":"callofartemis",
        "displayname":"Call of Artemis",
        "type":"unit",
        "bonus":.03
    },
    "common": {
        "name":"common",
        "displayname":"All Units",
        "type":"all",
        "bonus":.02
    },
    "street": {
        "name":"street",
        "displayname":"Street",
        "type":"type",
        "bonus":.03
    },
    "party": {
        "name":"party",
        "displayname":"Party",
        "type":"type",
        "bonus":.03
    },
    "cute": {
        "name":"cute",
        "displayname":"Cute",
        "type":"type",
        "bonus":.03
    },
    "elegant": {
        "name":"elegant",
        "displayname":"Elegant",
        "type":"type",
        "bonus":.03
    },
    "cool": {
        "name":"cool",
        "displayname":"Cool",
        "type":"type",
        "bonus":.03
    },
    "rinku": {
        "name":"rinku",
        "displayname":"Rinku",
        "type":"character",
        "bonus":.12
    },
    "maho": {
        "name":"maho",
        "displayname":"Maho",
        "type":"character",
        "bonus":.12
    },
    "muni": {
        "name":"muni",
        "displayname":"Muni",
        "type":"character",
        "bonus":.12
    },
    "rei": {
        "name":"rei",
        "displayname":"Rei",
        "type":"character",
        "bonus":.12
    },
    "kyoko": {
        "name":"kyoko",
        "displayname":"Kyoko",
        "type":"character",
        "bonus":.12
    },
    "shinobu": {
        "name":"shinobu",
        "displayname":"Shinobu",
        "type":"character",
        "bonus":.12
    },
    "yuka": {
        "name":"yuka",
        "displayname":"Yuka",
        "type":"character",
        "bonus":.12
    },
    "esora": {
        "name":"esora",
        "displayname":"Esora",
        "type":"character",
        "bonus":.12
    },
    "saki": {
        "name":"saki",
        "displayname":"Saki",
        "type":"character",
        "bonus":.12
    },
    "ibuki": {
        "name":"ibuki",
        "displayname":"Ibuki",
        "type":"character",
        "bonus":.12
    },
    "towa": {
        "name":"towa",
        "displayname":"Towa",
        "type":"character",
        "bonus":.12
    },
    "noa": {
        "name":"noa",
        "displayname":"Noa",
        "type":"character",
        "bonus":.12
    },
    "rika": {
        "name":"rika",
        "displayname":"Rika",
        "type":"character",
        "bonus":.12
    },
    "marika": {
        "name":"marika",
        "displayname":"Marika",
        "type":"character",
        "bonus":.12
    },
    "saori": {
        "name":"saori",
        "displayname":"Saori",
        "type":"character",
        "bonus":.12
    },
    "dalia": {
        "name":"dalia",
        "displayname":"Dalia",
        "type":"character",
        "bonus":.12
    },
    "tsubaki": {
        "name":"tsubaki",
        "displayname":"Tsubaki",
        "type":"character",
        "bonus":.12
    },
    "nagisa": {
        "name":"nagisa",
        "displayname":"Nagisa",
        "type":"character",
        "bonus":.12
    },
    "hiiro": {
        "name":"hiiro",
        "displayname":"Hiiro",
        "type":"character",
        "bonus":.12
    },
    "aoi": {
        "name":"aoi",
        "displayname":"Aoi",
        "type":"character",
        "bonus":.12
    },
    "miyu": {
        "name":"miyu",
        "displayname":"Miyu",
        "type":"character",
        "bonus":.12
    },
    "haruna": {
        "name":"haruna",
        "displayname":"Haruna",
        "type":"character",
        "bonus":.12
    },
    "kurumi": {
        "name":"kurumi",
        "displayname":"Kurumi",
        "type":"character",
        "bonus":.12
    },
    "miiko": {
        "name":"miiko",
        "displayname":"Miiko",
        "type":"character",
        "bonus":.12
    },
    "michiru": {
        "name":"michiru",
        "displayname":"Michiru",
        "type":"character",
        "bonus":.12
    },
    "lumina": {
        "name":"lumina",
        "displayname":"Lumina",
        "type":"character",
        "bonus":.12
    },
    "kokoa": {
        "name":"kokoa",
        "displayname":"Kokoa",
        "type":"character",
        "bonus":.12
    },
    "hayate": {
        "name":"hayate",
        "displayname":"Hayate",
        "type":"character",
        "bonus":.12
    },
    "neo": {
        "name":"neo",
        "displayname":"Neo",
        "type":"character",
        "bonus":.12
    },
    "sophia": {
        "name":"sophia",
        "displayname":"Sophia",
        "type":"character",
        "bonus":.12
    },
    "elsie": {
        "name":"elsie",
        "displayname":"Elsie",
        "type":"character",
        "bonus":.12
    },
    "weronika": {
        "name":"weronika",
        "displayname":"Weronika",
        "type":"character",
        "bonus":.12
    },
    "toka": {
        "name":"toka",
        "displayname":"Toka",
        "type":"character",
        "bonus":.12
    },
    "shano": {
        "name":"shano",
        "displayname":"Shano",
        "type":"character",
        "bonus":.12
    },
    "mana": {
        "name":"mana",
        "displayname":"Mana",
        "type":"character",
        "bonus":.12
    },
    "airi": {
        "name":"airi",
        "displayname":"Airi",
        "type":"character",
        "bonus":.12
    }
}

var clubItems1 = {
    "hapiara": {
        "name":"hapiara",
        "displayname":"Happy Around",
        "type":"unit",
        "bonus":.03
    },
    "peaky": {
        "name":"peaky",
        "displayname":"Peaky P-Key",
        "type":"unit",
        "bonus":.03
    },
    "photon": {
        "name":"photon",
        "displayname":"Photon Maiden",
        "type":"unit",
        "bonus":.03
    },
    "mermaid": {
        "name":"mermaid",
        "displayname":"Merm4id",
        "type":"unit",
        "bonus":.03
    },
    "rondo": {
        "name":"rondo",
        "displayname":"RONDO",
        "type":"unit",
        "bonus":.03
    },
    "lyrilily": {
        "name":"lyrilily",
        "displayname":"Lyrical Lily",
        "type":"unit",
        "bonus":.03
    },
    "unichord": {
        "name":"unichord",
        "displayname":"UniChØrd",
        "type":"unit",
        "bonus":.03
    },
    "abyssmare": {
        "name":"abyssmare",
        "displayname":"Abyssmare",
        "type":"unit",
        "bonus":.03
    },
    "callofartemis": {
        "name":"callofartemis",
        "displayname":"Call of Artemis",
        "type":"unit",
        "bonus":.03
    },
    "common": {
        "name":"common",
        "displayname":"All Units",
        "type":"all",
        "bonus":.02
    },
    "rinku": {
        "name":"rinku",
        "displayname":"Rinku",
        "type":"character",
        "bonus":.12
    },
    "maho": {
        "name":"maho",
        "displayname":"Maho",
        "type":"character",
        "bonus":.12
    },
    "muni": {
        "name":"muni",
        "displayname":"Muni",
        "type":"character",
        "bonus":.12
    },
    "rei": {
        "name":"rei",
        "displayname":"Rei",
        "type":"character",
        "bonus":.12
    },
    "kyoko": {
        "name":"kyoko",
        "displayname":"Kyoko",
        "type":"character",
        "bonus":.12
    },
    "shinobu": {
        "name":"shinobu",
        "displayname":"Shinobu",
        "type":"character",
        "bonus":.12
    },
    "yuka": {
        "name":"yuka",
        "displayname":"Yuka",
        "type":"character",
        "bonus":.12
    },
    "esora": {
        "name":"esora",
        "displayname":"Esora",
        "type":"character",
        "bonus":.12
    },
    "saki": {
        "name":"saki",
        "displayname":"Saki",
        "type":"character",
        "bonus":.12
    },
    "ibuki": {
        "name":"ibuki",
        "displayname":"Ibuki",
        "type":"character",
        "bonus":.12
    },
    "towa": {
        "name":"towa",
        "displayname":"Towa",
        "type":"character",
        "bonus":.12
    },
    "noa": {
        "name":"noa",
        "displayname":"Noa",
        "type":"character",
        "bonus":.12
    },
    "rika": {
        "name":"rika",
        "displayname":"Rika",
        "type":"character",
        "bonus":.12
    },
    "marika": {
        "name":"marika",
        "displayname":"Marika",
        "type":"character",
        "bonus":.12
    },
    "saori": {
        "name":"saori",
        "displayname":"Saori",
        "type":"character",
        "bonus":.12
    },
    "dalia": {
        "name":"dalia",
        "displayname":"Dalia",
        "type":"character",
        "bonus":.12
    },
    "tsubaki": {
        "name":"tsubaki",
        "displayname":"Tsubaki",
        "type":"character",
        "bonus":.12
    },
    "nagisa": {
        "name":"nagisa",
        "displayname":"Nagisa",
        "type":"character",
        "bonus":.12
    },
    "hiiro": {
        "name":"hiiro",
        "displayname":"Hiiro",
        "type":"character",
        "bonus":.12
    },
    "aoi": {
        "name":"aoi",
        "displayname":"Aoi",
        "type":"character",
        "bonus":.12
    },
    "miyu": {
        "name":"miyu",
        "displayname":"Miyu",
        "type":"character",
        "bonus":.12
    },
    "haruna": {
        "name":"haruna",
        "displayname":"Haruna",
        "type":"character",
        "bonus":.12
    },
    "kurumi": {
        "name":"kurumi",
        "displayname":"Kurumi",
        "type":"character",
        "bonus":.12
    },
    "miiko": {
        "name":"miiko",
        "displayname":"Miiko",
        "type":"character",
        "bonus":.12
    },
    "michiru": {
        "name":"michiru",
        "displayname":"Michiru",
        "type":"character",
        "bonus":.12
    },
    "lumina": {
        "name":"lumina",
        "displayname":"Lumina",
        "type":"character",
        "bonus":.12
    },
    "kokoa": {
        "name":"kokoa",
        "displayname":"Kokoa",
        "type":"character",
        "bonus":.12
    },
    "hayate": {
        "name":"hayate",
        "displayname":"Hayate",
        "type":"character",
        "bonus":.12
    },
    "neo": {
        "name":"neo",
        "displayname":"Neo",
        "type":"character",
        "bonus":.12
    },
    "sophia": {
        "name":"sophia",
        "displayname":"Sophia",
        "type":"character",
        "bonus":.12
    },
    "elsie": {
        "name":"elsie",
        "displayname":"Elsie",
        "type":"character",
        "bonus":.12
    },
    "weronika": {
        "name":"weronika",
        "displayname":"Weronika",
        "type":"character",
        "bonus":.12
    },
    "toka": {
        "name":"toka",
        "displayname":"Toka",
        "type":"character",
        "bonus":.12
    },
    "shano": {
        "name":"shano",
        "displayname":"Shano",
        "type":"character",
        "bonus":.12
    },
    "mana": {
        "name":"mana",
        "displayname":"Mana",
        "type":"character",
        "bonus":.12
    },
    "airi": {
        "name":"airi",
        "displayname":"Airi",
        "type":"character",
        "bonus":.12
    }
}

var clubItems2 = {
    "hapiara": {
        "name":"hapiara",
        "displayname":"Happy Around",
        "type":"unit",
        "bonus":.03
    },
    "peaky": {
        "name":"peaky",
        "displayname":"Peaky P-Key",
        "type":"unit",
        "bonus":.03
    },
    "photon": {
        "name":"photon",
        "displayname":"Photon Maiden",
        "type":"unit",
        "bonus":.03
    },
    "mermaid": {
        "name":"mermaid",
        "displayname":"Merm4id",
        "type":"unit",
        "bonus":.03
    },
    "rondo": {
        "name":"rondo",
        "displayname":"RONDO",
        "type":"unit",
        "bonus":.03
    },
    "lyrilily": {
        "name":"lyrilily",
        "displayname":"Lyrical Lily",
        "type":"unit",
        "bonus":.03
    },
    "unichord": {
        "name":"unichord",
        "displayname":"UniChØrd",
        "type":"unit",
        "bonus":.03
    },
    "abyssmare": {
        "name":"abyssmare",
        "displayname":"Abyssmare",
        "type":"unit",
        "bonus":.03
    },
    "callofartemis": {
        "name":"callofartemis",
        "displayname":"Call of Artemis",
        "type":"unit",
        "bonus":.03
    },
    "common": {
        "name":"common",
        "displayname":"All Units",
        "type":"all",
        "bonus":.02
    },
    "street": {
        "name":"street",
        "displayname":"Street",
        "type":"type",
        "bonus":.03
    },
    "party": {
        "name":"party",
        "displayname":"Party",
        "type":"type",
        "bonus":.03
    },
    "cute": {
        "name":"cute",
        "displayname":"Cute",
        "type":"type",
        "bonus":.03
    },
    "elegant": {
        "name":"elegant",
        "displayname":"Elegant",
        "type":"type",
        "bonus":.03
    },
    "cool": {
        "name":"cool",
        "displayname":"Cool",
        "type":"type",
        "bonus":.03
    }
}

var clubItems3 = {
    "snowman": {
        "name":"snowman",
        "displayname":"Snowman",
        "type":"decoration",
        "bonus":.02
    },
    "wings": {
        "name":"wings",
        "displayname":"Wings",
        "type":"decoration",
        "bonus":.02
    },
    "archwings": {
        "name":"archwings",
        "displayname":"Archangel Wings",
        "type":"decoration",
        "bonus":.02
    }
}

var clubItems4 = {
    "out-yuka": {
        "name":"yuka",
        "displayname":"Yuka",
        "type":"character",
        "bonus":.02
    },
    "out-saori": {
        "name":"saori",
        "displayname":"Saori",
        "type":"character",
        "bonus":.02
    },
    "out-miyu": {
        "name":"miyu",
        "displayname":"Miyu",
        "type":"character",
        "bonus":.02
    },
    "out-kurumi": {
        "name":"kurumi",
        "displayname":"Kurumi",
        "type":"character",
        "bonus":.02
    },
    "out-tsubaki": {
        "name":"tsubaki",
        "displayname":"Tsubaki",
        "type":"character",
        "bonus":.02
    },
    "out-michiru": {
        "name":"michiru",
        "displayname":"Michiru",
        "type":"character",
        "bonus":.02
    }
}

var clubItems5 = {
    "mizuhiki": {
        "name":"mizuhiki",
        "displayname":"Japanese Mizuhiki Art",
        "type":"frameline",
        "bonus":.01
    }
}