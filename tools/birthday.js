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
        row.insertCell().appendChild(document.createTextNode(x.nickname));

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
        "nickname": "",
        "type": "character",
        "birthday": "1/7",
        "socials":""
    },
    {
        "name": "Kaibara Michiru",
        "nickname": "",
        "type": "character",
        "birthday": "1/23",
        "socials":""
    },
    {
        "name": "Hanamaki Towa",
        "nickname": "",
        "type": "character",
        "birthday": "1/30",
        "socials":""
    },
    {
        "name": "Inuyose Shinobu",
        "nickname": "",
        "type": "character",
        "birthday": "2/4",
        "socials":""
    },
    {
        "name": "Tendo Hayate",
        "nickname": "",
        "type": "character",
        "birthday": "2/12",
        "socials":""
    },
    {
        "name": "Takeshita Miiko",
        "nickname": "",
        "type": "character",
        "birthday": "2/22",
        "socials":""
    },
    {
        "name": "Ohnaruto Muni",
        "nickname": "",
        "type": "character",
        "birthday": "3/3",
        "socials":""
    },
    {
        "name": "Shinomiya Kokoa",
        "nickname": "",
        "type": "character",
        "birthday": "3/12",
        "socials":""
    },
    {
        "name": "Yano Hiiro",
        "nickname": "",
        "type": "character",
        "birthday": "3/23",
        "socials":""
    },
    {
        "name": "Niijima Ibuki",
        "nickname": "",
        "type": "character",
        "birthday": "4/10",
        "socials":""
    },
    {
        "name": "Date-chan",
        "nickname": "",
        "type": "character",
        "birthday": "4/20",
        "socials":""
    },
    {
        "name": "Yamate Kyoko",
        "nickname": "",
        "type": "character",
        "birthday": "4/27",
        "socials":""
    },
    {
        "name": "Izumo Saki",
        "nickname": "",
        "type": "character",
        "birthday": "5/10",
        "socials":""
    },
    {
        "name": "Kase Mana",
        "nickname": "",
        "type": "character",
        "birthday": "5/18",
        "socials":""
    },
    {
        "name": "Kasuga Haruna",
        "nickname": "",
        "type": "character",
        "birthday": "5/25",
        "socials":""
    },
    {
        "name": "Matsuyama Dalia",
        "nickname": "",
        "type": "character",
        "birthday": "6/1",
        "socials":""
    },
    {
        "name": "Sophia",
        "nickname": "",
        "type": "character",
        "birthday": "6/11",
        "socials":""
    },
    {
        "name": "Neo",
        "nickname": "",
        "type": "character",
        "birthday": "6/12",
        "socials":""
    },
    {
        "name": "Aimoto Rinku",
        "nickname": "",
        "type": "character",
        "birthday": "6/30",
        "socials":""
    },
    {
        "name": "Miyake Aoi",
        "nickname": "",
        "type": "character",
        "birthday": "7/7",
        "socials":""
    },
    {
        "name": "Takao Toka",
        "nickname": "",
        "type": "character",
        "birthday": "7/22",
        "socials":""
    },
    {
        "name": "Azai Eimi",
        "nickname": "",
        "type": "character",
        "birthday": "7/24",
        "socials":""
    },
    {
        "name": "Mizushima Marika",
        "nickname": "",
        "type": "character",
        "birthday": "7/30",
        "socials":""
    },
    {
        "name": "Weronika",
        "nickname": "",
        "type": "character",
        "birthday": "8/2",
        "socials":""
    },
    {
        "name": "Tsukimiyama Nagisa",
        "nickname": "",
        "type": "character",
        "birthday": "8/15",
        "socials":""
    },
    {
        "name": "Himegami Shano",
        "nickname": "",
        "type": "character",
        "birthday": "8/24",
        "socials":""
    },
    {
        "name": "Seto Rika",
        "nickname": "",
        "type": "character",
        "birthday": "8/30",
        "socials":""
    },
    {
        "name": "Amano Airi",
        "nickname": "",
        "type": "character",
        "birthday": "9/1",
        "socials":""
    },
    {
        "name": "Shimizu Esora",
        "nickname": "",
        "type": "character",
        "birthday": "9/9",
        "socials":""
    },
    {
        "name": "Akashi Maho",
        "nickname": "",
        "type": "character",
        "birthday": "9/20",
        "socials":""
    },
    {
        "name": "Ichihoshi Lumina",
        "nickname": "",
        "type": "character",
        "birthday": "9/29",
        "socials":""
    },
    {
        "name": "Elsie",
        "nickname": "",
        "type": "character",
        "birthday": "10/5",
        "socials":""
    },
    {
        "name": "Fukushima Noa",
        "nickname": "",
        "type": "character",
        "birthday": "10/9",
        "socials":""
    },
    {
        "name": "Togetsu Rei",
        "nickname": "",
        "type": "character",
        "birthday": "10/30",
        "socials":""
    },
    {
        "name": "Shiratori Kurumi",
        "nickname": "",
        "type": "character",
        "birthday": "11/12",
        "socials":""
    },
    {
        "name": "Shimazu Shika",
        "nickname": "",
        "type": "character",
        "birthday": "11/13",
        "socials":""
    },
    {
        "name": "Hidaka Saori",
        "nickname": "",
        "type": "character",
        "birthday": "11/27",
        "socials":""
    },
    {
        "name": "Sasago Jennifer Yuka",
        "nickname": "",
        "type": "character",
        "birthday": "12/5",
        "socials":""
    },
    {
        "name": "Sakurada Miyu",
        "nickname": "",
        "type": "character",
        "birthday": "12/14",
        "socials":""
    },
    {
        "name": "Bessyo Bell",
        "nickname": "",
        "type": "character",
        "birthday": "12/25",
        "socials":""
    },
    {
        "name": "Miyumi Shuri",
        "nickname": "",
        "type": "character",
        "birthday": "1/6",
        "socials":"https://x.com/miyumi_shuri"
    },
    {
        "name": "Tsunko",
        "nickname": "",
        "type": "character",
        "birthday": "1/9",
        "socials":"https://x.com/tsunko_p"
    },
    {
        "name": "Raychell",
        "nickname": "",
        "type": "character",
        "birthday": "1/13",
        "socials":"https://x.com/Lay0113"
    },
    {
        "name": "Mizuki Nana",
        "nickname": "",
        "type": "character",
        "birthday": "1/21",
        "socials":"https://x.com/NM_NANAPARTY"
    },
    {
        "name": "Komiya Arisa",
        "nickname": "",
        "type": "character",
        "birthday": "2/5",
        "socials":"https://x.com/arisakomiya"
    },
    {
        "name": "Tamura Konomi",
        "nickname": "",
        "type": "character",
        "birthday": "2/5",
        "socials":"https://x.com/pompomknm"
    },
    {
        "name": "Irie Maiko",
        "nickname": "",
        "type": "character",
        "birthday": "2/6",
        "socials":"https://x.com/iriemaiko"
    },
    {
        "name": "Nanaki Kanon",
        "nickname": "",
        "type": "character",
        "birthday": "2/7",
        "socials":"https://x.com/nanakikanon"
    },
    {
        "name": "Koiwai Kotori",
        "nickname": "",
        "type": "character",
        "birthday": "2/15",
        "socials":"https://x.com/koiwai_kotori"
    },
    {
        "name": "Watase Yuzuki",
        "nickname": "",
        "type": "character",
        "birthday": "2/18",
        "socials":"https://x.com/Watase_Yuzuki"
    },
    {
        "name": "Igoma Yurie",
        "nickname": "",
        "type": "character",
        "birthday": "2/24",
        "socials":"https://x.com/igoma_y"
    },
    {
        "name": "Koizumi Moeka",
        "nickname": "",
        "type": "character",
        "birthday": "2/27",
        "socials":"https://x.com/k_moeka_"
    },
    {
        "name": "Tanda Hazuki",
        "nickname": "",
        "type": "character",
        "birthday": "2/28",
        "socials":"https://x.com/tanda_hazuki"
    },
    {
        "name": "Yura Akari",
        "nickname": "",
        "type": "character",
        "birthday": "3/12",
        "socials":"https://x.com/yura0312akari"
    },
    {
        "name": "Umemura Hinako",
        "nickname": "",
        "type": "character",
        "birthday": "3/13",
        "socials":"https://www.instagram.com/hinaofficial0313/"
    },
    {
        "name": "Shirono Yuu",
        "nickname": "",
        "type": "character",
        "birthday": "3/15",
        "socials":"https://x.com/yuu_shirono/"
    },
    {
        "name": "Sakurada Iroha",
        "nickname": "",
        "type": "character",
        "birthday": "3/19",
        "socials":"https://x.com/iroha_sakurada"
    },
    {
        "name": "Nishio Yuka",
        "nickname": "",
        "type": "character",
        "birthday": "3/31",
        "socials":"https://x.com/240y_k"
    },
    {
        "name": "Iwata Haruki",
        "nickname": "",
        "type": "character",
        "birthday": "4/3",
        "socials":"https://x.com/haruki_iwata"
    },
    {
        "name": "Shindo Amane",
        "nickname": "",
        "type": "character",
        "birthday": "4/20",
        "socials":"https://x.com/amane_bushi"
    },
    {
        "name": "Okada Mei",
        "nickname": "",
        "type": "character",
        "birthday": "5/19",
        "socials":"https://x.com/okada_mei0519"
    },
    {
        "name": "Kurachi Reo",
        "nickname": "",
        "type": "character",
        "birthday": "5/22",
        "socials":"https://x.com/kurachireo"
    },
    {
        "name": "Hirajima Natsumi",
        "nickname": "",
        "type": "character",
        "birthday": "5/28",
        "socials":"https://x.com/nacchan_h0528"
    },
    {
        "name": "Yamada Misuzu",
        "nickname": "",
        "type": "character",
        "birthday": "6/10",
        "socials":"https://x.com/misuzu_610"
    },
    {
        "name": "Tsumugi Risa",
        "nickname": "",
        "type": "character",
        "birthday": "7/5",
        "socials":"https://x.com/risa_tsumugi"
    },
    {
        "name": "Aisaka Yuuka",
        "nickname": "",
        "type": "character",
        "birthday": "9/5",
        "socials":"https://x.com/yuuka_aisaka"
    },
    {
        "name": "Sumi Tomomi Jiena",
        "nickname": "",
        "type": "character",
        "birthday": "9/5",
        "socials":"https://x.com/jiena_gaim"
    },
    {
        "name": "Fukagawa Ruka",
        "nickname": "",
        "type": "character",
        "birthday": "9/6",
        "socials":"https://x.com/Ruka_Fukagawa96"
    },
    {
        "name": "Takagi Miyu",
        "nickname": "",
        "type": "character",
        "birthday": "9/8",
        "socials":"https://x.com/Yukgaejang98"
    },
    {
        "name": "Takahashi Karin",
        "nickname": "",
        "type": "character",
        "birthday": "9/9",
        "socials":"https://x.com/karin_takahashi"
    },
    {
        "name": "Aizawa Saya",
        "nickname": "",
        "type": "character",
        "birthday": "9/9",
        "socials":"https://x.com/_saya_aizawa"
    },
    {
        "name": "Shirosaki Momoka",
        "nickname": "Momotan",
        "type": "character",
        "birthday": "9/17",
        "socials":"https://x.com/srsk_momoka/"
    },
    {
        "name": "Kagami Karin",
        "nickname": "",
        "type": "character",
        "birthday": "9/19",
        "socials":"https://x.com/kagami_karin"
    },
    {
        "name": "Negishi Ai",
        "nickname": "",
        "type": "character",
        "birthday": "9/27",
        "socials":"https://x.com/negishiai"
    },
    {
        "name": "Kato Rihona",
        "nickname": "",
        "type": "character",
        "birthday": "10/3",
        "socials":"https://x.com/rihonyan103"
    },
    {
        "name": "Momonosuke",
        "nickname": "Dinodol",
        "type": "character",
        "birthday": "10/20",
        "socials":"https://x.com/momonosuke1020/"
    },
    {
        "name": "May'n",
        "nickname": "",
        "type": "character",
        "birthday": "10/21",
        "socials":"https://x.com/mayn_tw"
    },
    {
        "name": "Mimura Haruka",
        "nickname": "",
        "type": "character",
        "birthday": "10/27",
        "socials":"https://x.com/mimuharu_1027"
    },
    {
        "name": "Udagawa Momoka",
        "nickname": "",
        "type": "character",
        "birthday": "11/13",
        "socials":"https://x.com/momoka_tpg"
    },
    {
        "name": "Momono Haruna",
        "nickname": "",
        "type": "character",
        "birthday": "11/25",
        "socials":"https://x.com/mom0no"
    },
    {
        "name": "Tenma Yuuki",
        "nickname": "",
        "type": "character",
        "birthday": "12/7",
        "socials":"https://x.com/TemmaYuuki"
    },
    {
        "name": "Sekine Akira",
        "nickname": "",
        "type": "character",
        "birthday": "12/16",
        "socials":"https://x.com/aki_lucky1216"
    },
    {
        "name": "Sato Hinata",
        "nickname": "",
        "type": "character",
        "birthday": "12/23",
        "socials":"https://x.com/satohina1223"
    },
    {
        "name": "Aimi",
        "nickname": "",
        "type": "character",
        "birthday": "12/25",
        "socials":"https://x.com/aimi_sound"
    },
];