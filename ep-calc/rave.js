const tags = [
    "A:First Mix",
    "A:D4FES Songs",
    "A:Side Origin",
    "A:Event Song",
    "A:Groovy Festival",
    "A:Touhou",
    "A:from ARGONAVIS",
    "A:Princess Letters",
    "A:Tokyo 7th Sisters",
    "A:Sakura Wars",
    "A:WACCA",
    "A:Groove Coaster",
    "A:GekiChuMai",
    "A:♡ Songs",
    "A:Songs with Heart (spelled)",
    "A:Songs with DJ",
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
    "B:D4DJ Anime",
    "B:Side Nova",
    "B:1, 2, 3...",
    "B:Song with Go",
    "B:Song with !",
    "B:Song with Love",
    "B:Vtubers",
    "B:Hololive",
    "B:Retro Games",
    "B:Happy Around!",
    "B:Peaky P-key",
    "B:Photon Maiden",
    "B:Merm4id",
    "B:RONDO",
    "B:Lyrical Lily",
    "B:UniChØrd",
    "B:Abyssmare",
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
    }
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