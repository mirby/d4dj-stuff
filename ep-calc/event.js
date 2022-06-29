var refreshEventSelector;

$(document).ready(function() {
    $.refreshEventSelector = function() {
        $('.selectpicker#eventselector').selectpicker('refresh');
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
    img.src = "https://raw.githubusercontent.com/mirby/d4dj-stuff/main/screenshots/" + eventId + "_event.png";
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
}

// A 404 can occur if the event notice is there but not the event image yet, so display the event notice image instead
function handle404(source, id) {
    source.src = "https://raw.githubusercontent.com/mirby/d4dj-stuff/main/screenshots/" + id + "_eventNotice.png";
    source.onerror = "";
}

function refreshEventSelect() {
    // Event IDs are offset by 13 (don't ask why)
    $("select[name=eventselector]").val(Object.keys(eventList).length + 13);
    fillEventDisplay();
    $.refreshEventSelector();
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