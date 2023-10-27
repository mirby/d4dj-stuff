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
    }
}

// Sort birthdays by next upcoming
function sortBirthdays(a, b) {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: "Japan" });
    var today = formatter.format(new Date());
    console.log(today);
    today = new Date(today.split("/")[2], today.split("/")[0] - 1, today.split("/")[1]);
    console.log(today);
    var currentYear = today.getFullYear();
    console.log(currentYear);

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
        "birthday": "1/7"
    },
    {
        "name": "Kaibara Michiru",
        "type": "character",
        "birthday": "1/23"
    },
    {
        "name": "Hanamaki Towa",
        "type": "character",
        "birthday": "1/30"
    },
    {
        "name": "Inuyose Shinobu",
        "type": "character",
        "birthday": "2/4"
    },
    {
        "name": "Tendo Hayate",
        "type": "character",
        "birthday": "2/12"
    },
    {
        "name": "Takeshita Miiko",
        "type": "character",
        "birthday": "2/22"
    },
    {
        "name": "Ohnaruto Muni",
        "type": "character",
        "birthday": "3/3"
    },
    {
        "name": "Shinomiya Kokoa",
        "type": "character",
        "birthday": "3/12"
    },
    {
        "name": "Yano Hiiro",
        "type": "character",
        "birthday": "3/23"
    },
    {
        "name": "Niijima Ibuki",
        "type": "character",
        "birthday": "4/10"
    },
    {
        "name": "Yamate Kyoko",
        "type": "character",
        "birthday": "4/27"
    },
    {
        "name": "Izumo Saki",
        "type": "character",
        "birthday": "5/10"
    },
    {
        "name": "Kase Mana",
        "type": "character",
        "birthday": "5/18"
    },
    {
        "name": "Kasuga Haruna",
        "type": "character",
        "birthday": "5/25"
    },
    {
        "name": "Matsuyama Dalia",
        "type": "character",
        "birthday": "6/1"
    },
    {
        "name": "Sophia",
        "type": "character",
        "birthday": "6/11"
    },
    {
        "name": "Neo",
        "type": "character",
        "birthday": "6/12"
    },
    {
        "name": "Aimoto Rinku",
        "type": "character",
        "birthday": "6/30"
    },
    {
        "name": "Miyake Aoi",
        "type": "character",
        "birthday": "7/7"
    },
    {
        "name": "Takao Toka",
        "type": "character",
        "birthday": "7/22"
    },
    {
        "name": "Mizushima Marika",
        "type": "character",
        "birthday": "7/30"
    },
    {
        "name": "Weronika",
        "type": "character",
        "birthday": "8/2"
    },
    {
        "name": "Tsukimiyama Nagisa",
        "type": "character",
        "birthday": "8/15"
    },
    {
        "name": "Himegami Shano",
        "type": "character",
        "birthday": "8/24"
    },
    {
        "name": "Seto Rika",
        "type": "character",
        "birthday": "8/30"
    },
    {
        "name": "Amano Airi",
        "type": "character",
        "birthday": "9/1"
    },
    {
        "name": "Shimizu Esora",
        "type": "character",
        "birthday": "9/9"
    },
    {
        "name": "Akashi Maho",
        "type": "character",
        "birthday": "9/20"
    },
    {
        "name": "Ichihoshi Lumina",
        "type": "character",
        "birthday": "9/29"
    },
    {
        "name": "Elsie",
        "type": "character",
        "birthday": "10/5"
    },
    {
        "name": "Fukushima Noa",
        "type": "character",
        "birthday": "10/9"
    },
    {
        "name": "Togetsu Rei",
        "type": "character",
        "birthday": "10/30"
    },
    {
        "name": "Shiratori Kurumi",
        "type": "character",
        "birthday": "11/12"
    },
    {
        "name": "Hidaka Saori",
        "type": "character",
        "birthday": "11/27"
    },
    {
        "name": "Sasago Jennifer Yuka",
        "type": "character",
        "birthday": "12/5"
    },
    {
        "name": "Sakurada Miyu",
        "type": "character",
        "birthday": "12/14"
    },
    {
        "name": "Tsunko",
        "type": "character",
        "birthday": "1/9"
    },
    {
        "name": "Raychell",
        "type": "character",
        "birthday": "1/13"
    },
    {
        "name": "Mizuki Nana",
        "type": "character",
        "birthday": "1/21"
    },
    {
        "name": "Komiya Arisa",
        "type": "character",
        "birthday": "2/5"
    },
    {
        "name": "Irie Maiko",
        "type": "character",
        "birthday": "2/6"
    },
    {
        "name": "Nanaki Kanon",
        "type": "character",
        "birthday": "2/7"
    },
    {
        "name": "Koiwai Kotori",
        "type": "character",
        "birthday": "2/15"
    },
    {
        "name": "Watase Yuzuki",
        "type": "character",
        "birthday": "2/18"
    },
    {
        "name": "Koizumi Moeka",
        "type": "character",
        "birthday": "2/27"
    },
    {
        "name": "Tanda Hazuki",
        "type": "character",
        "birthday": "2/28"
    },
    {
        "name": "Yura Akari",
        "type": "character",
        "birthday": "3/12"
    },
    {
        "name": "Umemura Hinako",
        "type": "character",
        "birthday": "3/13"
    },
    {
        "name": "Nishio Yuka",
        "type": "character",
        "birthday": "3/31"
    },
    {
        "name": "Iwata Haruki",
        "type": "character",
        "birthday": "4/3"
    },
    {
        "name": "Shindo Amane",
        "type": "character",
        "birthday": "4/20"
    },
    {
        "name": "Okada Mei",
        "type": "character",
        "birthday": "5/19"
    },
    {
        "name": "Kurachi Reo",
        "type": "character",
        "birthday": "5/22"
    },
    {
        "name": "Hirajima Natsumi",
        "type": "character",
        "birthday": "5/28"
    },
    {
        "name": "Yamada Misuzu",
        "type": "character",
        "birthday": "6/10"
    },
    {
        "name": "Tsumugi Risa",
        "type": "character",
        "birthday": "7/5"
    },
    {
        "name": "Hazuki Himari",
        "type": "character",
        "birthday": "8/16"
    },
    {
        "name": "Aisaka Yuuka",
        "type": "character",
        "birthday": "9/5"
    },
    {
        "name": "Sumi Tomomi Jiena",
        "type": "character",
        "birthday": "9/5"
    },
    {
        "name": "Fukagawa Ruka",
        "type": "character",
        "birthday": "9/6"
    },
    {
        "name": "Takagi Miyu",
        "type": "character",
        "birthday": "9/8"
    },
    {
        "name": "Takahashi Karin",
        "type": "character",
        "birthday": "9/9"
    },
    {
        "name": "Kagami Karin",
        "type": "character",
        "birthday": "9/19"
    },
    {
        "name": "Negishi Ai",
        "type": "character",
        "birthday": "9/27"
    },
    {
        "name": "Kato Rihona",
        "type": "character",
        "birthday": "10/3"
    },
    {
        "name": "Otsuka Sae",
        "type": "character",
        "birthday": "10/10"
    },
    {
        "name": "May'n",
        "type": "character",
        "birthday": "10/21"
    },
    {
        "name": "Mimura Haruka",
        "type": "character",
        "birthday": "10/27"
    },
    {
        "name": "Momono Haruna",
        "type": "character",
        "birthday": "11/25"
    },
    {
        "name": "Tenma Yuuki",
        "type": "character",
        "birthday": "12/7"
    },
    {
        "name": "Sato Hinata",
        "type": "character",
        "birthday": "12/23"
    },
    {
        "name": "Aimi",
        "type": "character",
        "birthday": "12/25"
    },
];