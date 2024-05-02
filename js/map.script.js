// Récupère le numéro de la localisation de l'utilisateur
var locationNumber = localStorage.getItem("locNum");

// Si il n'est pas présent dans le local storage :
if (locationNumber === null) {
    localStorage.setItem("locNum", 1); // Va à la localisation du parc
}

// A utiliser une fois qu'on est arrivé à la localisation
// Pour l'instant je met ça comme ça pour faciliter mon travail sur le reste de l'histoire, Ludo, si jamais, met l'appel à la fonction dans un if


// Quand l'utilisateur arrive à la localisation de l'épreuve suivante
function arrived() {
    switch (locationNumber) {
        case "2":
            localStorage.setItem("chapterNum", 4); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 2);
            break;
        case "3": {
            localStorage.setItem("chapterNum", 7); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 3);
            // Faire ça une fois que le temps sera venu
            break;
        }
    }
}

// Reset les chapitres
function resetChapter() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
}

arrived();