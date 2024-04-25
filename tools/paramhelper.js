jQuery(function($) {
    $('#calculate').on('click', function() {
        calculate();
    });
});

function setupParamDropdown() {
    var types = ["Heart", "Tech", "Phys"];

    for (i of types) {
        var paramSelect = document.createElement("select");
        paramSelect.name = "growthParam" + i;
        paramSelect.id = "growthParam" + i;
        paramSelect.classList.add("selectpicker");
        paramSelect.classList.add("growthparamchar");
        paramSelect.classList.add("growthselector");
        paramSelect.setAttribute("data-live-search","false");
        paramSelect.setAttribute("data-width","fit");
        paramSelect.setAttribute("data-size","10");
    
        for (var j = 0; j <= 5; j+=.1) {
            var paramOption = document.createElement("option");
            j = Math.round(j * 10) / 10;
            paramOption.value = j;
            paramOption.setAttribute("data-content",j.toString() + "%");
            
            paramSelect.appendChild(paramOption);
        }
    
        document.getElementById("growthParam" + i + "Wrapper").appendChild(paramSelect);
    }
}

function calculate() {
    while (document.getElementById("output").hasChildNodes()) {
        document.getElementById("output").removeChild(document.getElementById("output").firstChild);
    }

    var heart = parseInt(document.getElementById("growthHeart").value) || 0;
    var tech = parseInt(document.getElementById("growthTech").value) || 0;
    var phys = parseInt(document.getElementById("growthPhys").value) || 0;

    var heartParam = parseFloat(document.getElementById("growthParamHeart").value);
    var techParam = parseFloat(document.getElementById("growthParamTech").value);
    var physParam = parseFloat(document.getElementById("growthParamPhys").value);

    var outputHeart = "";
    var outputTech = "";
    var outputPhys = "";
    var highest = 0;
    if (heart > tech) {
        if (heart > phys) {
            highest = heart;
        } else {
            highest = phys;
        }
    } else if (tech > phys) {
        highest = tech;
    } else {
        highest = phys;
    }

    // Check Heart
    if (heart == highest) {
        outputHeart = "Heart is the highest param.";
    } else {
        var difference = ((highest - heart) / heart) * 100;
        difference = Math.ceil(difference * 10) / 10;
        var currDifference = 5.0 - heartParam;

        if (difference > currDifference) {
            outputHeart = "Heart cannot be the highest param";
        } else {
            var outputVal = heartParam + difference;
            outputHeart = "To make heart the highest param, upgrade heart param to " + outputVal.toFixed(1);
        }
    }

    // Check tech
    if (tech == highest) {
        outputTech = "Tech is the highest param.";
    } else {
        var difference = ((highest - tech) / tech) * 100;
        difference = Math.ceil(difference * 10) / 10;
        var currDifference = 5.0 - techParam;

        if (difference > currDifference) {
            outputTech = "Tech cannot be the highest param";
        } else {
            var outputVal = techParam + difference;
            outputTech = "To make tech the highest param, upgrade tech param to " + outputVal.toFixed(1);
        }
    }

    // Check phys
    if (phys == highest) {
        outputPhys = "Phys is the highest param.";
    } else {
        var difference = ((highest - phys) / phys) * 100;
        difference = Math.ceil(difference * 10) / 10;
        var currDifference = 5.0 - physParam;

        if (difference > currDifference) {
            outputPhys = "Phys cannot be the highest param";
        } else {
            var outputVal = physParam + difference;
            outputPhys = "To make phys the highest param, upgrade phys param to " + outputVal.toFixed(1);
        }
    }

    const parent = document.getElementById("output");
    parent.appendChild(document.createTextNode(outputHeart));
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createTextNode(outputTech));
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createTextNode(outputPhys));
}