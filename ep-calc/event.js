var refreshEventSelector;
var refreshMedleySelect;

$(document).ready(function() {
    $.refreshEventSelector = function() {
        $('.selectpicker#eventselector').selectpicker('refresh');
    };
    
    $.refreshMedleySelect = function() {
        $('.selectpicker#medleychars').selectpicker('refresh');
    };
});

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
    document.getElementById("eventdetails").innerHTML = eventList[eventId].addition;

    // Display medley bonus char selector
    if (eventList[eventId].type.toLowerCase() === "medley") {
        document.getElementById("medleycharselect").style.display = "table-row";
        document.getElementById("medley_color").style.display = "table-cell";
        document.getElementById("power_medley").style.display = "table-cell";
        populateCharSelectMed();
    } else {
        document.getElementById("medleycharselect").style.display = "none";
        document.getElementById("medley_color").style.display = "none";
        document.getElementById("power_medley").style.display = "none";
    }
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
    select.classList.add("voltselect");
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
    };

    var raidSet = {
        "59":["Motorrad Rider Traveler", "Dichotomy of Bludgeoning and Resurrection", "Red-Eyed Rabbit's Tenchu Kick", "Railgun Exploding in the Dark of Night"],
        "60":["With You Sleeping Peacefully", "Shana and the Blue Flame Hunter", "Proudly Sparkle Rod", "Naughty Sister"],
        "68":["I Wonder Why It's You", "You Can't Veto It", "You're Responsible For It", "Please Make My Dream Come True", "Beautiful Full Moon"],
        "79":["Pursue The Path Of Darkness-pyo!", "Reiwa's Most Powerful Idol!", "Puchiko Will Dance Too-nyu", "Dejiko Is The Lead-nyo!"],
        "89":["Anthem of Dawn", "Do You Even DJ?", "CHAMPION GIRL", "Summit Of Babel"],
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
        "addition":""
    },
*/