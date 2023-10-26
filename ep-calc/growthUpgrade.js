function charSort(a, b) {
    const indexA = characters.indexOf(a.character);
    const indexB = characters.indexOf(b.character);

    return (indexA > indexB) - (indexB > indexA) ||
        -1 * ((parseInt(a.rarity) > parseInt(b.rarity)) - (parseInt(b.rarity) > parseInt(a.rarity))) ||
        (a.cardname.toUpperCase() > b.cardname.toUpperCase()) - (b.cardname.toUpperCase() > a.cardname.toUpperCase());
}

function setupGrowthUpgradeSection() {
    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamHeart";
    paramSelect.id = "growthParamHeart";
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

    document.getElementById("growthParamHeartWrapper").appendChild(paramSelect);

    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamTech";
    paramSelect.id = "growthParamTech";
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

    document.getElementById("growthParamTechWrapper").appendChild(paramSelect);

    var paramSelect = document.createElement("select");
    paramSelect.name = "growthParamPhys";
    paramSelect.id = "growthParamPhys";
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

    document.getElementById("growthParamPhysWrapper").appendChild(paramSelect);
}

/*
    Generate the card selector for growth menu
*/
function displayCardsDropdown2(arr) {

    var label = document.createElement("label");
    label.innerHTML = "Select card: ";
    label.htmlFor = "cards";

    var select = document.createElement("select");
    select.name = "growthCards";
    select.id = "growthCards";
    select.classList.add("selectpicker");
    select.setAttribute("data-live-search","true");
    select.setAttribute("data-width","fit");
    select.setAttribute("data-size","10");

    for(let i = 0; i < arr.length; i++) {
        option = document.createElement("option");
        option.value = arr[i].id;
        var rarityText = arr[i].rarity;
        if (rarityText !== "SP") {
            rarityText = rarityText + "★ ";
        } else {
            rarityText = rarityText + " ";
        }

        option.text = rarityText + arr[i].character + ' - ' + arr[i].cardname;
        option.setAttribute("data-tokens", arr[i].type.toLowerCase());
        option.setAttribute("data-content","<img src='../icons/type_" + arr[i].type.toLowerCase() + ".png' width='20' height='20'></img>" + ' ' + option.text);
        select.appendChild(option);
    }

    select.style.paddingLeft = "10px";
    document.getElementById("growthDropdown").appendChild(label);
    document.getElementById("growthDropdown").appendChild(select);
}

// Display card stats in the growth upgrade section
function populateStats(id) {

    var char = cards[id].character.toLowerCase();

    var heart = cards[id].heart;
    var tech = cards[id].technical;
    var phys = cards[id].physical;
    var skill = Math.round(cards[id].skill * 100);

    // populate original stats
    document.getElementById("growthHeartBase").value = heart;
    document.getElementById("growthTechBase").value = tech;
    document.getElementById("growthPhysBase").value = phys;
    document.getElementById("growthSkillBase").value = skill;

    // populate ET
    var et = localEt.get(id) || 0;
    document.getElementById("growthEt").value = et;

    // populate param
    var paramHeart = localParam.get("param_" + char + "_1") || 0;
    var paramTech = localParam.get("param_" + char + "_2") || 0;
    var paramPhys = localParam.get("param_" + char + "_3") || 0;

    document.getElementById("growthParamHeart").value = paramHeart;
    document.getElementById("growthParamTech").value = paramTech;
    document.getElementById("growthParamPhys").value = paramPhys;

    $.refreshGrowthSelects();

    calcGrowthDisp();
}

// Display chart with all Growth-able cards in Growth section
function displayGrowthCardChart(arr) {
    var tbody = document.getElementById("growthChartTbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (let x of arr) {
        var id = x["id"];
        var charRow = tbody.insertRow();
        var rarityText = x["rarity"];
        if (rarityText !== "SP") {
            rarityText = rarityText + "★ ";
        } else {
            rarityText = rarityText + " ";
        }

        charRow.insertCell().appendChild(document.createTextNode(rarityText));

        var image = document.createElement("img");
        image.src = "https://miyu-data.qwewqa.xyz/ondemand/card_icon/" + x["icon"] + ".jpg";
        image.width = 50;
        image.height = 50;
        charRow.insertCell().appendChild(image);
        charRow.insertCell().appendChild(document.createTextNode(x["character"]));
        charRow.insertCell().appendChild(document.createTextNode(x["cardname"]));

        var image = document.createElement("img");
        image.src = "../icons/type_" + x["type"].toLowerCase() + ".png";
        image.width = 30;
        image.height = 30;
        image.alt = x["type"];
        charRow.insertCell().appendChild(image);

        // Original stats
        var heart = cards[id].heart;
        var tech = cards[id].technical;
        var phys = cards[id].physical;
        var totalPower = heart + tech + phys;
        
        // Updated (if available) stats
        var newHeart = localStats.get(id + "_heart") || 0;
        var newTech = localStats.get(id + "_tech") || 0;
        var newPhys = localStats.get(id + "_phys") || 0;
        var newTotalPower = newHeart + newTech + newPhys;

        // If no growthed, just display normal params
        if (newHeart == 0) {
            var paramFocus = "";

            if (heart > tech) {
                if (heart > phys) {
                    paramFocus = "heart";
                } else {
                    paramFocus = "physical";
                }
            } else if (tech > phys) {
                paramFocus = "technical";
            } else {
                paramFocus = "physical";
            }

            var image = document.createElement("img");
            image.src = "../icons/param_" + paramFocus + ".png";
            image.width = 30;
            image.height = 30;
            image.alt = paramFocus;
            charRow.insertCell().appendChild(image);
            charRow.insertCell().appendChild(document.createTextNode(heart));
            charRow.insertCell().appendChild(document.createTextNode(tech));
            charRow.insertCell().appendChild(document.createTextNode(phys));
            charRow.insertCell().appendChild(document.createTextNode(totalPower));

        } else {
            var heartParamDiv = document.createElement("div");
            var span1 = document.createElement("span");
            span1.style.fontWeight = "bold";
            span1.textContent = newHeart;
            if (newHeart > heart) {
                span1.style.color = "blue";
            } else {
                span1.style.color = "red";
            }
            heartParamDiv.appendChild(span1);
    
            var div2 = document.createElement("div");
            div2.style.fontSize = "small";
            div2.textContent = heart;
            heartParamDiv.appendChild(div2);
    
            var techParamDiv = document.createElement("div");
            var span1 = document.createElement("span");
            span1.style.fontWeight = "bold";
            span1.textContent = newTech;
            if (newTech > tech) {
                span1.style.color = "blue";
            } else {
                span1.style.color = "red";
            }
            techParamDiv.appendChild(span1);
    
            var div2 = document.createElement("div");
            div2.style.fontSize = "small";
            div2.textContent = tech;
            techParamDiv.appendChild(div2);
    
            var physParamDiv = document.createElement("div");
            var span1 = document.createElement("span");
            span1.style.fontWeight = "bold";
            span1.textContent = newPhys;
            if (newPhys > phys) {
                span1.style.color = "blue";
            } else {
                span1.style.color = "red";
            }
            physParamDiv.appendChild(span1);
    
            var div2 = document.createElement("div");
            div2.style.fontSize = "small";
            div2.textContent = phys;
            physParamDiv.appendChild(div2);
            
            var powerParamDiv = document.createElement("div");
            var span1 = document.createElement("span");
            span1.style.fontWeight = "bold";
            span1.textContent = newTotalPower + " (+" + parseInt(newTotalPower - totalPower) + ")";
            powerParamDiv.appendChild(span1);
    
            var div2 = document.createElement("div");
            div2.style.fontSize = "small";
            div2.textContent = totalPower;
            powerParamDiv.appendChild(div2);

            var paramFocus = "";

            if (newHeart > newTech) {
                if (newHeart > newPhys) {
                    paramFocus = "heart";
                } else {
                    paramFocus = "physical";
                }
            } else if (newTech > newPhys) {
                paramFocus = "technical";
            } else {
                paramFocus = "physical";
            }

            var image = document.createElement("img");
            image.src = "../icons/param_" + paramFocus + ".png";
            image.width = 30;
            image.height = 30;
            image.alt = paramFocus;
            charRow.insertCell().appendChild(image);
            charRow.insertCell().appendChild(heartParamDiv);
            charRow.insertCell().appendChild(techParamDiv);
            charRow.insertCell().appendChild(physParamDiv);
            charRow.insertCell().appendChild(powerParamDiv);
        }

        charRow.insertCell().appendChild(document.createTextNode(Math.round(parseFloat(x["skill"]) * 100)));
    }
}

// recalculate growth value when changing ET or param
function calcGrowthDisp() {

    var id = document.getElementById("growthCards").value;
    var et = document.getElementById("growthEt").value;
    var heart = cards[id].heart;
    var tech = cards[id].technical;
    var phys = cards[id].physical;
    var skill = cards[id].skill;
    var paramHeart = document.getElementById("growthParamHeart").value;
    var paramTech = document.getElementById("growthParamTech").value;
    var paramPhys = document.getElementById("growthParamPhys").value;

    // populate new stats (with mods)
    var tempHeart = localStats.get(id + "_heart");
    if (tempHeart) {
        heart = parseInt(tempHeart);
    }
    var tempTech = localStats.get(id + "_tech");
    if (tempTech) {
        tech = parseInt(tempTech);
    }
    var tempPhys = localStats.get(id + "_phys");
    if (tempPhys) {
        phys = parseInt(tempPhys);
    }
    var tempSkill = localStats.get(id + "_skill");
    if (tempSkill) {
        skill = parseFloat(tempSkill);
    }

    // show base (modified) card stats still
    document.getElementById("growthHeartBase2").innerHTML = heart;
    document.getElementById("growthTechBase2").innerHTML = tech;
    document.getElementById("growthPhysBase2").innerHTML = phys;

    var heartMod = 0;
    var techMod = 0;
    var physMod = 0;

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
            heartMod += etVal;
        } else {
            physMod += etVal;
        }
    } else if (tech > phys) {
        techMod += etVal;
    } else {
        physMod += etVal;
    }
    
    var heartParamPerc = parseFloat(paramHeart) / 100;
    heartMod += Math.floor((heart + heartMod) * heartParamPerc);
    var techParamPerc = parseFloat(paramTech) / 100;
    techMod += Math.floor((tech + techMod) * techParamPerc);
    var physParamPerc = parseFloat(paramPhys) / 100;
    physMod += Math.floor((phys + physMod) * physParamPerc);

    document.getElementById("growthHeartNew").value = heart + heartMod;
    document.getElementById("growthTechNew").value = tech + techMod;
    document.getElementById("growthPhysNew").value = phys + physMod;
    document.getElementById("growthSkillNew").value = Math.round(skill * 100);
}