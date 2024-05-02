
//Partie mini-jeu

// Fonction pour générer une matrice de nbr*nbr random
function generateMatrixRandom(nbr) {
    const symbols = ['│', '─', '🔲', '🔲', '🔲', '🔲', '┘', '└', '┐', '┌'];
    return Array.from({ length: nbr }, () => Array.from({ length: nbr }, () => symbols[Math.floor(Math.random() * symbols.length)]));
}

// Fonction pour vérifier si une position est valide dans la matrice et n'a pas été visitée
function isValidPosition(x, y, visitedPositions, nbr) {
    return x >= 0 && x < nbr && y >= 0 && y < nbr && !visitedPositions.has(`${x},${y}`);
}

// Fonction pour générer un chemin aléatoire dans la matrice
function generateRandomPath(nbr) {
    const directions = ['⬆️', '➡️', '⬅️', '⬇️']; // Haut, Droite, Gauche, Bas

    let path = []; //stock chemin
    let currentX = 0;
    let currentY = 0;
    let visitedPositions = new Set(); // Ensemble des positions visitées

    // Choisir aléatoirement le début du chemin (DD ou DB)
    const startDirection = Math.random() < 0.5 ? 'DD' : 'DB';
    visitedPositions.add(`${currentX},${currentY}`); // Ajouter la position de départ aux positions visitées    
    if (startDirection === 'DD') {
        currentX++;
    } else {
        currentY++;
    }
    path.push(startDirection);
    //Crée un chemin depuis la case départ
    while (true) {
        let direction;
        do {
            direction = directions[Math.floor(Math.random() * directions.length)]; // Choisir une direction aléatoire
        } while (!isValidPosition(currentX, currentY, visitedPositions, nbr)); // Continuer à choisir une direction jusqu'à ce qu'elle soit valide

        // Ajouter la nouvelle position aux positions visitées
        visitedPositions.add(`${currentX},${currentY}`);

        path.push(direction);

        // Mettre à jour les coordonnées en fonction de la direction choisie
        if (direction === '⬆️') currentY--;
        else if (direction === '➡️') currentX++;
        else if (direction === '⬅️') currentX--;
        else if (direction === '⬇️') currentY++;
        if (!isValidPosition(currentX, currentY, visitedPositions, nbr)) break;

    }
    //Remplace le dernier case du chemin par une case fin
    path[path.length - 1] = '🏁';

    //On relance si le chemin est trop court => ça permet d'avoir un matrix un peu plus "dur"
    if (path.length < 15) {
        return generateRandomPath(nbr);
    }
    else {
        return path;
    }
}

// Fonction pour mettre à jour la matrice avec les rotations
function updateMatrixWithPath(matrix, path) {
    let currentX = 0;
    let currentY = 0;

    path.forEach((direction, index) => {
        matrix[currentY][currentX] = direction;

        // Vérifier s'il s'agit d'une direction autre que le début du chemin
        if (index > 0) {
            const prevDirection = path[index - 1];
            let corner;
            //On identifie si le chemin change de direction, on le remplace par un coin
            if ((prevDirection === 'DB' && direction === '➡️' || prevDirection === '⬅️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '➡️')) {
                corner = '└';
            } else if ((prevDirection === '⬆️' && direction === '➡️') || (prevDirection === '⬅️' && direction === '⬇️')) {
                corner = '┌';
            } else if ((prevDirection === 'DD' && direction === '⬇️') || (prevDirection === '➡️' && direction === '⬇️') || (prevDirection === '⬆️' && direction === '⬅️')) {
                corner = '┐';
            } else if ((prevDirection === '➡️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '⬅️')) {
                corner = '┘';
            } else if (direction === '➡️' || direction === '⬅️') {
                matrix[currentY][currentX] = "─";
            } else if (direction === '⬆️' || direction === '⬇️') {
                matrix[currentY][currentX] = "│";
            }
            //On identifie par quelle côté on doit rejoindre la case fin
            else if (direction == '🏁') {
                switch (prevDirection) {
                    case '➡️':
                        matrix[currentY][currentX] = "G🏁";
                        break;

                    case '⬇️':
                        matrix[currentY][currentX] = "H🏁";
                        break;

                    case '⬅️':
                        matrix[currentY][currentX] = "D🏁";
                        break;

                    case '⬆️':
                        matrix[currentY][currentX] = "B🏁";
                        break;
                }
            }

            if (corner) {
                matrix[currentY][currentX] = corner;
            }
        }
        //On se déplace dans le matrix
        if (direction === 'DD') currentX++;
        else if (direction === 'DB') currentY++;
        else if (direction === '⬆️') currentY--;
        else if (direction === '➡️') currentX++;
        else if (direction === '⬅️') currentX--;
        else if (direction === '⬇️') currentY++;
    });

    // Appliquer des rotations aléatoire sur chaque cellule

    matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== 'G🏁' &&
                cell !== 'H🏁' &&
                cell !== 'D🏁' &&
                cell !== 'B🏁' &&
                cell !== 'DD' &&
                cell !== 'DB' &&
                cell != '🔲') {
                matrix[rowIndex][colIndex] = rotateCell(cell);
            }
        });
    });

    return matrix;
}

// Fonction pour gérer le clic sur une case
function handleClick(x, y) {
    let currentValue = matrixWithPath[y][x];
    if (currentValue === 'H🏁' ||
        currentValue === 'B🏁' ||
        currentValue === 'G🏁' ||
        currentValue === 'D🏁' ||
        currentValue === 'DD' ||
        currentValue === 'DB' ||
        currentValue === '🔲') {
        return;
    }
    let newValue = rotateCell(currentValue, false);
    matrixWithPath[y][x] = newValue;
    updateMatrixDisplay();
    if (findPath(matrixWithPath) == true) {

        // Ajoute l'item au localstorage
        localStorage.setItem("pipe", true);
        // Reset les pages lors du win
        localStorage.setItem("chapterNum", 9);
        localStorage.setItem("pageNum", 0);
        localStorage.setItem("numPage", 0);

        afficherModal(win);
    }

}


// Fonction pour mettre à jour l'affichage de la matrice
function updateMatrixDisplay() {
    let html = '';
    let nbrligne = matrixWithPath.length;

    document.querySelector('#resultat').style.gridTemplateColumns = 'repeat(' + nbrligne + ', 50px)';
    document.querySelector('#resultat').style.gridTemplateRows = 'repeat(' + nbrligne + ', 50px)';

    matrixWithPath.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {

            let img = '';
            switch (cell) {
                case '│':
                    img = '<img src="pipe/img/svg/droit.svg" loading="lazy"  width="50" height="50" alt="droit"></img>';
                    break;
                case '─':
                    img = '<img src="pipe/img/svg/droit.svg" loading="lazy" width="50" height="50" style="transform: rotate(90deg);" alt="droit">'
                    break;
                case '┌':
                    img = '<img src="pipe/img/svg/angle.svg" loading="lazy" width="50" height="50" style="transform: rotate(-270deg);" alt="angle">';
                    break;
                case '└':
                    img = '<img src="pipe/img/svg/angle.svg" loading="lazy" width="50" height="50" alt="angle">';
                    break;
                case '┘':
                    img = '<img src="pipe/img/svg/angle.svg" loading="lazy" width="50" height="50" style="transform: rotate(-90deg);" alt="angle">';
                    break;
                case '┐':
                    img = '<img src="pipe/img/svg/angle.svg"  loading="lazy" width="50" height="50" style="transform: rotate(-180deg);" alt="angle">';
                    break;
                case 'DD':
                    img = '<img src="pipe/img/svg/debut.svg"  loading="lazy" width="50" height="50" alt="angle">';
                    break;
                case 'DB':
                    img = '<img src="pipe/img/svg/debut.svg" loading="lazy" width="50" height="50" style="transform: rotate(90deg);" alt="angle">';
                    break;
                case 'H🏁':
                    img = '<img src="pipe/img/svg/fin.svg" loading="lazy" width="50" height="50" style="transform: rotate(-90deg);" alt="angle">';
                    break;
                case 'D🏁':
                    img = '<img src="pipe/img/svg/fin.svg" loading="lazy" width="50" height="50" alt="angle">';
                    break;
                case 'B🏁':
                    img = '<img src="pipe/img/svg/fin.svg"  loading="lazy" width="50" height="50" style="transform: rotate(-270deg);" alt="angle">';
                    break;
                case 'G🏁':
                    img = '<img src="pipe/img/svg/fin.svg" loading="lazy" width="50" height="50" style="transform: rotate(-180deg);" alt="angle">';
                    break;

            }

            if (img == '') {
                html += `<div></div>`;
            }
            else {
                html += `<div><span onclick="handleClick(${colIndex}, ${rowIndex})" data-value = '${cell}'>${img}</span></div>`;
            }



        });
    });
    document.querySelector("#resultat").innerHTML = html;
}

// Fonction pour effectuer une rotation aléatoire ou fixe sur une cellule
function rotateCell(cell, random = true) {
    const rotations = random ? Math.floor(Math.random() * 4) : 1;
    let rotatedCell = cell;
    for (let i = 0; i < rotations; i++) {
        switch (rotatedCell) {
            case '│':
                rotatedCell = '─';
                break;
            case '─':
                rotatedCell = '│';
                break;
            case '┌':
                rotatedCell = '└';
                break;
            case '└':
                rotatedCell = '┘';
                break;
            case '┘':
                rotatedCell = '┐';
                break;
            case '┐':
                rotatedCell = '┌';
                break;
            default:
                rotatedCell = cell;
        }
    }
    return rotatedCell;
}


// Fonction findPath mise à jour pour tenir compte des flèches et des cases vides
function findPath(matrix) {
    const end = { x: -1, y: -1 };
    const start = { x: -1, y: -1 };
    const moves = { 'down': { x: 0, y: 1 }, 'up': { x: 0, y: -1 }, 'right': { x: 1, y: 0 }, 'left': { x: -1, y: 0 } };
    const directions = {
        'DD': 'right',
        'DB': 'down',
        '│': ['up', 'down'],
        '─': ['left', 'right'],
        '┌': ['down', 'right'],
        '┐': ['down', 'left'],
        '└': ['up', 'right'],
        '┘': ['up', 'left']
    };

    // Trouver les points de départ et de fin
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 'G🏁' ||
                matrix[i][j] === 'H🏁' ||
                matrix[i][j] === 'D🏁' ||
                matrix[i][j] === 'B🏁'
            ) {
                end.x = j;
                end.y = i;
            } else if (matrix[i][j] === 'DD' || matrix[i][j] === 'DB') {
                start.x = j;
                start.y = i;
            }
        }
    }

    // Si les points de départ ou de fin ne sont pas trouvés, retourner false
    if (end.x === -1 || end.y === -1 || start.x === -1 || start.y === -1) {
        return false;
    }

    let current = { x: start.x, y: start.y };
    let prevDirection = [];



    while (true) {
        // Vérifier si le mouvement est à l'intérieur des limites de la matrice
        if (current.x < 0 || current.x > matrix[0].length - 1 || current.y < 0 || current.y > matrix.length - 1) {
            return false;
        }
        //Check si on repasse pas sur case déjà use dans le chemin
        if (prevDirection.some(coord => coord[0] === current.y && coord[1] === current.x)) {
            return false
        }
        else prevDirection.push([current.y, current.x]);

        direction = matrix[current.y][current.x];

        //Cas départ
        if (direction == 'DD' || direction == 'DB') {
            move = moves[directions[direction]];
            current.x += move.x;
            current.y += move.y;

            continue;
        }
        //Autre cas
        let tabPrev = prevDirection[prevDirection.length - 2]
        //Si la direction est un angle
        switch (direction) {

            case "│":
                if (current.y < tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][0]];
                } else if (current.y > tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][1]]
                }
                else return false;

                break;

            case "─":
                if (current.y == tabPrev[0] && current.x < tabPrev[1]) {
                    move = moves[directions[direction][0]];
                } else if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    move = moves[directions[direction][1]]
                }
                else return false;

                break;

            case "➡️":
                if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    move = moves[directions[direction]];
                }
                else return false;
                break;

            case "⬅️":
                if (current.y == tabPrev[0] && current.x < tabPrev[1]) {
                    move = moves[directions[direction]];
                }
                else return false;
                break;
            case '┌':
                if (current.y < tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][1]];
                }
                else if (current.y == tabPrev[0] && current.x < tabPrev[1]) {
                    move = moves[directions[direction][0]];
                }
                else return false;
                break;

            case '┐':
                if (current.y < tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][1]];
                }
                else if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    move = moves[directions[direction][0]];
                }
                else return false;
                break;

            case '└':
                if (current.y > tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][1]];
                }
                else if (current.y == tabPrev[0] && current.x < tabPrev[1]) {
                    move = moves[directions[direction][0]];
                }
                else return false;
                break;

            case '┘':
                if (current.y > tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction][1]];
                }
                else if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    move = moves[directions[direction][0]];
                }
                else return false;
                break;

            case '🔲':
                return false;

            case "H🏁":
                if (current.y > tabPrev[0] && current.x == tabPrev[1]) {
                    return true;
                }
                else return false;

            case "D🏁":
                if (current.y == tabPrev[0] && current.x < tabPrev[1]) {
                    return true;
                }
                else return false;

            case "B🏁":
                if (current.y < tabPrev[0] && current.x == tabPrev[1]) {
                    return true;
                }
                else
                    return false;

            case "G🏁":
                if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    return true;
                }
                else return false;

            default:
                return 'erreur';

        }
        current.x += move.x;
        current.y += move.y;
    }
}

//Générer une matrice aléatoire
const randomMatrix = generateMatrixRandom(7);

// Générer la matrice
const path = generateRandomPath(7);

// Mettre à jour la matrice avec le chemin et les rotations
const matrixWithPath = updateMatrixWithPath(randomMatrix, path);

// Appeler la fonction pour afficher la matrice initiale
updateMatrixDisplay();

//Fin script mini-jeux

//script pop up


var win = document.getElementById("win");
var skip = document.getElementById("skip");

// Obtenez le bouton pour fermer le modal
var span = document.getElementsByClassName("close")[0];

// Lorsque l'utilisateur clique sur <span> (x), fermez le modal
span.onclick = function () {
    skip.style.opacity = "0";
    setTimeout(function () {
        modal.style.display = "none";
    }, 300); // Attendez 0.3 seconde pour que l'animation se termine avant de masquer le modal complètement
}

// Lorsque l'utilisateur clique n'importe où en dehors du modal, fermez-le
window.onclick = function (event) {
    if (event.target == skip) {
        skip.style.opacity = "0";
        setTimeout(function () {
            skip.style.display = "none";
        }, 300); // Attendez 0.3 seconde pour que l'animation se termine avant de masquer le modal complètement
    }
}

// Fonction pour afficher le modal avec une animation d'opacité
function afficherModal(modal) {
    modal.style.display = "block";
    setTimeout(function () {
        modal.style.opacity = "1";
    }, 10); // Attendez 10 millisecondes pour que l'élément soit d'abord affiché avant d'appliquer l'animation
}

document.querySelector("#no").addEventListener("click", close);

document.querySelector("#yes").addEventListener("click", laissez_passer_A);

function close() {
    skip.style.opacity = "0";
    setTimeout(function () {
        skip.style.display = "none";
    }, 300); // Attendez 0.3 seconde pour que l'animation se termine avant de masquer le modal complètement
}

function laissez_passer_A() {
    console.log('pourte');

    // Ajoute l'item au localstorage
    localStorage.setItem("pipe", true);
    // Reset les pages lors du win
    localStorage.setItem("chapterNum", 9);
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);

    window.location.href = '../index.html';

}