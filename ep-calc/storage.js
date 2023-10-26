var localEt = new Map();
var localStats = new Map();
var localParam = new Map();

jQuery(function($) {
    $(window).on("load", function() {

        // Initialize any saved data
        var storage = window.localStorage;

        // Check first time user
        if (storage.getItem("firstTime") == null) {
            alert("If this is your first time, check out the Help Docs tab for tips to help get you started!")
            storage.setItem("firstTime", "false");
        }

        // Set mode theme
        setInitialTheme();

        // Initialize growth updates
        var obj = JSON.parse(storage.getItem("growth"));
        if (obj) {
            localStats = new Map(obj);
        }

        // Initialize extra training
        var obj = JSON.parse(storage.getItem("et"));
        if (obj) {
            localEt = new Map(obj);
        }

        // Initialize the card selectors
        fillStat(document.getElementById("cards").value);
        populateStats(document.getElementById("growthCards").value);

        // Initialize param
        var obj = JSON.parse(storage.getItem("param"));
        if (obj) {
            if (storage.getItem("needsparampatch") == null) {
                patchParam(obj);
                storage.setItem("needsparampatch", "false");
            } else {
                localParam = new Map(obj);
                obj.forEach(function(value, key) {
                    $("select[name=" + value[0] + "]").val(value[1]);
                });
            }
        }

        // Display growth-able cards chart
        displayGrowthCardChart(cardArray2);

        var profile = document.getElementById("profsel").value;
        var obj = storage.getItem(profile);
        if (obj) {
    
            var jsonObj = JSON.parse(obj);
    
            // Initialize team
            if (jsonObj["team"]) {
                jsonObj["team"].forEach(function(x) {
                    for (var key in x) {
                        populateTeam(key, x[key]);
                    }
                });
            }

            // Initialize event
            if (jsonObj["event"]) {
                $("select[name=eventselector]").val(jsonObj["event"][0].eventid);
                fillEventDisplay();
            }
    
            // Initialize club
            if (jsonObj["club"]) {
                if (storage.getItem("needsclubpatch") == null) {
                    patchClub();
                    storage.setItem("needsclubpatch", "false");
                }

                jsonObj["club"].forEach(function(x) {
                    for (var key in x) {
                        $("select[name=" + key + "]").val(x[key]);
                    }
                });
            }
        } else {
            refreshTeam();
        }

        $('.selectpicker').selectpicker('refresh');

        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    });

    $('#saveData').on('click', function() {
        if ($('#teamSelectSection').hasClass('show')) {
            $('#teamSelectSection').toggleClass('show');
        }
        saveData();
    });

    $('#removeData').on('click', function() {
        if ($('#teamSelectSection').hasClass('show')) {
            $('#teamSelectSection').toggleClass('show');
        }
        removeData();
    });

    $('#loadData').on('click', function() {
        if ($('#teamSelectSection').hasClass('show')) {
            $('#teamSelectSection').toggleClass('show');
        }
        loadData();
    });

    $('#printStuff').on('click', function() {
        printStuff();
    });

    $('#updateStats').on('click', function() {
        updateStats();
        displayGrowthCardChart(cardArray2);
    });

    $('#resetStats').on('click', function() {
        resetStats();
        displayGrowthCardChart(cardArray2);
    });
});

function saveData() {
    var storage = window.localStorage;

    // Currently selected profile
    var profile = document.getElementById("profsel").value;

    // Club items
    var clubItemsSave = [];
    clubItemsSave.push({"club-display":document.getElementById("club-display").value});
    clubItemsSave.push({"club-djbooth":document.getElementById("club-djbooth").value});
    clubItemsSave.push({"club-discl":document.getElementById("club-discl").value});
    clubItemsSave.push({"club-discr":document.getElementById("club-discr").value});
    clubItemsSave.push({"club-front":document.getElementById("club-front").value});
    clubItemsSave.push({"club-side":document.getElementById("club-side").value});
    clubItemsSave.push({"club-back":document.getElementById("club-back").value});
    clubItemsSave.push({"club-frame":document.getElementById("club-frame").value});
    clubItemsSave.push({"club-light":document.getElementById("club-light").value});
    clubItemsSave.push({"club-accessory":document.getElementById("club-accessory").value});
    clubItemsSave.push({"club-decoration":document.getElementById("club-decoration").value});

    // Event info
    var eventSave = [];
    eventSave.push({"eventid":document.getElementById("eventid").innerHTML});

    // Team info
    var teamSave = [];
    teamSave.push({"m1":document.getElementById("m1_id").innerText});
    teamSave.push({"m2":document.getElementById("m2_id").innerText});
    teamSave.push({"m3":document.getElementById("m3_id").innerText});
    teamSave.push({"m4":document.getElementById("m4_id").innerText});
    teamSave.push({"s1":document.getElementById("s1_id").innerText});
    teamSave.push({"s2":document.getElementById("s2_id").innerText});
    teamSave.push({"s3":document.getElementById("s3_id").innerText});
    teamSave.push({"s4":document.getElementById("s4_id").innerText});

    var merges = {
        ...{"club":clubItemsSave},
        ...{"event":eventSave},
        ...{"team":teamSave}
    }

    storage.setItem(profile, JSON.stringify(merges));

    // Extra training info
    for (var i = 1; i<= 4; i++) {
        var id = document.getElementById("m" + i + "_id").innerHTML;
        if (id !== "") {
            localEt.set(id, document.getElementById("m" + i + "_et").value);    
        }
        
        id = document.getElementById("s" + i + "_id").innerHTML;
        if (id !== "") {
            localEt.set(id, document.getElementById("s" + i + "_et").value);    
        }
    }
    storage.setItem("et", JSON.stringify([...localEt]));

    // Param info
    for (let x of characters) {
        for (var i = 1; i <= 3; i++) {
            var key = "param_" + x.toLowerCase() + "_" + i;
            localParam.set(key, document.getElementById(key).value);
        }        
    }
    storage.setItem("param",JSON.stringify([...localParam]));

    console.log("Profile: " + profile + ":\n" + JSON.stringify(merges));
    console.log("Parameters: " + JSON.stringify([...localParam]));
    console.log("Extra training: " + JSON.stringify([...localEt]));

    // After saving, recreate the card list
    generateCardArray();
    generateFilters(cardArray);

    alert("Saved profile " + profile + "!");
}

function removeData() {
    var storage = window.localStorage;
    if (confirm("Are you sure you want to clear all saved data?")) {
        storage.clear();
        storage.setItem("firstTime", "false");
        storage.setItem("needsclubpatch", "false");
        storage.setItem("needsparampatch", "false");
        localEt = new Map();
        localStats = new Map();
        localParam = new Map();

        refreshClubSelects();
        refreshEventSelect();
        refreshParamSelects();
        refreshTeam();

        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    }
}

function loadData() {
    var storage = window.localStorage;

    var profile = document.getElementById("profsel").value;
    if (confirm("Are you sure you wish to load profile " + profile + "? Make sure you save first!")) {
        var obj = storage.getItem(profile);
        if (obj) {
    
            var jsonObj = JSON.parse(obj);
    
            // Initialize team
            if (jsonObj["team"]) {
                jsonObj["team"].forEach(function(x) {
                    for (var key in x) {
                        populateTeam(key, x[key]);
                    }
                });
            }
    
            // Initialize event
            if (jsonObj["event"]) {
                $("select[name=eventselector]").val(jsonObj["event"][0].eventid);
                fillEventDisplay();
            }
    
            // Initialize club
            if (jsonObj["club"]) {
                jsonObj["club"].forEach(function(x) {
                    for (var key in x) {
                        $("select[name=" + key + "]").val(x[key]);
                    }
                });
            }
    
            $('.selectpicker').selectpicker('refresh');
        } else {
            // if doesnt exist, refresh the page items
            console.log("Profile " + profile + " does not exist.");
            refreshClubSelects();
            refreshEventSelect();
            refreshTeam();
        }
    
        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    }
}

// Save the growth stats when update button is clicked
function updateStats() {
    var storage = window.localStorage;
    var id = document.getElementById("growthCards").value;
    var char = cards[id].character.toLowerCase();

    // Save ET value
    var et = document.getElementById("growthEt").value;
    localEt.set(id, et);
    storage.setItem("et", JSON.stringify([...localEt]));

    var heart = document.getElementById("growthHeartNew").value;
    var tech = document.getElementById("growthTechNew").value;
    var phys = document.getElementById("growthPhysNew").value;

    // Work backwards to get base param values
    var paramHeart = parseFloat(document.getElementById("growthParamHeart").value);
    var paramTech = parseFloat(document.getElementById("growthParamTech").value);
    var paramPhys = parseFloat(document.getElementById("growthParamPhys").value);

    document.getElementById("param_" + char + "_1").value = paramHeart;
    document.getElementById("param_" + char + "_2").value = paramTech;
    document.getElementById("param_" + char + "_3").value = paramPhys;
    $.refreshSpecificParam(char);

    localParam.set("param_" + char + "_" + 1, paramHeart);
    localParam.set("param_" + char + "_" + 2, paramTech);
    localParam.set("param_" + char + "_" + 3, paramPhys);
    storage.setItem("param", JSON.stringify([...localParam]));

    heart = Math.ceil(heart / (1 + (paramHeart / 100)));
    tech = Math.ceil(tech / (1 + (paramTech / 100)));
    phys = Math.ceil(phys / (1 + (paramPhys / 100)));

    switch (et) {
        case "1":
            etVal = 2000;
            break;
        case "2":
            etVal = 2500;
            break;
        case "3":
            etVal = 3000;
            break;
        case "4":
            etVal = 4500;
            break;
        default:
            etVal = 0;
    }

    if (heart > tech) {
        if (heart > phys) {
            heart -= etVal;
        } else {
            phys -= etVal;
        }
    } else if (tech > phys) {
        tech -= etVal;
    } else {
        phys -= etVal;
    }

    var skill = document.getElementById("growthSkillNew").value;

    localStats.set(id + "_heart", heart);
    localStats.set(id + "_tech", tech);
    localStats.set(id + "_phys", phys);
    localStats.set(id + "_skill", parseFloat(skill / 100));
    storage.setItem("growth", JSON.stringify([...localStats]));

    // update any team members with updated stats
    for (let x of ["m", "s"]) {
        for (let i = 1; i <=4; i++ ) {
            var selection = x + i;
            var tempId = document.getElementById(selection + "_id").innerHTML;
            var tempChar = document.getElementById(selection + "_char").innerHTML;
            if (tempId === id) {
                document.getElementById(selection + "_heartbase").innerHTML = heart;
                document.getElementById(selection + "_techbase").innerHTML = tech;
                document.getElementById(selection + "_physbase").innerHTML = phys;
                document.getElementById(selection + "_skill").innerHTML = skill.toString() + "%";

                document.getElementById(selection + "_et").value = et;
                $.refreshSelect3(selection);
                
                calcModPower();
                calcClubPower();
                calcEventPower();
                calcDisplayPower();
                calcDisplayParams();
            } else if (tempChar === char) { 
                calcModPower();
                calcClubPower();
                calcEventPower();
                calcDisplayPower();
                calcDisplayParams();
            }
        }
    }

    console.log("Parameters: " + JSON.stringify([...localParam]));
    console.log("Extra training: " + JSON.stringify([...localEt]));
    console.log("Upgraded Stats: " + JSON.stringify([...localStats]));

    // After saving, recreate the card list
    generateCardArray();
    generateFilters(cardArray);

    populateStats(id);
}

function resetStats() {

    var storage = window.localStorage;
    var id = document.getElementById("growthCards").value;

    // Delete the saved values
    localStats.delete(id + "_heart");
    localStats.delete(id + "_tech");
    localStats.delete(id + "_phys");
    localStats.delete(id + "_skill");
    storage.setItem("growth", JSON.stringify([...localStats]));

    // reset the base values
    var heart = cards[id].heart;
    var tech = cards[id].technical;
    var phys = cards[id].physical;
    var skill = Math.round(cards[id].skill * 100);

    // update any team members with updated stats
    for (let x of ["m", "s"]) {
        for (let i = 1; i <=4; i++ ) {
            var selection = x + i;
            var tempId = document.getElementById(selection + "_id").innerHTML;
            if (tempId === id) {
                document.getElementById(selection + "_heartbase").innerHTML = heart;
                document.getElementById(selection + "_techbase").innerHTML = tech;
                document.getElementById(selection + "_physbase").innerHTML = phys;
                document.getElementById(selection + "_skill").innerHTML = skill.toString() + "%";

                calcModPower();
                calcClubPower();
                calcEventPower();
                calcDisplayPower();
                calcDisplayParams();
                break;
            }
        }
    }

    // After saving, recreate the card list
    generateCardArray();
    generateFilters(cardArray);

    populateStats(id);
}

function printStuff() {
    var storage = window.localStorage;
    //console.log(storage);

    console.log("Parameters: " + JSON.stringify([...localParam]));
    console.log("Extra training: " + JSON.stringify([...localEt]));
    console.log("Upgraded Stats: " + JSON.stringify([...localStats]));
}

// Changed club indices. Patches cases where people had old save data. Need to fix for each profile (if it exists)
function patchClub() {

    var storage = window.localStorage;

    for (let i = 1; i <= 5; i++) {
        var obj = storage.getItem(i.toString());
        if (obj) {
            var jsonObj = JSON.parse(obj);
            var clubJson = jsonObj["club"];
            if (!isNaN(clubJson[0]["club-display"])) {
                var newClubJson = [];
                clubJson.forEach(function(x) {
                    for (var key in x) {
                        switch (key) {
                            case "club-display":
                                newClubJson.push({[key]:clubArray1[x[key]-1]})
                                break;
                            case "club-djbooth":
                                newClubJson.push({[key]:clubArray1[x[key]-1]})
                                break;
                            case "club-discl":
                                newClubJson.push({[key]:clubArray1[x[key]-1]})
                                break;
                            case "club-discr":
                                newClubJson.push({[key]:clubArray1[x[key]-1]})
                                break;
                            case "club-front":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-side":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-back":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-frame":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-light":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-accessory":
                                newClubJson.push({[key]:clubArray2[x[key]-1]})
                                break;
                            case "club-decoration":
                                newClubJson.push({[key]:clubArray3[x[key]-1]})
                                break;
                        }
                    }
                });
                jsonObj.club = newClubJson;
                storage.setItem(i.toString(), JSON.stringify(jsonObj));
            }
        }        
    }
}

// Changed param setup
function patchParam(obj) {
    var storage = window.localStorage;
    obj.forEach(function(x) {
        for (var key in x) {
            localParam.set(key, x[key]);
            $("select[name=" + key + "]").val(x[key]);
        }
    });
    storage.setItem("param",JSON.stringify([...localParam]));
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