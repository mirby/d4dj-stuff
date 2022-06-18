var localEt = new Map();

jQuery(function($) {
    $(window).on("load", function() {

        // Initialize any saved data
        var storage = window.localStorage;

        // Check first time user
        if (storage.getItem("firstTime") == null) {
            alert("If this is your first time, check out the Help Docs tab for tips to help get you started!")
            storage.setItem("firstTime", "false");
        }

        // Initialize extra training
        var obj = JSON.parse(storage.getItem("et"));
        if (obj) {
            localEt = new Map(obj);
            fillStat(document.getElementById("cards").value);
        }

        // Initialize param
        var obj = JSON.parse(storage.getItem("param"));
        if (obj) {
            obj.forEach(function(x) {
                for (var key in x) {
                    $("select[name=" + key + "]").val(x[key]);
                }
            });
        }

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
        }

        $('.selectpicker').selectpicker('refresh');

        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    });

    $('#saveData').on('click', function() {
        saveData();
    });

    $('#removeData').on('click', function() {
        removeData();
    });

    $('#loadData').on('click', function() {
        loadData();
    });

    $('#printStuff').on('click', function() {
        printStuff();
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
        localEt.set(document.getElementById("m" + i + "_id").innerHTML, document.getElementById("m" + i + "_et").value);
        localEt.set(document.getElementById("s" + i + "_id").innerHTML, document.getElementById("s" + i + "_et").value);
    }
    storage.setItem("et", JSON.stringify([...localEt]));

    // Param info
    var paramSave = [];
    for (let x of characters) {
        for (var i = 1; i <= 3; i++) {
            var key = "param_" + x.toLowerCase() + "_" + i;
            paramSave.push({[key]:document.getElementById(key).value});
        }        
    }
    storage.setItem("param",JSON.stringify(paramSave));

    console.log("Profile: " + profile + ":\n" + JSON.stringify(merges));
    console.log("Parameters: " + JSON.stringify(paramSave));
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
        localEt = new Map();

        refreshClubSelects();
        refreshEventSelect();
        refreshParamSelects();
        refreshMainTeam();
        refreshSupportTeam();

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
            refreshMainTeam();
            refreshSupportTeam();
        }
    
        calcModPower();
        calcClubPower();
        calcEventPower();
        calcDisplayPower();
        calcDisplayParams();
    }
}

function printStuff() {
    var storage = window.localStorage;
    console.log(storage);
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