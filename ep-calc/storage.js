var initializeClub;

jQuery(function($) {
    $(window).on("load", function() {
        // Initialize event
        displayCharSelect($('#eventtype').val());

        // Initialize club
        var storage = window.localStorage;
        var obj = JSON.parse(storage.getItem("club"));
        if (obj) {
            obj.forEach(function(x) {
                for (var key in x) {
                    $("select[name=" + key + "]").val(x[key]);
                }
            });
            $('.selectpicker').selectpicker('refresh');
        }
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
    console.log("SAVED" + JSON.stringify(clubItemsSave));
    alert("Saved!");

    // Event info
}

function removeData() {
    var storage = window.localStorage;
    if (confirm("Are you sure you want to clear all saved data?") == true) {
        storage.clear();
    }
}