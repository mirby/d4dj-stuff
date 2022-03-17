jQuery(function($) {
    $('#calculateep').on('click', function() {
        // TODO add validations for all the input fields
        calculateEp();
        applyFormatting();
    });
});

function calculateEp() {

    var score = parseInt(document.getElementById("scorein").value);
    var bonus = (parseInt(document.getElementById("teambonus").value) / 100) + 1;
    var param = Math.floor(parseInt(document.getElementById("paramselout").value) / 600);
    var volts = parseInt(document.getElementById("voltsel").value);

    var roomscore = parseInt(document.getElementById("roomscorein").value);
    if (isNaN(roomscore) || roomscore == 0) {
        roomscore = score * 4;
    }

    // Poker
    var result = volts * Math.floor(bonus * (50 + Math.floor(score / 4000) + param));
    document.querySelector('input[name="poker_ep"]').value = result || 0;
    document.querySelector('input[name="slots_ep"]').value = result || 0; // slots ep is the same as poker ep, for now

    result = volts * Math.floor(bonus * (30 + Math.floor(score / 10000)));
    document.querySelector('input[name="poker_coins"]').value = result || 0;

    // Slots
    result = volts * Math.floor(bonus * (150 + Math.floor(score / 8000)));
    document.querySelector('input[name="slots_medals"]').value = result || 0;

    // Medley
    result = volts * Math.floor(bonus * (10 + Math.floor(score / 15000) + param));
    document.querySelector('input[name="medley_ep_free"]').value = result || 0;

    result = volts * Math.floor(bonus * (10 + Math.floor(score / 10000) + Math.max(10, Math.floor(roomscore / 80000)) + param));
    document.querySelector('input[name="medley_ep_multi"]').value = result || 0;

    result = volts * (15 + Math.floor(score / 50000));
    var result2 = volts * (20 + Math.floor(score / 50000));
    document.querySelector('input[name="medley_tickets"]').value = (result || "-") + "-" + (result2 || "-");

    result = Math.floor(bonus * (100 + Math.floor(score / 1000) + param));
    document.querySelector('input[name="medley_ep_task"]').value = result || 0;

    // Bingo
    result = volts * Math.floor(bonus * (Math.max(10, Math.floor(score / 10000)) + param));
    document.querySelector('input[name="bingo_ep_free"]').value = result || 0;

    result = volts * Math.floor(bonus * (150 + Math.max(10, Math.floor(score / 10000)) + param));
    document.querySelector('input[name="bingo_ep_battle"]').value = result || 0;

    result = volts * Math.floor(bonus * (110 + Math.max(10, Math.floor(score / 10000)) + param));
    document.querySelector('input[name="bingo_ep_battle_4"]').value = result || 0;

    // Raid
    var result = volts * Math.floor(bonus * (50 + Math.floor(score / 10000) + param));
    document.querySelector('input[name="raid_ep"]').value = result || 0;

    var result = volts * (300 + Math.floor(score / 6000));
    document.querySelector('input[name="raid_ep_special"]').value = result || 0;
}

/*
    Apply a border to the current event type
*/
function applyFormatting() {
    var fieldsets = document.getElementsByClassName("outputfield");
    var currentType = document.getElementById("eventtype").value;
     for (let x of fieldsets) {
         x.classList.remove("fieldsetactive");
         var type = "event-" + x.childNodes[0].nextSibling.innerHTML.toLowerCase();
        if (type === currentType) {
            x.classList.add("fieldsetactive");
        }
    }
}