var songArray = [];
var tagMap = new Map();

const tags = [
    "A:First Mix",
    "A:Side Origin",
    "A:Groovy Festival",
    "A:Touhou",
    "A:from ARGONAVIS",
    "A:Princess Letters",
    "A:Tokyo 7th Sisters",
    "A:Sakura Wars",
    "A:WACCA",
    "A:Groove Coaster",
    "A:GekiChuMai",
    "A:Song with ☆",
    "A:♡ Songs",
    "A:Songs with Heart (spelled)",
    "A:Songs with DJ",
    "A:Song with Party",
    "A:Song with Night",
    "A:Song with Go",
    "A:Numbers Spelled Out",
    "A:Angel and Demon",
    "A:Theme of...",
    "A:Cat Songs",
    "A:BLACK or WHITE",
    "A:Songs with Dream",
    "A:Fighting Game",
    "A:Wrestling",
    "A:BPM over 250",
    "A:Cover Tracks Vol 1",
    "A:Cover Tracks Vol 2",
    "A:Cover Tracks Vol 3",
    "A:Cover Tracks Vol 4",
    "A:Cover Tracks Vol 5",
    "A:Cover Tracks Vol 6",
    "A:Cover Tracks Vol 7",
    "A:Cover Tracks Vol 8",
    "A:UniChØrd",
    "A:Abyssmare",
    "B:D4DJ Anime",
    "B:Event Song",
    "B:D4FES Songs",
    "B:Side Nova",
    "B:Bushiroad",
    "B:1, 2, 3...",
    "B:Song with !",
    "B:Song with Love",
    "B:Songs with MV",
    "B:Vtubers",
    "B:Hololive",
    "B:Retro Games",
    "B:Happy Around!",
    "B:Peaky P-key",
    "B:Photon Maiden",
    "B:Merm4id",
    "B:RONDO",
    "B:Lyrical Lily",
    "B:Special (unit)",
    "B:Summer 22 Dan",
    "B:Autumn 22 Dan",
    "B:Winter 23 Dan",
    "B:Spring 23 Dan",
    "B:Summer 23 Dan",
    "B:Instrumental Category",
    "C:Original Category",
    "C:Cover Category",
    "C:Game Category",
    "C:Base Category"
];

$(document).on('changed.bs.select', 'select', function(event) {
    displaySongsByHint();
});

const sortDate = () => {
    return function(a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    }
}

// const sortDateRev = () => {
//     return function(a, b) {
//         const dateA = new Date(a.date);
//         const dateB = new Date(b.date);
//         return dateB - dateA;
//     }
// }

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

function setInitialTheme() {
    document.getElementById("darkModeToggle").addEventListener("click", () => {
        const currentMode = document.body.classList.contains("dark-mode") ? "light" : "dark";
        setMode(currentMode);
    });

    const userMode = window.localStorage.getItem("mode");
    if (userMode) {
        setMode(userMode);
    }
}

function setMode(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
    document.body.classList.toggle("light-mode", mode === "light");
    document.getElementById("darkModeToggle").textContent = mode === "dark" ? "Dark Mode" : "Light Mode";

    window.localStorage.setItem("mode", mode);

    document.documentElement.setAttribute('data-bs-theme', mode);
}

function generateFilterBoxes() {
    for (let tagStr of tags) {
        parts = tagStr.split(":");
        
        var newDiv = document.createElement("div");
        newDiv.classList.add("form-check");
        newDiv.classList.add("form-check-inline");

        var newInput = document.createElement("input");
        newInput.classList.add("form-check-input");
        newInput.type = "checkbox";
        newInput.id = parts[1].replace(/\s/g, "");
        newInput.name = "filterOpts"; 
        newInput.value = parts[1];
        newInput.onclick = applyFilter;
        
        var newLabel = document.createElement("label");
        newLabel.classList.add("form-check-label");
        newLabel.setAttribute("for", parts[1].replace(/\s/g, ""));
        newLabel.textContent = parts[1];

        document.getElementById(parts[0] + "Tags").appendChild(newDiv);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newLabel);

        tagMap.set(parts[1], parts[0]);
    }
}

function generateSongDropdowns(trend) {
    var label = document.createElement("label");
    label.innerHTML = "Song hint for Trend " + trend.toUpperCase() + ":";
    label.htmlFor = trend + "songs";
    label.style.paddingRight = "15px";
    label.style.paddingBottom = "15px";

    var select = document.createElement("select");
    select.name = trend + "songs";
    select.id = trend + "songs";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    for (let id in songArray) {
        option = document.createElement("option");
        option.value = songArray[id].name;
        option.text = songArray[id].name;

        select.appendChild(option);
    }

    document.getElementById(trend + "TrendHint").appendChild(label);
    document.getElementById(trend + "TrendHint").appendChild(select);
}

function filterByTag(objects, value) {
    var filteredObjects = objects.filter(function(obj) {
        return obj["tags"] && obj ["tags"].includes(value);
    });

    return filteredObjects;
}

function applyFilter() {

    // Get active filters
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var checkedValues = Array.from(checkboxes).map(function(checkbox) {
        return checkbox.value;
    });

    filteredSongs = songArray;
    for (let value of checkedValues) {
        filteredSongs = filterByTag(filteredSongs, value);
    }

    var sort = document.querySelector('input[name="sortOptions"]:checked').value;
    if (!sort || sort === "None" || sort === 'null' || sort === 'undefined' || sort === "") {
        filteredSongs.sort(sortDate());
    } else if (sort === "scorePerc") {
        filteredSongs.sort(sort_by(sort, true, parseFloat));
    }

    displaySongList(filteredSongs);
}

function displaySongList(arr) {

    if (document.getElementById("songTableWrapper").hasChildNodes()) {
        document.getElementById("songTableWrapper").removeChild(document.getElementById("songTableWrapper").firstChild);
    }    

    var table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-bordered");
    let thead = table.createTHead();
    let row = thead.insertRow();
    var th = document.createElement("th");
    var text = document.createTextNode("Name");
    th.appendChild(text);
    row.appendChild(th);
    th = document.createElement("th");
    text = document.createTextNode("Tags");
    th.appendChild(text);
    row.appendChild(th);
    th = document.createElement("th");
    text = document.createTextNode("Score Potential");
    th.appendChild(text);
    row.appendChild(th);

    for (let x of arr) {
        var songRow = table.insertRow();
        songRow.insertCell().appendChild(document.createTextNode(x.name));
        songRow.insertCell().appendChild(document.createTextNode(x.tags));
        songRow.insertCell().appendChild(document.createTextNode(x.scorePerc));
    }

    document.getElementById("songTableWrapper").appendChild(table);
}

function generateSongArray() {
    songArray = [...enTags];
    hintArray = [...enTags];
    songArray.sort(sort_by("scorePerc", true, parseFloat));
    hintArray.sort(sort_by("scorePerc", true, parseFloat));
}

// Search songs by hints

function displaySongsByHint() {

    createSongHintTable();

    // Get the 3 hint songs
    var songA = document.getElementById("asongs").value;
    var songB = document.getElementById("bsongs").value;
    var songC = document.getElementById("csongs").value;

    var aTrends = getTrendTagsBySong(songA, "A");
    var bTrends = getTrendTagsBySong(songB, "B");
    var cTrends = getTrendTagsBySong(songC, "C");
    var cTrend = "";

    for (let tag of cTrends) {
        var trendLetter = tagMap.get(tag);
        if (trendLetter === "C") {
            cTrend = tag;
        }
    }

    while (document.getElementById("relatedTags").hasChildNodes()) {
        document.getElementById("relatedTags").removeChild(document.getElementById("relatedTags").firstChild);
    } 

    const parent = document.getElementById("relatedTags");
    parent.appendChild(document.createTextNode("A: " + aTrends));
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createTextNode("B: " + bTrends));
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createTextNode("C: " + cTrend));

    var idCounter = 1;
    for (let aTrend of aTrends) {
        for (let bTrend of bTrends) {

            if (idCounter != 1) {
                document.getElementById("songHints").appendChild(document.createElement("br"));
            }

            var songCounter = 0;
            var title = "If A: " + aTrend + " and B: " + bTrend + " and C: " + cTrend;
            createSongHintTitleRow(title, "trendRow" + idCounter);

            // Get any ABC
            var matchingSongsABC = getSongsByTags([aTrend, bTrend, cTrend]);
            if (matchingSongsABC.length != 0) {
                songCounter += matchingSongsABC.length;
                createSongHintRow("(ABC): " + matchingSongsABC.join(", "), "trendRow" + idCounter);
            }

            // Get any AB
            var matchingSongsAB = getSongsByTags([aTrend, bTrend]).filter(entry => !matchingSongsABC.includes(entry));
            if (matchingSongsAB.length != 0) {
                songCounter += matchingSongsAB.length;
                createSongHintRow("(AB): " + matchingSongsAB.join(", "), "trendRow" + idCounter);
            }

            // If total so far is less than 4, get AC
            if (songCounter < 4) {
                var matchingSongsAC = getSongsByTags([aTrend, cTrend]).filter(entry => !matchingSongsABC.includes(entry));
                if (matchingSongsAC.length != 0) {
                    songCounter += matchingSongsAC.length;
                    createSongHintRow("(AC): " + matchingSongsAC.join(", "), "trendRow" + idCounter);
                }
            }

            // If total so far is less than 4, get BC
            if (songCounter < 4) {
                var matchingSongsBC = getSongsByTags([bTrend, cTrend]).filter(entry => !matchingSongsABC.includes(entry));
                if (matchingSongsBC.length != 0) {
                    songCounter += matchingSongsBC.length;
                    createSongHintRow("(BC): " + matchingSongsBC.join(", "), "trendRow" + idCounter);
                }
            }

            // If total so far is less than 4, get A
            if (songCounter < 4) {
                var matchingSongsA = getSongsByTags([aTrend]).filter(entry => !matchingSongsABC.includes(entry))
                    .filter(entry => !matchingSongsAB.includes(entry))
                    .filter(entry => !matchingSongsAC.includes(entry));
                if (matchingSongsA.length != 0) {
                    songCounter += matchingSongsA.length;
                    createSongHintRow("(A): " + matchingSongsA.join(", "), "trendRow" + idCounter);
                }
            }

            idCounter += 1;
        }
    }
}

// function getRelatedTags(songTitles) {
//     const tagsSets = songTitles.map(title => new Set(songArray.find(song => song.name === title)?.tags));
//     const intersection = [...tagsSets.reduce((acc, set) => new Set([...acc].filter(tag => set.has(tag))))];
//     return intersection;
// }

// function getTagsBySongName(name) {
//     return songArray.find(item => item.name === name)?.tags;
// }

function getTrendTagsBySong(name, trendLetter) {
    var tagList = hintArray.find(item => item.name === name)?.tags;
    var tagListByTrend = [];
    for (let tag of tagList) {
        if (tagMap.get(tag) === trendLetter) {
            tagListByTrend.push(tag);
        }
    }

    return tagListByTrend;
}

function getSongsByTags(tagsToMatch) {
    return hintArray.filter(item => {
        const matchedTags = item.tags.filter(tag => tagsToMatch.includes(tag));
        return matchedTags.length === tagsToMatch.length;
    }).map(item => item.name);
}

function createSongHintTable() {
    if (document.getElementById("songHintWrapper").hasChildNodes()) {
        document.getElementById("songHintWrapper").removeChild(document.getElementById("songHintWrapper").firstChild);
    }

    var div = document.createElement("div");
    div.id = "songHints";

    document.getElementById("songHintWrapper").appendChild(div);
}

function createSongHintTitleRow(title, id) {
    var parent = document.getElementById("songHints");
    var div = document.createElement("div");
    div.id = id;
    var boldEle = document.createElement("b");
    var textEle = document.createTextNode(title);
    boldEle.appendChild(textEle);
    div.appendChild(boldEle);
    parent.appendChild(div);
}

function createSongHintRow(text, id) {
    var parent = document.getElementById(id);
    var div = document.createElement("div");
    var textEle = document.createTextNode(text);

    div.appendChild(textEle);
    parent.appendChild(div);
}