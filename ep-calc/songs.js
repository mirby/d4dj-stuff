var songArray = [];
var standardSongArray = [];

const songDefaultSort = () => {
    return function(a, b) {
        return -1 * ((a.category.toUpperCase() > b.category.toUpperCase()) - (b.category.toUpperCase() > a.category.toUpperCase())) ||
        ((parseInt(a.unitId) > parseInt(b.unitId)) - (parseInt(b.unitId) > parseInt(a.unitId))) ||
        ((a.name.toUpperCase() > b.name.toUpperCase()) - (b.name.toUpperCase() > a.name.toUpperCase()));
    }
}

const sortDate = () => {
    return function(a, b) {
        return ((parseInt(a.jpStartTimestamp) > parseInt(b.jpStartTimestamp)) - (parseInt(b.jpStartTimestamp) > parseInt(a.jpStartTimestamp))) ||
            ((a.name.toUpperCase() > b.name.toUpperCase()) - (b.name.toUpperCase() > a.name.toUpperCase()));
    }
}

const sortDateRev = () => {
    return function(a, b) {
        return -1 * ((parseInt(a.jpStartTimestamp) > parseInt(b.jpStartTimestamp)) - (parseInt(b.jpStartTimestamp) > parseInt(a.jpStartTimestamp)));
    }
}

const sortName = () => {
    return function(a, b) {
        return ((a.name.toUpperCase() > b.name.toUpperCase()) - (b.name.toUpperCase() > a.name.toUpperCase()));
    }
}

function generateSongArray() {

    var timestamp = parseFloat(songList["time"]);
    var updateDate = new Date(timestamp * 1000).toDateString().split(' ').slice(1).join(' ');
    document.getElementById("updated").innerHTML = updateDate;

    Object.keys(songList).forEach(function(key) {

        if (key === "time") {
            return;
        }

        var unitId = songList[key].unitId;
        var unit = "";
        var unitIcon = "";

        switch (unitId) {
            case 1:
                unit = "Happy Around!";
                unitIcon = "hapiara";
                break;
            case 2:
                unit = "Peaky P-key";
                unitIcon = "peaky";
                break;
            case 3:
                unit = "Photon Maiden";
                unitIcon = "photon";
                break;
            case 4:
                unit = "Merm4id";
                unitIcon = "mermaid";
                break;
            case 5:
                unit = "RONDO";
                unitIcon = "rondo";
                break;
            case 6:
                unit = "Lyrical Lily";
                unitIcon = "lyrilily";
                break;
            default:
                unit = "Other";
                unitIcon = "none";
        }

        songArray.push({
            "id":songList[key].id,
            "name":songList[key].name,
            "jpName":songList[key].jpName,
            "category":songList[key].category,
            "unitId":songList[key].unitId,
            "unit":unit,
            "unitIcon":unitIcon,
            "isHidden":songList[key].isHidden,
            "jpStart":songList[key].jpStart,
            "jpStartTimestamp":Date.parse(songList[key].jpStart),
            "note":songList[key].note,
        })
    });

    standardSongArray = [...songArray];
}

function performSort(arr) {
    var sort = document.querySelector('input[name="sortOptions"]:checked').value;
    if (!sort || sort === "category" || sort === 'null' || sort === 'undefined' || sort === "") {
        arr.sort(songDefaultSort());
    } else if (sort === "date") {
        arr.sort(sortDate());
    } else if (sort === "dateRev") {
        arr.sort(sortDateRev());
    } else if (sort === "name") {
        arr.sort(sortName());
    }


    displaySongList(arr);
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
    var text = document.createTextNode("Original Title");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Translated Title");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Release Date (JP)");
    th.style = "width:120px";
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Category");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Unit");
    th.appendChild(text);
    row.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("Notes");
    th.appendChild(text);
    row.appendChild(th);

    var enCount = 0;

    for (let x of arr) {
        if (!(x.name === "")) {
            enCount++;
        }
        var charRow = table.insertRow();
        charRow.insertCell().appendChild(document.createTextNode(x.jpName));
        charRow.insertCell().appendChild(document.createTextNode(x.name));
        charRow.insertCell().appendChild(document.createTextNode(new Date(x.jpStartTimestamp).toDateString().split(' ').slice(1).join(' ')));
        charRow.insertCell().appendChild(document.createTextNode(x.category));

        if (x.unitIcon !== "none") {
            var img = document.createElement("img");
            img.src = '../icons/icon_' + x.unitIcon + '.png';
            img.width = 30;
            img.height = 30;
            img.title = x.unit;
            charRow.insertCell().appendChild(img);
        } else {
            charRow.insertCell().appendChild(document.createTextNode(x.unit));
        }
        

        if (x.isHidden) {
            if (x.note != "") {
                charRow.insertCell().appendChild(document.createTextNode(x.note + ", Easter Egg"));
            } else {
                charRow.insertCell().appendChild(document.createTextNode("Easter Egg"));
            }
        } else {
            charRow.insertCell().appendChild(document.createTextNode(x.note));
        }
    }

    document.getElementById("songCount").innerHTML = enCount;
    document.getElementById("songTableWrapper").appendChild(table);
}