const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function refreshContent() {

    // var formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', { style: 'long', numeric: 'auto' } || {});
    // var format = automaticRelativeDifference(timestamp);
    // document.getElementById("rtDisp").textContent = formatter.format(format.duration, format.unit);
    // document.getElementById("rtForm").textContent = `<t:${unixTimestamp}:R>`;

    var tbody = document.getElementById("content");

    for (let x of birthdays) {
        var row = tbody.insertRow();
        var bday = months[x.birthday.split('/')[0] - 1] + " " + x.birthday.split('/')[1];
        

        row.insertCell().appendChild(document.createTextNode(bday));
        row.insertCell().appendChild(document.createTextNode(x.name));

        if (x.socials != "") {
            var link = document.createElement("a");
            link.setAttribute("href", x.socials);
            var text = document.createTextNode(x.socials);
            link.appendChild(text);

            row.insertCell().appendChild(link);
        } else {
            row.insertCell().appendChild(document.createTextNode(""));
        }
    }
}

// Sort birthdays by next upcoming
function sortBirthdays(a, b) {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: "Japan" });
    var today = formatter.format(new Date());
    today = new Date(today.split("/")[2], today.split("/")[0] - 1, today.split("/")[1]);
    var currentYear = today.getFullYear();

    const aBirthday = new Date(currentYear, a.birthday.split('/')[0] - 1, a.birthday.split('/')[1]);
    const bBirthday = new Date(currentYear, b.birthday.split('/')[0] - 1, b.birthday.split('/')[1]);

    if (aBirthday < today) {
        aBirthday.setFullYear(currentYear + 1);
    }

    if (bBirthday < today) {
        bBirthday.setFullYear(currentYear + 1);
    }

    return aBirthday - bBirthday;
}

var birthdays = [
    {
        "name": "Aoyagi Tsubaki",
        "type": "character",
        "birthday": "1/7",
        "socials":""
    },
    {
        "name": "Kaibara Michiru",
        "type": "character",
        "birthday": "1/23",
        "socials":""
    },
    {
        "name": "Hanamaki Towa",
        "type": "character",
        "birthday": "1/30",
        "socials":""
    },
    {
        "name": "Inuyose Shinobu",
        "type": "character",
        "birthday": "2/4",
        "socials":""
    },
    {
        "name": "Tendo Hayate",
        "type": "character",
        "birthday": "2/12",
        "socials":""
    },
    {
        "name": "Takeshita Miiko",
        "type": "character",
        "birthday": "2/22",
        "socials":""
    },
    {
        "name": "Ohnaruto Muni",
        "type": "character",
        "birthday": "3/3",
        "socials":""
    },
    {
        "name": "Shinomiya Kokoa",
        "type": "character",
        "birthday": "3/12",
        "socials":""
    },
    {
        "name": "Yano Hiiro",
        "type": "character",
        "birthday": "3/23",
        "socials":""
    },
    {
        "name": "Niijima Ibuki",
        "type": "character",
        "birthday": "4/10",
        "socials":""
    },
    {
        "name": "Date-chan",
        "type": "character",
        "birthday": "4/20",
        "socials":""
    },
    {
        "name": "Yamate Kyoko",
        "type": "character",
        "birthday": "4/27",
        "socials":""
    },
    {
        "name": "Izumo Saki",
        "type": "character",
        "birthday": "5/10",
        "socials":""
    },
    {
        "name": "Kase Mana",
        "type": "character",
        "birthday": "5/18",
        "socials":""
    },
    {
        "name": "Kasuga Haruna",
        "type": "character",
        "birthday": "5/25",
        "socials":""
    },
    {
        "name": "Matsuyama Dalia",
        "type": "character",
        "birthday": "6/1",
        "socials":""
    },
    {
        "name": "Sophia",
        "type": "character",
        "birthday": "6/11",
        "socials":""
    },
    {
        "name": "Neo",
        "type": "character",
        "birthday": "6/12",
        "socials":""
    },
    {
        "name": "Aimoto Rinku",
        "type": "character",
        "birthday": "6/30",
        "socials":""
    },
    {
        "name": "Miyake Aoi",
        "type": "character",
        "birthday": "7/7",
        "socials":""
    },
    {
        "name": "Takao Toka",
        "type": "character",
        "birthday": "7/22",
        "socials":""
    },
    {
        "name": "Azai Eimi",
        "type": "character",
        "birthday": "7/24",
        "socials":""
    },
    {
        "name": "Mizushima Marika",
        "type": "character",
        "birthday": "7/30",
        "socials":""
    },
    {
        "name": "Weronika",
        "type": "character",
        "birthday": "8/2",
        "socials":""
    },
    {
        "name": "Tsukimiyama Nagisa",
        "type": "character",
        "birthday": "8/15",
        "socials":""
    },
    {
        "name": "Himegami Shano",
        "type": "character",
        "birthday": "8/24",
        "socials":""
    },
    {
        "name": "Seto Rika",
        "type": "character",
        "birthday": "8/30",
        "socials":""
    },
    {
        "name": "Amano Airi",
        "type": "character",
        "birthday": "9/1",
        "socials":""
    },
    {
        "name": "Shimizu Esora",
        "type": "character",
        "birthday": "9/9",
        "socials":""
    },
    {
        "name": "Akashi Maho",
        "type": "character",
        "birthday": "9/20",
        "socials":""
    },
    {
        "name": "Ichihoshi Lumina",
        "type": "character",
        "birthday": "9/29",
        "socials":""
    },
    {
        "name": "Elsie",
        "type": "character",
        "birthday": "10/5",
        "socials":""
    },
    {
        "name": "Fukushima Noa",
        "type": "character",
        "birthday": "10/9",
        "socials":""
    },
    {
        "name": "Togetsu Rei",
        "type": "character",
        "birthday": "10/30",
        "socials":""
    },
    {
        "name": "Shiratori Kurumi",
        "type": "character",
        "birthday": "11/12",
        "socials":""
    },
    {
        "name": "Shimazu Shika",
        "type": "character",
        "birthday": "11/13",
        "socials":""
    },
    {
        "name": "Hidaka Saori",
        "type": "character",
        "birthday": "11/27",
        "socials":""
    },
    {
        "name": "Sasago Jennifer Yuka",
        "type": "character",
        "birthday": "12/5",
        "socials":""
    },
    {
        "name": "Sakurada Miyu",
        "type": "character",
        "birthday": "12/14",
        "socials":""
    },
    {
        "name": "Bessyo Bell",
        "type": "character",
        "birthday": "12/25",
        "socials":""
    },
    {
        "name": "Miyumi Shuri",
        "type": "character",
        "birthday": "1/6",
        "socials":"https://x.com/miyumi_shuri"
    },
    {
        "name": "Tsunko",
        "type": "character",
        "birthday": "1/9",
        "socials":"https://x.com/tsunko_p"
    },
    {
        "name": "Raychell",
        "type": "character",
        "birthday": "1/13",
        "socials":"https://x.com/Lay0113"
    },
    {
        "name": "Mizuki Nana",
        "type": "character",
        "birthday": "1/21",
        "socials":"https://x.com/NM_NANAPARTY"
    },
    {
        "name": "Komiya Arisa",
        "type": "character",
        "birthday": "2/5",
        "socials":"https://x.com/box_komiyaarisa"
    },
    {
        "name": "Tamura Konomi",
        "type": "character",
        "birthday": "2/5",
        "socials":"https://x.com/pompomknm"
    },
    {
        "name": "Irie Maiko",
        "type": "character",
        "birthday": "2/6",
        "socials":"https://x.com/iriemaiko"
    },
    {
        "name": "Nanaki Kanon",
        "type": "character",
        "birthday": "2/7",
        "socials":"https://x.com/nanaki_staff"
    },
    {
        "name": "Koiwai Kotori",
        "type": "character",
        "birthday": "2/15",
        "socials":"https://x.com/koiwai_kotori"
    },
    {
        "name": "Watase Yuzuki",
        "type": "character",
        "birthday": "2/18",
        "socials":"https://x.com/Watase_Yuzuki"
    },
    {
        "name": "Igoma Yurie",
        "type": "character",
        "birthday": "2/24",
        "socials":"https://x.com/igoma_y"
    },
    {
        "name": "Koizumi Moeka",
        "type": "character",
        "birthday": "2/27",
        "socials":"https://x.com/k_moeka_"
    },
    {
        "name": "Tanda Hazuki",
        "type": "character",
        "birthday": "2/28",
        "socials":"https://x.com/tanda_hazuki"
    },
    {
        "name": "Yura Akari",
        "type": "character",
        "birthday": "3/12",
        "socials":"https://x.com/yura0312akari"
    },
    {
        "name": "Umemura Hinako",
        "type": "character",
        "birthday": "3/13",
        "socials":"https://www.instagram.com/hinaofficial0313/"
    },
    {
        "name": "Nishio Yuka",
        "type": "character",
        "birthday": "3/31",
        "socials":"https://x.com/240y_k"
    },
    {
        "name": "Iwata Haruki",
        "type": "character",
        "birthday": "4/3",
        "socials":"https://x.com/haruki_iwata"
    },
    {
        "name": "Shindo Amane",
        "type": "character",
        "birthday": "4/20",
        "socials":"https://x.com/amane_bushi"
    },
    {
        "name": "Okada Mei",
        "type": "character",
        "birthday": "5/19",
        "socials":"https://x.com/okada_mei0519"
    },
    {
        "name": "Kurachi Reo",
        "type": "character",
        "birthday": "5/22",
        "socials":"https://x.com/kurachireo"
    },
    {
        "name": "Hirajima Natsumi",
        "type": "character",
        "birthday": "5/28",
        "socials":"https://x.com/nacchan_h0528"
    },
    {
        "name": "Yamada Misuzu",
        "type": "character",
        "birthday": "6/10",
        "socials":"https://x.com/misuzu_610"
    },
    {
        "name": "Tsumugi Risa",
        "type": "character",
        "birthday": "7/5",
        "socials":"https://x.com/risa_tsumugi"
    },
    {
        "name": "Hazuki Himari",
        "type": "character",
        "birthday": "8/16",
        "socials":"https://x.com/Hazuki_himari"
    },
    {
        "name": "Aisaka Yuuka",
        "type": "character",
        "birthday": "9/5",
        "socials":"https://x.com/yuuka_aisaka"
    },
    {
        "name": "Sumi Tomomi Jiena",
        "type": "character",
        "birthday": "9/5",
        "socials":"https://x.com/jiena_gaim"
    },
    {
        "name": "Fukagawa Ruka",
        "type": "character",
        "birthday": "9/6",
        "socials":"https://x.com/Ruka_Fukagawa96"
    },
    {
        "name": "Takagi Miyu",
        "type": "character",
        "birthday": "9/8",
        "socials":"https://x.com/Yukgaejang98"
    },
    {
        "name": "Takahashi Karin",
        "type": "character",
        "birthday": "9/9",
        "socials":"https://x.com/karin_takahashi"
    },
    {
        "name": "Aizawa Saya",
        "type": "character",
        "birthday": "9/9",
        "socials":"https://x.com/_saya_aizawa"
    },
    {
        "name": "Kagami Karin",
        "type": "character",
        "birthday": "9/19",
        "socials":"https://x.com/kagami_karin"
    },
    {
        "name": "Negishi Ai",
        "type": "character",
        "birthday": "9/27",
        "socials":"https://x.com/negishiai"
    },
    {
        "name": "Kato Rihona",
        "type": "character",
        "birthday": "10/3",
        "socials":"https://x.com/rihonyan103"
    },
    {
        "name": "May'n",
        "type": "character",
        "birthday": "10/21",
        "socials":"https://x.com/mayn_tw"
    },
    {
        "name": "Mimura Haruka",
        "type": "character",
        "birthday": "10/27",
        "socials":"https://x.com/mimuharu_1027"
    },
    {
        "name": "Momono Haruna",
        "type": "character",
        "birthday": "11/25",
        "socials":"https://x.com/mom0no"
    },
    {
        "name": "Tenma Yuuki",
        "type": "character",
        "birthday": "12/7",
        "socials":"https://x.com/TemmaYuuki"
    },
    {
        "name": "Sekine Akira",
        "type": "character",
        "birthday": "12/16",
        "socials":"https://x.com/aki_lucky1216"
    },
    {
        "name": "Sato Hinata",
        "type": "character",
        "birthday": "12/23",
        "socials":"https://x.com/satohina1223"
    },
    {
        "name": "Aimi",
        "type": "character",
        "birthday": "12/25",
        "socials":"https://x.com/aimi_sound"
    },
];