$(document).ready(function() {
    $("#datepicker").datepicker();

    generateTimestamp();
});

jQuery(function($) {
    $('#datepicker').on('change', function () {
        generateTimestamp();
    });

    $('#timeInput').on('change', function () {
        generateTimestamp();
    });

    $('#timezoneInput').on('change', function () {
        generateTimestamp();
    });

    $('.settimezone').on('click', function() {
        updateTimezone(this.id);
        generateTimestamp();
    });

    $('.copybtn').on('click', function() {
        generateTimestamp();
        performCopy(this.id);
        
        // Send temporary 'Copied!' message upon click
        let text = document.getElementById(this.id.slice(0, -7) + "fade");
        text.classList.add("fade-in");
        setTimeout(function () {
            text.classList.remove("fade-in");
        }, 1000);
    });
});

function generateTimestamp() {

    var timeInput = document.getElementById("timeInput").value;
    var selectedDate = $("#datepicker").datepicker("getDate");
    var formattedDate = formatDate(selectedDate);
    var timezone = document.getElementById("timezoneInput").value;
    if (!/^[+-]/.test(timezone)) {
        timezone = "+" + timezone;
    }

    // Combine date and time strings
    var dateTimeString = formattedDate + "T" + timeInput + timezone;

    console.log(dateTimeString);

    // Create a Date object based on user input
    var timestamp = new Date(dateTimeString);

    console.log(timestamp);

    // Convert the formatted date to a Unix timestamp in seconds
    var unixTimestamp = Math.floor(timestamp.getTime() / 1000);

    console.log(unixTimestamp);

    display(unixTimestamp, timestamp);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function updateTimezone(id) {
    var input = document.getElementById("timezoneInput");

    if (id === "setlocal") {
        input.value = getUserLocalTimezoneOffset();
    } else if (id === "setutc") {
        input.value = "+00:00";
    } else if (id === "setjst") {
        input.value = "+09:00";
    }
}

function getUserLocalTimezoneOffset() {
    const now = new Date();
    console.log("Local time is " + now);
    const offsetMinutes = now.getTimezoneOffset();
    console.log("Offset min is " + offsetMinutes);
    const offsetHours = Math.abs(offsetMinutes / 60);
    console.log("Offset hours is " + offsetHours);
    const offsetMinutesPart = Math.abs(offsetMinutes % 60);
    console.log("Offset min part is " + offsetMinutesPart);
  
    const sign = offsetMinutes <= 0 ? '+' : '-';
  
    const formattedOffset = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutesPart).padStart(2, '0')}`;
  
    return formattedOffset;
}

// Display the Unix timestamp in various ways
function display(unixTimestamp, timestamp) {
    
	var formatter = new Intl.DateTimeFormat(navigator.language || 'en', { timeStyle: 'short' } || {});
	document.getElementById("stDisp").textContent = formatter.format(timestamp);
    document.getElementById("stForm").textContent = `<t:${unixTimestamp}:t>`;

    formatter = new Intl.DateTimeFormat(navigator.language || 'en', { timeStyle: 'medium' } || {});
	document.getElementById("ltDisp").textContent = formatter.format(timestamp);
    document.getElementById("ltForm").textContent = `<t:${unixTimestamp}:T>`;

    formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'short' } || {});
	document.getElementById("sdDisp").textContent = formatter.format(timestamp);
    document.getElementById("sdForm").textContent = `<t:${unixTimestamp}:d>`;

    formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'long' } || {});
	document.getElementById("ldDisp").textContent = formatter.format(timestamp);
    document.getElementById("ldForm").textContent = `<t:${unixTimestamp}:D>`;

    formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'long', timeStyle: 'short' } || {});
	document.getElementById("sdtDisp").textContent = formatter.format(timestamp);
    document.getElementById("sdtForm").textContent = `<t:${unixTimestamp}:f>`;

    formatter = new Intl.DateTimeFormat(navigator.language || 'en', { dateStyle: 'full', timeStyle: 'short' } || {});
	document.getElementById("ldtDisp").textContent = formatter.format(timestamp);
    document.getElementById("ldtForm").textContent = `<t:${unixTimestamp}:F>`;

    formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', { style: 'long', numeric: 'auto' } || {});
	var format = automaticRelativeDifference(timestamp);
	document.getElementById("rtDisp").textContent = formatter.format(format.duration, format.unit);
    document.getElementById("rtForm").textContent = `<t:${unixTimestamp}:R>`;
}

// From https://r.3v.fi/discord-timestamps/
function automaticRelativeDifference(d) {
	const diff = -((new Date().getTime() - d.getTime())/1000)|0;
	const absDiff = Math.abs(diff);

	if (absDiff > 86400*30*10) {
		return { duration: Math.round(diff/(86400*365)), unit: 'years' };
	}
	if (absDiff > 86400*25) {
		return { duration: Math.round(diff/(86400*30)), unit: 'months' };
	}
	if (absDiff > 3600*21) {
		return { duration: Math.round(diff/86400), unit: 'days' };
	}
	if (absDiff > 60*44) {
		return { duration: Math.round(diff/3600), unit: 'hours' };
	}
	if (absDiff > 30) {
		return { duration: Math.round(diff/60), unit: 'minutes' };
	}
	return { duration: diff, unit: 'seconds' };
}

function performCopy(id) {
    var formId = id.slice(0, -7) + "Form";

    navigator.clipboard.writeText(document.getElementById(formId).textContent);
}