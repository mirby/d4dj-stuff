var refreshEventSelector;
var refreshMedleySelect;
var refreshEventCharSelect;

$(document).ready(function() {
    $.refreshEventSelector = function() {
        $('.selectpicker#eventselector').selectpicker('refresh');
    };
    
    $.refreshMedleySelect = function() {
        $('.selectpicker#medleychars').selectpicker('refresh');
    };

    $.refreshEventCharSelect = function() {
        $('.selectpicker.eventchars').selectpicker('refresh');
    };
});

// Return if the current selected event features combo bonus update or not
function isComboBonus() {
    var eventId = document.getElementById("eventid").innerHTML;
    return eventList[eventId].comboBonus;
}

function createEventSelects() {
    var select = document.createElement("select");
    select.name = "eventselector";
    select.id = "eventselector";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    let keys = Object.keys(eventList);
    for (let x of keys.sort(function(a, b){return b-a})) {
        var option = document.createElement("option");
        option.value = eventList[x].id;
        option.setAttribute("data-content", eventList[x].name);
        select.appendChild(option);
    }

    document.getElementById("eventselector_wrapper").appendChild(select);

    fillEventDisplay();
}

function fillEventDisplay() {
    var eventId = document.getElementById("eventselector").value;
    document.getElementById("eventid").innerHTML = eventId;

    var img = document.createElement('img');
    img.src = "../screenshots/" + eventId + "_event.png";
    img.onerror = function(){handle404(this, eventId)};
    if (document.getElementById("eventimg_wrapper").hasChildNodes()) {
        document.getElementById("eventimg_wrapper").removeChild(document.getElementById("eventimg_wrapper").firstChild);
    }
    document.getElementById("eventimg_wrapper").appendChild(img);

    document.getElementById("eventname").innerHTML = eventList[eventId].name;

    if (eventList[eventId].characters === "None") {
        document.getElementById("eventmembers").innerHTML = "None";
    } else {
        var charArray = eventList[eventId].characters.split(",");
        document.getElementById("eventmembers").innerHTML = "";
        for (let x of charArray) {
            document.getElementById("eventmembers").innerHTML += "<img style='margin-left:5px;margin-right:5px;' src='../icons/icon_" + x.toLowerCase() + ".png' width='40' height='40' title='" + x + "'></img>";
        }
    }

    document.getElementById("eventtype").innerHTML = eventList[eventId].type;
    document.getElementById("eventstyleval").innerHTML = eventList[eventId].style;
    document.getElementById("eventstyle").innerHTML = (eventList[eventId].style !== "None") ? "<img src='../icons/type_" + eventList[eventId].style.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + eventList[eventId].style : "None";
    document.getElementById("eventparamval").innerHTML = eventList[eventId].parameter;
    document.getElementById("eventparam").innerHTML = (eventList[eventId].parameter !== "None") ? "<img src='../icons/param_" + eventList[eventId].parameter.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + eventList[eventId].parameter : "None";
    document.getElementById("eventbonus").innerHTML = (eventList[eventId].bonus) ? "Yes" : "No";
    document.getElementById("eventcombobonus").innerHTML = (eventList[eventId].comboBonus) ? "Yes" : "No";
    document.getElementById("eventdetails").innerHTML = eventList[eventId].addition;

    // Display certain UI elements based on the event type
    if (eventList[eventId].type.toLowerCase() === "medley") {
        showMedleyPowerElements();
        showMedleyUIElements();
        hideRaidElements();

        populateCharSelectMed();
    } else if (eventList[eventId].type.toLowerCase() === "raid") {
        hideMedleyElements();
        showRaidElements();

        populateCharSelectRaid();
    } else {
        hideMedleyElements();
        hideRaidElements();
    }
}

function showMedleyPowerElements() {
    document.getElementById("medleycharselect").style.display = "table-row";
    document.getElementById("medley_color").style.display = "table-cell";
    document.getElementById("power_medley").style.display = "table-cell";
}

function showMedleyUIElements() {
    document.getElementById("roomscoreinlabel").style.display = "inline-block";
    document.getElementById("roomscorein").style.display = "inline-block";
    document.getElementById("roomscorein2label").style.display = "inline-block";
    document.getElementById("roomscorein2").style.display = "inline-block";

    var brs = document.getElementsByClassName("medleyBreak");
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }

    var br = document.createElement("br");
    br.classList.add("medleyBreak");
    document.getElementById("roomscorein").insertAdjacentElement("afterend", br);
    br = document.createElement("br");
    br.classList.add("medleyBreak");
    document.getElementById("roomscorein2").insertAdjacentElement("afterend", br);
}

function hideMedleyElements() {
    document.getElementById("medleycharselect").style.display = "none";
    document.getElementById("medley_color").style.display = "none";
    document.getElementById("power_medley").style.display = "none";
    document.getElementById("roomscoreinlabel").style.display = "none";
    document.getElementById("roomscorein").style.display = "none";
    document.getElementById("roomscorein2label").style.display = "none";
    document.getElementById("roomscorein2").style.display = "none";

    var brs = document.getElementsByClassName("medleyBreak");
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }
}

function showRaidElements() {
    document.getElementById("powerin3label").style.display = "inline-block";
    document.getElementById("powerin3").style.display = "inline-block";
    document.getElementById("raidcharselect").style.display = "table-row";

    var brs = document.getElementsByClassName("raidBreak");
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }

    var br = document.createElement("br");
    br.classList.add("raidBreak");
    document.getElementById("powerin3").insertAdjacentElement("afterend", br);
}

function hideRaidElements() {
    document.getElementById("powerin3label").style.display = "none";
    document.getElementById("powerin3").style.display = "none";
    document.getElementById("raidcharselect").style.display = "none";

    var brs = document.getElementsByClassName("raidBreak");
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }
}

// Populate the character select based on current event chars
function populateCharSelectRaid() {
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
    select.name = "raidchars";
    select.id = "raidchars";
    select.classList.add("selectpicker");
    select.classList.add("eventchars");
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
}

// A 404 can occur if the event notice is there but not the event image yet, so display the event notice image instead
function handle404(source, id) {
    source.src = "../screenshots/" + id + "_eventNotice.png";
    source.onerror = "";
}

function refreshEventSelect() {
    // Event IDs are offset by 13 (don't ask why)
    $("select[name=eventselector]").val(Object.keys(eventList).length + 13);
    fillEventDisplay();
    $.refreshEventSelector();
}

// Populate a character selector if the event type is medley
function populateCharSelectMed() {
    var eventid = document.getElementById("eventid").innerHTML;
    var charArray = eventList[eventid].characters.split(",");

    if (document.getElementById("eventmedleychar").hasChildNodes()) {
        document.getElementById("eventmedleychar").removeChild(document.getElementById("eventmedleychar").firstChild);
    }

    var select = document.createElement("select");
    select.name = "medleychars";
    select.id = "medleychars";
    select.classList.add("selectpicker");
    select.classList.add("eventchars");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    for (let x of charArray) {
        var option = document.createElement("option");
        option.value = x;
        option.setAttribute("data-tokens", x.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/icon_" + x.toLowerCase() + ".png' width='30' height='30'></img>" + ' ' + x);
        select.appendChild(option);        
    }

    // var option = document.createElement("option");
    // option.value = "none";
    // option.setAttribute("data-tokens", "none");
    // option.setAttribute("data-content","None");
    // select.appendChild(option); 

    document.getElementById("eventmedleychar").appendChild(select);
}

// Update these with Medley or Raid card names to denote the cards used for extra bonuses
function getCardSet(type) {
    var medSet = {
        "86":["Disciple playing and Master conducting", "Hyped and hyped", "Illumination and Illusion", "Pretty meets Mysterious"],
        "93":["Dusk", "Street color", "Madder red sky", "Encounter"],
        "95":["Scenery", "Afterglow", "Phosphorescence", "Luminous"],
        "101":["Wanderer", "Tuning", "Transience", "Heartbeat"],
        "106":["On This Fine Day", "Heavenly Stairway", "In This Shining World", "Dazzling Bravery"],
        "110":["Tiny Light", "Overflowing Splendor", "Girl Spinning", "Brilliant Flowers"],
        "113":["Sweet×waterside", "Tropical＊eyes", "Hungry♡pool", "Splash＋reading"],
        "122":["Wine Red Monopoly", "Whispering On Sleepless Nights", "Lovely Snake Princess", "Unraveling Dynamite"],
        "132":["Fragment", "Tranquil Mind", "Coloration", "Homeward Bound"],
        "137":["Your Color♥Sugar Time", "Heart-pounding♥Kiss You", "Gap Moe♥Sweetheart", "Maiden of Flowers♥Forever and Ever"],
        "143":["Little Red Riding Hood in the Forest", "The Captive Sleeping Beauty", "Snow White in the Mirror", "Cinderella at the stroke of midnight"],
        "146":["Pine Blue Soda", "Cherry Cream Soda", "Kiwi Fruit Tea", "Lime Rose Lemonade"],
        "156":["Evening Serenity", "A Journey of Encounter", "Refreshing Breeze", "Sound of Waves"],
    };

    var raidSet = {
        "59":["Motorrad Rider Traveler", "Dichotomy of Bludgeoning and Resurrection", "Red-Eyed Rabbit's Tenchu Kick", "Railgun Exploding in the Dark of Night"],
        "60":["With You Sleeping Peacefully", "Shana and the Blue Flame Hunter", "Proudly Sparkle Rod", "Naughty Sister"],
        "68":["I Wonder Why It's You", "You Can't Veto It", "You're Responsible For It", "Please Make My Dream Come True", "Beautiful Full Moon"],
        "79":["Pursue The Path Of Darkness-pyo!", "Reiwa's Most Powerful Idol!", "Puchiko Will Dance Too-nyu", "Dejiko Is The Lead-nyo!"],
        "89":["Anthem of Dawn", "Do You Even DJ?", "CHAMPION GIRL", "Summit Of Babel"],
        "102":["Abyss's Queen", "As You Wish", "Break the World", "Road to the No.1"],
        "109":["Carpet of Sunflowers", "The One and Only Tulip", "Brilliant Hydrangea", "Four-Leaf Clover", "The Witness Carnation"],
        "120":["Hitagi Crab", "Nadeko Snake", "Mayoi Snail", "Suruga Monkey"],
        "121":["Karen Bee", "Tsukihi Phoenix", "Tsubasa Cat", "Shinobu Time"],
        "138":["Code Name Flower Garden", "Code Name Daughter Dearest", "Code Name Glint", "Code Name Fool"],
        "158":["Siscon Idol", "Bunny Girl Senpai", "Petite Devil Kohai", "Sister Venturing Out"],
    };

    if (type === "medley") {
        return medSet;
    } else if (type === "raid") {
        return raidSet;
    }
}

var eventList = {
    "14": {
        "id":14,
        "name":"Non S.T.O.P! THE BEST!!",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Poker",
        "style":"Cute",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "15": {
        "id":15,
        "name":"D4 FES. ~Celebrating, Once More~",
        "characters":"Rei,Towa,Marika,Haruna",
        "type":"Medley",
        "style":"Cool",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "16": {
        "id":16,
        "name":"The Reason for Quintuplets",
        "characters":"Muni,Towa,Noa,Hiiro,Haruna",
        "type":"Raid",
        "style":"Elegant",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "17": {
        "id":17,
        "name":"D4 FES. ~MIX COLORS~",
        "characters":"Saki,Noa,Rika,Saori",
        "type":"Medley",
        "style":"Party",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "18": {
        "id":18,
        "name":"Indigo Bullet",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Poker",
        "style":"Cute",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "19": {
        "id":19,
        "name":"D4 FES. ~Gorgeous and Glorius~",
        "characters":"Tsubaki,Aoi,Miyu,Miiko",
        "type":"Bingo",
        "style":"Party",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "20": {
        "id":20,
        "name":"Eternal Dreams Bloom in the Night Sky",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Medley",
        "style":"Street",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "21": {
        "id":21,
        "name":"D4 FES. ~Happy Moment~",
        "characters":"Rinku,Maho,Kyoko,Yuka",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "22": {
        "id":22,
        "name":"Happy Summer Splash!",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Poker",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "23": {
        "id":23,
        "name":"D4 FES. ~Shuffle Vivid~",
        "characters":"Esora,Dalia,Nagisa,Kurumi",
        "type":"Bingo",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "24": {
        "id":24,
        "name":"Peaky Stormy Story",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Medley",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "25": {
        "id":25,
        "name":"Shiny Smily Scratch",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "26": {
        "id":26,
        "name":"D4 FES. ~Started New World~",
        "characters":"Muni,Shinobu,Ibuki,Hiiro,Michiru",
        "type":"Raid",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "27": {
        "id":27,
        "name":"To My Future Self ~Miyu & Miiko~",
        "characters":"Miyu,Miiko",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "28": {
        "id":28,
        "name":"WakuWaku Halloween Costume",
        "characters":"Shinobu,Nagisa,Hiiro,Miiko",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "29": {
        "id":29,
        "name":"Stand Up! Endless Fight!",
        "characters":"Shinobu,Aoi,Miyu,Haruna",
        "type":"Poker",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "30": {
        "id":30,
        "name":"Prayers Will Surely Be Answered",
        "characters":"Hiiro,Aoi",
        "type":"Slots",
        "style":"Cool",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "31": {
        "id":31,
        "name":"Searching for Moonlight, Ayakashi Chapter",
        "characters":"Yuka,Ibuki,Saori,Dalia",
        "type":"Poker",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "32": {
        "id":32,
        "name":"Lovely Happy Cheer Girls",
        "characters":"Rinku,Maho,Kyoko,Esora",
        "type":"Medley",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "33": {
        "id":33,
        "name":"1st Anniversary Groovy Fes.",
        "characters":"None",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "34": {
        "id":34,
        "name":"#Party #Resort #Survival",
        "characters":"Rika,Tsubaki,Aoi,Miyu",
        "type":"Bingo",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "35": {
        "id":35,
        "name":"Holy Starry Christmas",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "36": {
        "id":36,
        "name":"Revenge! Clever Snowball Fight",
        "characters":"Maho,Muni,Kurumi,Miiko",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "37": {
        "id":37,
        "name":"Symphonic New P-key's Year",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "38": {
        "id":38,
        "name":"Harmony With You ~Kyoko & Yuka~",
        "characters":"Kyoko,Yuka",
        "type":"Slots",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "39": {
        "id":39,
        "name":"Troupe Cutopa♡ ~Arabian Nights~",
        "characters":"Muni,Saki,Noa,Kurumi",
        "type":"Medley",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "40": {
        "id":40,
        "name":"Journey of the Lily",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "41": {
        "id":41,
        "name":"Sulking Maiden and Caring Angel",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Poker",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "42": {
        "id":42,
        "name":"Chocolatier's Quartet",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Bingo",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "43": {
        "id":43,
        "name":"Two Flowers, the Stage for Dreaming ~Marika & Dalia~",
        "characters":"Marika,Dalia",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "44": {
        "id":44,
        "name":"Eyes Dazzled by Mist, Rhapsody of Wavering Heart",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Medley",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "45": {
        "id":45,
        "name":"New Song! Conflict!? Sleepover!!? ~Maho & Rei~",
        "characters":"Maho,Rei",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "46": {
        "id":46,
        "name":"White Corsage of Dearest Love",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Medley",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "47": {
        "id":47,
        "name":"The Sizzling Floor and Where I Belong ~Rika & Saori~",
        "characters":"Rika,Saori",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "48": {
        "id":48,
        "name":"What a Colorful Groove!!",
        "characters":"Rinku,Kyoko,Esora,Saki",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "49": {
        "id":49,
        "name":"D4 FES.Remix -Come back-",
        "characters":"Shinobu,Ibuki,Hiiro,Aoi",
        "type":"Poker",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "50": {
        "id":50,
        "name":"DJ NADO",
        "characters":"Rinku,Noa,Miyu,Kurumi",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "51": {
        "id":51,
        "name":"Don't worry, Trust me ~Saki & Ibuki~",
        "characters":"Saki,Ibuki",
        "type":"Slots",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "52": {
        "id":52,
        "name":"D4 FES.Remix -Own Style-",
        "characters":"Rinku,Maho,Esora,Marika",
        "type":"Poker",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "53": {
        "id":53,
        "name":"CYBER POLICE Case Files",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "54": {
        "id":54,
        "name":"Because We Can't Play It Alone ~Tsubaki & Nagisa~",
        "characters":"Tsubaki,Nagisa",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "55": {
        "id":55,
        "name":"D4 FES.Remix -Sing in Chorus",
        "characters":"Rei,Dalia,Miyu,Miiko",
        "type":"Poker",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "56": {
        "id":56,
        "name":"Clash! The Ninjutsu Battle of the Kunoichi!",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Bingo",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "57": {
        "id":57,
        "name":"Rinku Aimoto Exploration Party - Chase a mysterious rare creature in the last unexplored region of Japan!",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Medley",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "58": {
        "id":58,
        "name":"Our Words Are Guiding Signs ~Towa & Noa~",
        "characters":"Towa,Noa",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "59": {
        "id":59,
        "name":"Dengeki & NBC Universal 30th Anniversary Lightning groove!! -1st Half-",
        "characters":"Muni,Kyoko,Aoi,Miiko",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":"50% power boost to matching character. 50% power boost to matching collab card. 50% power boost to matching Support Live room."
    },
    "60": {
        "id":60,
        "name":"Dengeki & NBC Universal 30th Anniversary Lightning groove!! -2nd Half-",
        "characters":"Rei,Tsubaki,Hiiro,Kurumi",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":"50% power boost to matching character. 50% power boost to matching collab card. 50% power boost to matching Support Live room."
    },
    "61": {
        "id":61,
        "name":"The Loneliness In My Heart -Shinobu & Esora-",
        "characters":"Shinobu,Esora",
        "type":"Slots",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "62": {
        "id":62,
        "name":"D4 FES.Remix -Destination-",
        "characters":"Yuka,Saki,Towa,Saori",
        "type":"Poker",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "63": {
        "id":63,
        "name":"Tonight, A Special Time For You",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "64": {
        "id":64,
        "name":"D4 FES.Remix -Floor Integrate-",
        "characters":"Kyoko,Noa,Rika,Tsubaki",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "65": {
        "id":65,
        "name":"Starry Flowers With Loved One",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Poker",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "66": {
        "id":66,
        "name":"Welcome! Peaky's Freedom Summer!!",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "67": {
        "id":67,
        "name":"Lasting Memories in Our Heart",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Poker",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "68": {
        "id":68,
        "name":"Quintessential Thoughts",
        "characters":"Shinobu,Yuka,Ibuki,Marika,Tsubaki",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":"50% power boost to matching character. 50% power boost to matching collab card. 50% power boost to matching Support Live room."
    },
    "69": {
        "id":69,
        "name":"My Dear Friends -Haruna & Kurumi-",
        "characters":"Haruna,Kurumi",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "70": {
        "id":70,
        "name":"D4 FES.Remix -Delightful Carnival-",
        "characters":"Muni,Nagisa,Haruna,Kurumi",
        "type":"Medley",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "71": {
        "id":71,
        "name":"We'll Always Be Together, Even If We're Apart -Miyu & Saori-",
        "characters":"Saori,Miyu",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "72": {
        "id":72,
        "name":"Apprentice Shrine Maiden and Fortune-Bringing Cat Goddess",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "73": {
        "id":73,
        "name":"Sparkling Buds, Bursting LAGOON",
        "characters":"Saori,Dalia,Hiiro,Aoi",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "74": {
        "id":74,
        "name":"That Cute Girl and The Scary Me -Kurumi & Noa-",
        "characters":"Noa,Kurumi",
        "type":"Slots",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "75": {
        "id":75,
        "name":"Case File 001: The Detective Agency and the Mysterious Phantom",
        "characters":"Rei,Saki,Miyu,Miiko",
        "type":"Poker",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "76": {
        "id":76,
        "name":"Heartthrob! Angels and Devils Costume Contest",
        "characters":"Muni,Tsubaki,Haruna,Kurumi",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "77": {
        "id":77,
        "name":"\"JEALOUSY -link with your heart-\" -Rinku & Muni-",
        "characters":"Rinku,Muni",
        "type":"Slots",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "78": {
        "id":78,
        "name":"Tαke Me GЯOOMY!",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "79": {
        "id":79,
        "name":"Reiwa no Gu Ru Mix nyo",
        "characters":"Shinobu,Esora,Nagisa,Miiko",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":"100% power boost to matching character. 100% power boost to matching collab card."
    },
    "80": {
        "id":80,
        "name":"side:nova Season 1 -The Revolution Live-",
        "characters":"None",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":"During specific periods, 50% power boost for matching unit. Additional 50% boost if 2nd Anniversary card."
    },
    "81": {
        "id":81,
        "name":"\"Dear You, Aiming for the Goal\" -Yuka & Ibuki-",
        "characters":"Yuka,Ibuki",
        "type":"Slots",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "82": {
        "id":82,
        "name":"Holy Night, With You -Present for 'You'-",
        "characters":"Rinku,Maho,Rei,Muni",
        "type":"Growth",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "83": {
        "id":83,
        "name":"side : origin -Photon Maiden-",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Bingo",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "84": {
        "id":84,
        "name":"Fortune Comes in by a Merry Gate -New Ye4r Wishes-",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Growth",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "85": {
        "id":85,
        "name":"My Prince -Haruna & Aoi-",
        "characters":"Aoi,Haruna",
        "type":"Slots",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "86": {
        "id":86,
        "name":"side:nova : season 2 -Opening Act-",
        "characters":"Rei,Rika,Hiiro,Miiko",
        "type":"Medley",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "87": {
        "id":87,
        "name":"side : origin -Peaky P-key-",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Poker",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "88": {
        "id":88,
        "name":"'It's my style' -Towa & Marika-",
        "characters":"Towa,Marika",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "89": {
        "id":89,
        "name":"DEN-ON-BU x D4DJ Dual Anthem - New Groovy-",
        "characters":"Rinku,Muni,Kyoko,Michiru",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":"50% power boost to matching character. 50% power boost to matching collab card. 50% power boost to matching Support Live room."
    },
    "90": {
        "id":90,
        "name":"Reach for the Light -Maho & Saki-",
        "characters":"Maho,Saki",
        "type":"Slots",
        "style":"Cool",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "91": {
        "id":91,
        "name":"side:nova Season 3 -UniChØrd-",
        "characters":"Michiru,Lumina,Kokoa,Hayate",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "92": {
        "id":92,
        "name":"Mutual Feelings, Conveys Emotions -Rika & Tsubaki-",
        "characters":"Rika,Tsubaki",
        "type":"Slots",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "93": {
        "id":93,
        "name":"side : origin -Lyrical Lily-",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Medley",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "94": {
        "id":94,
        "name":"side : nova Season 4 -Finding Neo-",
        "characters":"Yuka,Noa,Saori,Tsubaki",
        "type":"Poker",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "95": {
        "id":95,
        "name":"side : origin -Happy Around!-",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "96": {
        "id":96,
        "name":"side : nova Season 5 -Leader-",
        "characters":"Muni,Ibuki,Marika,Kurumi",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "97": {
        "id":97,
        "name":"What is 'Love'? -Rinku & Kyoko-",
        "characters":"Rinku,Kyoko",
        "type":"Slots",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "98": {
        "id":98,
        "name":"side : origin -Merm4id-",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "99": {
        "id":99,
        "name":"side : nova Season 6 -Unison-",
        "characters":"Shinobu,Saki,Towa,Nagisa",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "100": {
        "id":100,
        "name":"Suite 'Time Drifts Lazily' -Rei & Esora-",
        "characters":"Rei,Esora",
        "type":"Slots",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "101": {
        "id":101,
        "name":"side : origin -Rondo-",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "102": {
        "id":102,
        "name":"side : nova Season 7 -Abyssmare-",
        "characters":"Neo,Sophia,Elsie,Weronika",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":"50% power boost for Abyssmare 4 star. 25% power boost for Abyssmare 2 star. 10% power boost for side:origin SP and side:nova UniChord."
    },
    "103": {
        "id":103,
        "name":"Doki Dokiss -Fall into Love's Dream, Tonight-",
        "characters":"Kyoko,Ibuki,Dalia,Aoi",
        "type":"Poker",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "104": {
        "id":104,
        "name":"Nano of the Dead -Nagisa & Miiko-",
        "characters":"Nagisa,Miiko",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "105": {
        "id":105,
        "name":"side : nova Season 8 -Breakthrough-",
        "characters":"Rinku,Dalia,Aoi,Miyu",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "106": {
        "id":106,
        "name":"Welcome back! M4id, Br!de or Me!?",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "107": {
        "id":107,
        "name":"side : nova Season 9 -SUPERNOVA-",
        "characters":"Maho,Kyoko,Esora,Haruna",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "108": {
        "id":108,
        "name":"Return of the RAVE",
        "characters":"Michiru,Lumina,Neo,Sophia",
        "type":"Rave",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "109": {
        "id":109,
        "name":"Limited Time Revival! The Reason for Quintuplets",
        "characters":"Muni,Towa,Noa,Hiiro,Haruna",
        "type":"Raid",
        "style":"Elegant",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "110": {
        "id":110,
        "name":"Our Summer Vacation",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Medley",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "111": {
        "id":111,
        "name":"Cloyingly Sweet Cocktail -Dalia & Hiiro-",
        "characters":"Dalia,Hiiro",
        "type":"Slots",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "112": {
        "id":112,
        "name":"Summer ChØrd & Four Secrets",
        "characters":"Michiru,Lumina,Kokoa,Hayate",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "113": {
        "id":113,
        "name":"This Summer=My KAWAII",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Medley",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "114": {
        "id":114,
        "name":"If It's for The Unknown 'You' -Muni & Shinobu-",
        "characters":"Muni,Shinobu",
        "type":"Slots",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "115": {
        "id":115,
        "name":"Sparks of Rain, Night of Moonlight",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Bingo",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "116": {
        "id":116,
        "name":"Transmitted Heat,The Heart at 100.4°F",
        "characters":"Neo,Sophia,Elsie,Weronika",
        "type":"Rave",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "117": {
        "id":117,
        "name":"PRISMA ☆ MIX",
        "characters":"Esora,Saki,Nagisa,Miyu",
        "type":"Growth",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "118": {
        "id":118,
        "name":"The Me Here Now -Tsubaki & Hiiro-",
        "characters":"Tsubaki,Hiiro",
        "type":"Slots",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "119": {
        "id":119,
        "name":"The Moon Fills the Stage -The Tale of Genji-",
        "characters":"Shinobu,Towa,Noa,Nagisa",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "120": {
        "id":120,
        "name":"Hakomonogatari",
        "characters":"Maho,Rei,Miiko,Kokoa",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "121": {
        "id":121,
        "name":"Zoku Hakomonogatari",
        "characters":"Towa,Noa,Haruna,Lumina",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":false,
        "addition":""
    },
    "122": {
        "id":122,
        "name":"Trick or Sexy!",
        "characters":"Maho,Esora,Marika,Hiiro",
        "type":"Medley",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "123": {
        "id":123,
        "name":"Voice of a Goddess -sing for you-",
        "characters":"Airi,Shano,Mana,Toka",
        "type":"Rave",
        "style":"None",
        "parameter":"None",
        "bonus":false,
        "comboBonus":false,
        "addition":""
    },
    "124": {
        "id":124,
        "name":"XROSS∞BEAT EPISODE1",
        "characters":"None",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":true,
        "addition":"50% power boost for 3rd Anniversary card in Multi. 25% in Special Raid"
    },
    "125": {
        "id":125,
        "name":"Run! The Great Fluffy Operation",
        "characters":"Rinku,Yuka,Rika,Saori",
        "type":"Poker",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "126": {
        "id":126,
        "name":"One of the Most -Yuka & Shinobu-",
        "characters":"Shinobu,Yuka",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "127": {
        "id":127,
        "name":"A Girl Alone in Solitude",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Poker",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "128": {
        "id":128,
        "name":"P-key Night's Memory",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "129": {
        "id":129,
        "name":"New Spring, New Star☆UniChØrd",
        "characters":"Lumina,Michiru,Kokoa,Hayate",
        "type":"Poker",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "130": {
        "id":130,
        "name":"XROSS∞BEAT EPISODE2",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "131": {
        "id":131,
        "name":"The Magnificient Struggle -Muni & Rei-",
        "characters":"Muni,Rei",
        "type":"Slots",
        "style":"Party",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "132": {
        "id":132,
        "name":"XROSS∞BEAT EPISODE3",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "133": {
        "id":133,
        "name":"Believe in Our Future -Ibuki & Noa-",
        "characters":"Ibuki,Noa",
        "type":"Slots",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "134": {
        "id":134,
        "name":"Red Pure Hearts, Melt in the Blue Moonlit Night",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Poker",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "135": {
        "id":135,
        "name":"The Groove in Shadow",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Bingo",
        "style":"Cute",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "136": {
        "id":136,
        "name":"st(r)ay with you -Elsie & Weronika-",
        "characters":"Elsie,Weronika",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "137": {
        "id":137,
        "name":"Chocolate Project -if story of Photon's Valentine-",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Medley",
        "style":"Cute",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "138": {
        "id":138,
        "name":"Spy ClassroomｘD4DJ -The Magnificient Groove-",
        "characters":"Miyu,Kokoa,Elsie,Weronika",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "139": {
        "id":139,
        "name":"XROSS∞BEAT EPISODE4",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Bingo",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "140": {
        "id":140,
        "name":"Come Closer to the Nano Distance -Kurumi & Miiko-",
        "characters":"Kurumi,Miiko",
        "type":"Slots",
        "style":"Elegant",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "141": {
        "id":141,
        "name":"XROSS∞BEAT EPISODE5",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Poker",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "142": {
        "id":142,
        "name":"XROSS∞BEAT EPISODE6",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "143": {
        "id":143,
        "name":"Princess in Fairy tale",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "144": {
        "id":144,
        "name":"XROSS∞BEAT EPISODE7",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "145": {
        "id":145,
        "name":"A Bad Cynic Doggo VOL.1",
        "characters":"None",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":true,
        "addition":"50% power boost for 3rd Anni/XROSS SP card in Multi. 25% in Special Raid"
    },
    "146": {
        "id":146,
        "name":"HAVE A FUN TIME! -Café de LAGOON-",
        "characters":"Rika,Marika,Saori,Dalia",
        "type":"Medley",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "147": {
        "id":147,
        "name":"A Bad Cynic Doggo VOL.2",
        "characters":"Neo,Sophia,Elsie,Weronika",
        "type":"Poker",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "148": {
        "id":148,
        "name":"Circling, Dancing, June's Song",
        "characters":"Tsubaki,Nagisa,Hiiro,Aoi",
        "type":"Poker",
        "style":"Street",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "149": {
        "id":149,
        "name":"A Bad Cynic Doggo VOL.3",
        "characters":"Rinku,Maho,Muni,Rei,Eimi,Bell,Shika,Date-chan",
        "type":"Medley",
        "style":"Cute",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":"5th medley has 50% power up for event Doggo cards"
    },
    "150": {
        "id":150,
        "name":"Riotous! Peaky!!! Festival Splendor",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "151": {
        "id":151,
        "name":"A Bad Cynic Doggo VOL.4",
        "characters":"Michiru,Lumina,Kokoa,Hayate",
        "type":"Poker",
        "style":"Party",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "152": {
        "id":152,
        "name":"Dive into the Blue Abyss",
        "characters":"Neo,Sophia,Elsie,Weronika",
        "type":"Bingo",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":"SP Bingo event"
    },
    "153": {
        "id":153,
        "name":"A Bad Cynic Doggo VOL.5",
        "characters":"Saki,Ibuki,Towa,Noa",
        "type":"Poker",
        "style":"Street",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "154": {
        "id":154,
        "name":"Light up my heart",
        "characters":"Marika,Saori,Hiiro,Aoi",
        "type":"Bingo",
        "style":"Cool",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "155": {
        "id":155,
        "name":"Unraveling in the Summer Twilight",
        "characters":"Miyu,Haruna,Kurumi,Miiko",
        "type":"Poker",
        "style":"Party",
        "parameter":"Technical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "156": {
        "id":156,
        "name":"A Bad Cynic Doggo VOL.6",
        "characters":"Kyoko,Shinobu,Yuka,Esora",
        "type":"Medley",
        "style":"Cool",
        "parameter":"Physical",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "157": {
        "id":157,
        "name":"To Go Around Twilight Travel Sentiment",
        "characters":"Rinku,Maho,Muni,Rei",
        "type":"Poker",
        "style":"Elegant",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "158": {
        "id":158,
        "name":"Rascal DJ Girl Do Dream of a Club Event",
        "characters":"Yuka,Marika,Saori,Miiko",
        "type":"Raid",
        "style":"None",
        "parameter":"None",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
    "159": {
        "id":159,
        "name":"A Bad Cynic Doggo VOL.7",
        "characters":"Eimi,Bell,Shika,Date-chan",
        "type":"Bingo",
        "style":"Street",
        "parameter":"Heart",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
}

/*
    "": {
        "id":,
        "name":"",
        "characters":"",
        "type":"",
        "style":"",
        "parameter":"",
        "bonus":true,
        "comboBonus":true,
        "addition":""
    },
*/
