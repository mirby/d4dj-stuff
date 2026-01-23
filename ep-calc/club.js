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
        document.getElementById("club-" + type).value = "out-kvtapestry";
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

    let highestPower = 0;
    let highestChar = "";
    let clubUse = "";

    const chars = {};
    const styleData = {};
    const unitData = {};

    for (let i = 1; i <= 4; i++) {
        const power = Number(document.getElementById(`m${i}_cardpower`).innerHTML);
        const char  = document.getElementById(`m${i}_char`).innerHTML;
        const style = document.getElementById(`m${i}_type`).innerHTML.toLowerCase();
        const unit  = document.getElementById(`m${i}_unit`).innerHTML.toLowerCase();

        chars[char] = power;

        if (power > highestPower) {
            highestPower = power;
            highestChar = char;
        }

        if (power !== 0) {
            styleData[style] ??= { count: 0, power: 0 };
            unitData[unit]   ??= { count: 0, power: 0 };

            styleData[style].count++;
            styleData[style].power += power;

            unitData[unit].count++;
            unitData[unit].power += power;
        }
    }

    // helper to find the best entry
    const getBest = (data) => {
        let bestKey = "";
        let best = { count: 0, power: 0 };

        for (const [key, val] of Object.entries(data)) {
            if (val.count >= 3 && val.count > best.count) {
                bestKey = key;
                best = val;
            }
        }
        return { key: bestKey, ...best };
    };

    if (highestPower !== 0) {
        const bestStyle = getBest(styleData);
        const bestUnit  = getBest(unitData);

        // tie-breaker: both counts exactly 3 → compare total cardpower
        if (bestStyle.count === 3 && bestUnit.count === 3) {
            clubUse = bestStyle.power >= bestUnit.power
                ? bestStyle.key
                : bestUnit.key;
        } 
        // otherwise, normal comparison
        else if (bestUnit.count >= bestStyle.count) {
            clubUse = bestUnit.key || "common2";
        } else {
            clubUse = bestStyle.key || "common2";
        }

        for (var type of clubTypesDisplay) {
            $("select[name=club-" + type + "]").val(highestChar);
        }

        for (var type of clubTypes1) {
            $("select[name=club-" + type + "]").val(highestChar);
        }
    
        for (var type of clubTypes2) {
            // FIXME Hack to not use the new 2.5 type for frame or accessory slot until they add it
            if (clubUse === "common2" && (type === "frame" || type === "accessory")) {
                $("select[name=club-" + type + "]").val("common");
                continue;
            }

            $("select[name=club-" + type + "]").val(clubUse);
        }

        // Set the decoration item 
        // All decorations are 2%

        // 3rd anni added KV Tapestry item, which gives flat 2% bonus to both slots, meaning 4% total
        // Leave this section commented out in case there becomes more choices in future
        $("select[name=club-outframe]").val("out-kvtapestry");
        // Set the outframe item (character only, 2% per char)
        // Set yuka by default
        
        // for (var char of charArray) {
        //     if (containsChar(char[0])) {
        //         $("select[name=club-outframe]").val("out-" + char[0]);
        //         break;
        //     }
        // }

        // Set the frameline item
        $("select[name=club-frameline]").val("mizuhiki");
        // All frameline items are 2%
    
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
    "common2": {
        "name":"common",
        "displayname":"All Units (2.5%)",
        "type":"all",
        "bonus":.025
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
    "out-none": {
        "name":"none",
        "displayname":"None",
        "type":"character",
        "bonus":0
    },
    "out-kvtapestry": {
        "name":"kvtapestry",
        "displayname":"KV Tapestry",
        "type":"decoration",
        "bonus":.04
    },
    "out-yuka": {
        "name":"yuka",
        "displayname":"Yuka",
        "type":"character",
        "bonus":.02
    },
    // "out-saori": {
    //     "name":"saori",
    //     "displayname":"Saori",
    //     "type":"character",
    //     "bonus":.02
    // },
    "out-miyu": {
        "name":"miyu",
        "displayname":"Miyu",
        "type":"character",
        "bonus":.02
    },
    // "out-kurumi": {
    //     "name":"kurumi",
    //     "displayname":"Kurumi",
    //     "type":"character",
    //     "bonus":.02
    // },
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
    },
    "out-towa": {
        "name":"towa",
        "displayname":"Towa",
        "type":"character",
        "bonus":.02
    },
    "out-shinobu": {
        "name":"shinobu",
        "displayname":"Shinobu",
        "type":"character",
        "bonus":.02
    },
    "out-hayate": {
        "name":"hayate",
        "displayname":"Hayate",
        "type":"character",
        "bonus":.02
    },
    "out-muni": {
        "name":"muni",
        "displayname":"Muni",
        "type":"character",
        "bonus":.02
    },
    "out-kokoa": {
        "name":"kokoa",
        "displayname":"Kokoa",
        "type":"character",
        "bonus":.02
    },
    "out-hiiro": {
        "name":"hiiro",
        "displayname":"Hiiro",
        "type":"character",
        "bonus":.02
    },
    "out-ibuki": {
        "name":"ibuki",
        "displayname":"Ibuki",
        "type":"character",
        "bonus":.02
    },
    "out-kyoko": {
        "name":"kyoko",
        "displayname":"Kyoko",
        "type":"character",
        "bonus":.02
    },
    "out-saki": {
        "name":"saki",
        "displayname":"Saki",
        "type":"character",
        "bonus":.02
    },
    "out-mana": {
        "name":"mana",
        "displayname":"Mana",
        "type":"character",
        "bonus":.02
    },
    "out-haruna": {
        "name":"haruna",
        "displayname":"Haruna",
        "type":"character",
        "bonus":.02
    },
    "out-dalia": {
        "name":"dalia",
        "displayname":"Dalia",
        "type":"character",
        "bonus":.02
    },
    "out-sophia": {
        "name":"sophia",
        "displayname":"Sophia",
        "type":"character",
        "bonus":.02
    },
    "out-neo": {
        "name":"neo",
        "displayname":"Neo",
        "type":"character",
        "bonus":.02
    },
    "out-rinku": {
        "name":"rinku",
        "displayname":"Rinku",
        "type":"character",
        "bonus":.02
    },
    "out-aoi": {
        "name":"aoi",
        "displayname":"Aoi",
        "type":"character",
        "bonus":.02
    },
    "out-toka": {
        "name":"toka",
        "displayname":"Toka",
        "type":"character",
        "bonus":.02
    },
    "out-marika": {
        "name":"marika",
        "displayname":"Marika",
        "type":"character",
        "bonus":.02
    },
    "out-weronika": {
        "name":"weronika",
        "displayname":"Weronika",
        "type":"character",
        "bonus":.02
    },
    "out-nagisa": {
        "name":"nagisa",
        "displayname":"Nagisa",
        "type":"character",
        "bonus":.02
    },
    "out-shano": {
        "name":"shano",
        "displayname":"Shano",
        "type":"character",
        "bonus":.02
    },
    "out-rika": {
        "name":"rika",
        "displayname":"Rika",
        "type":"character",
        "bonus":.02
    },
    "out-airi": {
        "name":"airi",
        "displayname":"Airi",
        "type":"character",
        "bonus":.02
    },
    "out-esora": {
        "name":"esora",
        "displayname":"Esora",
        "type":"character",
        "bonus":.02
    }
}

var clubItems5 = {
    "none": {
        "name":"none",
        "displayname":"None",
        "type":"frameline",
        "bonus":0
    },
    "mizuhiki": {
        "name":"mizuhiki",
        "displayname":"Japanese Mizuhiki Art",
        "type":"frameline",
        "bonus":.02
    },
    "icecubes": {
        "name":"icecubes",
        "displayname":"Ice Cubes",
        "type":"frameline",
        "bonus":.02
    }
}