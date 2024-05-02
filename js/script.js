const vnData = 'game_data/game_data.json';


// Créé le HTML et insère dans la page
function insertHTML() {
    return `
        <div id='mainbox'>
			<div id='spritebox' class='rightalign'>
				<img src=''>
			</div>
			<div id='namebox'>
					<span>Loading...</span>
			</div>
			<div id='textbox'>
				<p>Loading...</p>
				<div id='optionsbox'></div>
			</div>
		</div>
    `
}


const htmlData = insertHTML();
document.getElementById('VisualNovelEngine').insertAdjacentHTML("beforebegin", htmlData);


// Créé les constantes bassées sur le HTML créé
const $textbox = document.querySelector("#textbox p");
const $optionsbox = document.querySelector('#optionsbox');
const $namebox = document.querySelector("#namebox span");
const $nb = document.querySelector("#namebox");
const $spritebox = document.querySelector("#spritebox img");
const $mainbox = document.querySelector('#mainbox');

let json, to;

var locationNumber = localStorage.getItem("locNum");

if (locationNumber === null) {
    localStorage.setItem("locNum", 1); // Va à la localisation du parc
}


// Traque le numéro de page sur lequel l'utilisateur est

var currentPage;

if (localStorage.getItem("pageNum") === null) {
    localStorage.setItem("pageNum", 0);
}

if (localStorage.getItem("numPage") === null) {
    localStorage.setItem("numPage", 0);
    pageNum = 0;
}
else {
    pageNum = localStorage.getItem("numPage");
}

if (localStorage.getItem("chapterNum") === null) {
    localStorage.setItem("chapterNum", 1);
}

var chapter = "Chapter" + localStorage.getItem("chapterNum");

// Récupérer le type de device
var device;
function getDevice() {
    const ua = navigator.userAgent;

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        device = "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        device = "mobile";
    }
    else {
        device = "desktop";
    }
    return device;
}

getDevice()



async function recupData() {
    // Charge les données du sereur

    const resp = await fetch(vnData)

    // Met les données dans un array
    json = await resp.json();

    if (localStorage.getItem("pageNum") === null) {
        currentPage = Object.keys(json[chapter].PAGES)[pageNum];
    }
    else {
        currentPage = Object.keys(json[chapter].PAGES)[localStorage.getItem("pageNum")]
    }


    // Initialise les données
    initialize(json);
    handleOptions(json);
    setRiddle();

}

// Initialise les données
async function initialize(data) {

    //Efface tout
    $spritebox.src = '';
    $namebox.innerText = '';
    $textbox.innerHTML = '';


    //Change le HTML des éléments sur lesquels on change des trucs

    $spritebox.src = data.Characters[data[chapter].PAGES[currentPage].Character][data[chapter].PAGES[currentPage].Sprite];
    $spritebox.loading = "lazy";
    $spritebox.alt = "sprite";


    if (data[chapter].PAGES[currentPage].Character != "Narrator") {
        $nb.style.display = "block";
        $namebox.innerText = data[chapter].PAGES[currentPage].Character;
    }
    else {
        $nb.style.display = "none";
    }


    $textbox.innerHTML = (data[chapter].PAGES[currentPage].PageText);

    $mainbox.style.backgroundImage = "url(" + data[chapter].Background + ")";

}

function handleOptions(data) {

    //Efface les options
    $optionsbox.innerHTML = "";

    if (data[chapter].PAGES[currentPage].hasOwnProperty('Options')) {
        var o = data[chapter].PAGES[currentPage].Options;
        var str = Object.keys(o).forEach(k => {
            const row = document.createElement('div');
            row.innerHTML = `${k}`
            $optionsbox.appendChild(row);
            row.addEventListener('click', () => {
                currentPage = (o[k]);
                pageNum = Object.keys(json[chapter].PAGES).indexOf(currentPage);
                initialize(json);
                $optionsbox.innerHTML = "";
            })

        })
    }


}


function verifPage(data) {

    switch (data[chapter].PAGES[currentPage].NextPage) {
        case "End":
            return false;
    }

    if (data[chapter].PAGES[currentPage].hasOwnProperty('Options')) return false; // Bloque les messages suivants quand choix est présent
    if (data[chapter].PAGES[currentPage].hasOwnProperty('NextPage')) {

        switch (data[chapter].PAGES[currentPage].NextPage) {
            case "End":
                return false;
        }
    }

    return true;
}


// Change les pages quand l'utilisateur touche l'écran 
document.addEventListener('click', (e) => {
    pnum = localStorage.getItem("pageNum");

    if (!json) return;
    if (verifPage(json)) {

        if (json[chapter].PAGES[currentPage].hasOwnProperty('NextPage')) {
            currentPage = json[chapter].PAGES[currentPage].NextPage;
            switch (json[chapter].PAGES[currentPage].NextPage) {
                case "End":
                    return false;
            }
        }
        else {
            pageNum++;
            localStorage.setItem("numPage", pageNum);
            localStorage.setItem("pageNum", pageNum);
            currentPage = Object.keys(json[chapter].PAGES)[localStorage.getItem("pageNum")];
        }

        initialize(json);
        handleOptions(json);
    }
    else return;

})


//Fetch les données venant du serveur (ça risque de poser problème avec le PWA non?)
recupData();


function setRiddle() {
    if (localStorage.getItem("RiddleR1") === "true" && localStorage.getItem("RiddleR2") === null) {
        localStorage.setItem("riddle_nb", "R2");
    }
    else if (localStorage.getItem("RiddleR2") === "true" && localStorage.getItem("RiddleR1") === "true") {
        localStorage.setItem("riddle_nb", "R3");
    }
}

// Choix dans l'histoire qui nécessitent de reload la page (changement de fond)
function waiting_for_richard() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
    localStorage.setItem("chapterNum", 10);
    location.reload();
}

function turn_around() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
    localStorage.setItem("chapterNum", 11);
    location.reload();
}

function epilogue() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
    localStorage.setItem("chapterNum", 12);
    location.reload();
}


// Change le numéro de chapitre dans le nom de l'onglet

function chapter_num() {
    var chapitre = localStorage.getItem("chapterNum");
    const titre_ong = document.querySelector("title");
    titre_ong.innerText = "Chrono Riddle : Chapter " + chapitre
}

chapter_num();