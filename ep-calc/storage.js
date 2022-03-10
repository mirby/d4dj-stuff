var initializeClub;

jQuery(function($) {
    $(window).on("load", function() {
        var storage = window.localStorage;

        // Initialize event
        var obj = JSON.parse(storage.getItem("event"));
        if (obj) {
            obj.forEach(function(x) {
                for (var key in x) {
                    $("select[name=" + key + "]").val(x[key]);
                }
            });
        }
        displayCharSelect($('#eventtype').val());

        // Initialize club
        var obj = JSON.parse(storage.getItem("club"));
        if (obj) {
            obj.forEach(function(x) {
                for (var key in x) {
                    $("select[name=" + key + "]").val(x[key]);
                }
            });
        }
        
        // Initialize team
        var obj = JSON.parse(storage.getItem("team"));
        if (obj) {
            obj.forEach(function(x) {
                for (var key in x) {
                    populateTeam(key, x[key]);
                }
            });
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
});

function saveData() {
    var storage = window.localStorage;

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

    storage.setItem("club",JSON.stringify(clubItemsSave));

    // Event info
    var eventSave = [];
    eventSave.push({"eventbonus1":document.getElementById("eventbonus1").value});
    eventSave.push({"eventbonus2":document.getElementById("eventbonus2").value});
    eventSave.push({"eventbonus3":document.getElementById("eventbonus3").value});
    eventSave.push({"eventbonus4":document.getElementById("eventbonus4").value});
    eventSave.push({"eventbonus":document.getElementById("eventbonus").value});
    eventSave.push({"eventstyle":document.getElementById("eventstyle").value});
    eventSave.push({"eventtype":document.getElementById("eventtype").value});

    storage.setItem("event",JSON.stringify(eventSave));

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

    storage.setItem("team",JSON.stringify(teamSave));

    // Param info
    var paramSave = [];
    for (let x of characters) {
        for (var i = 1; i <= 3; i++) {
            var key = "param_" + x.toLowerCase() + "_" + i;
            paramSave.push({[key]:document.getElementById(key).value});
        }        
    }
    storage.setItem("param",JSON.stringify(paramSave));

    console.log("SAVED" + JSON.stringify(clubItemsSave));
    console.log("SAVED" + JSON.stringify(eventSave));
    console.log("SAVED" + JSON.stringify(teamSave));
    console.log("SAVED" + JSON.stringify(paramSave));

    alert("Saved!");
}

function removeData() {
    var storage = window.localStorage;
    if (confirm("Are you sure you want to clear all saved data?") == true) {
        storage.clear();
    }
}