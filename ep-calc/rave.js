function filterByTag(objects, value) {
    var filteredObjects = objects.filter(function(obj) {
        return obj["tags"] && obj ["tags"].includes(value);
    });

    return filteredObjects;
}

function applyFilter(objects) {
    // Get active filters
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var checkedValues = Array.from(checkboxes).map(function(checkbox) {
        return checkbox.value;
    });

    filteredSongs = objects;
    for (let value of checkedValues) {
        filteredSongs = filterByTag(filteredSongs, value);
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

    for (let x of arr) {
        var songRow = table.insertRow();
        songRow.insertCell().appendChild(document.createTextNode(x.name));
        songRow.insertCell().appendChild(document.createTextNode(x.tags));
    }

    document.getElementById("songTableWrapper").appendChild(table);
}

var songArray = [];

function generateSongArray() {
    songArray = [...enTags];
    //console.log(cardArray);
}