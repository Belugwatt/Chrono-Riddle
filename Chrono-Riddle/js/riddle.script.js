const riddle_data = "game_data/data_riddle.json";

// Récupère le numéro de l'énigme dans le localstorage
var loc_riddle = localStorage.getItem("riddle_nb");

// Si la variable est inexistante : 
if (loc_riddle === null) {
    localStorage.setItem("riddle_nb", "R1");
}

// Boutons vers la suite du jeu
const tochap2 = document.querySelector(".tochap2");
const help = document.querySelector(".help");

tochap2.style.display = "none";


var enigme = "";

// Fetch
async function recupData() {
    const resp = await fetch(riddle_data);
    json = await resp.json();

    var loc_riddles = localStorage.getItem("riddle_nb");


    // Vérifie quelle énigme
    switch (loc_riddles) {
        case "R1":
            enigme = "R1";
            break;
        case "R2":
            enigme = "R2";
            break;
        case "R3":
            enigme = "R3";
            break;
    }

    insertRiddle(json, enigme);

    return json, enigme;
}

// Ajoute l'énoncé de l'énigme dans le body

function insertRiddle(json, enigme) {
    const riddle = document.querySelector(".riddle");
    riddle.innerHTML = json[enigme].Riddle;
}

const wrong = document.querySelector(".wrong");

// Quand l'utilisateur appuie sur le bouton
document.querySelector(".valid").addEventListener("click", function () {
    const input = document.querySelector('.answer');
    var juste = false;
    var loc_riddles = localStorage.getItem("riddle_nb");

    // Récupère la valeur mise dans l'input
    const answer = input.value.trim().toLowerCase();
    // Vérifie dans le tableau des données si la réponse est la bonne
    for (let i = 0; i < Object.values(json[enigme].Answers).length; i++) {
        if (json[enigme].Answers[i].trim().toLowerCase() === answer) {
            juste = true; // Si la réponse est juste
            localStorage.setItem("Riddle" + enigme, true);
            if (localStorage.getItem("Riddle" + enigme) == "true") {
                document.querySelector(".valid").style.display = "none";
            }
        }
    }

    // Si la réponse est fausse
    if (juste === false) {
        wrong.innerText = "Try Again"
    }
    else {
        // Si c'est juste, on passe au chapitre suivant
        switch (loc_riddles) {
            case "R1":
                resetChapter();
                localStorage.setItem("chapterNum", 2);
                tochap2.style.display = "block";
                help.style.display = 'none';
                break;
            case "R2":
                resetChapter();
                localStorage.setItem("riddle_nb", "R3")
                localStorage.setItem("chapterNum", 5);
                tochap2.style.display = "block";
                help.style.display = 'none';
                break;
            case "R3":
                resetChapter();
                localStorage.setItem("chapterNum", 8);
                tochap2.style.display = "block";
                help.style.display = 'none';
                break;

        }
    }

})

recupData();

// Reset les pages des chapitres
function resetChapter() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
}


var freddyx = document.querySelector(".mascote");
freddyx.style.display = "block";

function skip() {
    alert("You skipped the puzzle");
    freddyx.style.display = "none";
    document.querySelector(".valid").style.display = "none";

    juste = true;
    localStorage.setItem("Riddle" + enigme, true);
    var loc_riddles = localStorage.getItem("riddle_nb");

    switch (loc_riddles) {
        case "R1":
            resetChapter();
            localStorage.setItem("chapterNum", 2);
            tochap2.style.display = "block";
            break;
        case "R2":
            resetChapter();
            localStorage.setItem("riddle_nb", "R3")
            localStorage.setItem("chapterNum", 5);
            tochap2.style.display = "block";
            break;
        case "R3":
            resetChapter();
            localStorage.setItem("chapterNum", 8);
            tochap2.style.display = "block";
            break;

    }
}