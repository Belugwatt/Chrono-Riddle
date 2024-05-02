// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrix() {
    return Array.from({ length: 5 }, () => Array(5).fill('🔲'));
}

// Fonction pour générer une matrice 5x5 random
function generateMatrixRandom() {
    const symbols = ['⬆️', '➡️', '⬅️', '⬇️', '🔲', '🔲', '🔲', '🔲', '┘', '└', '┐', '┌'];
    return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => symbols[Math.floor(Math.random() * symbols.length)]));
}

// Fonction pour vérifier si une position est valide dans la matrice et n'a pas été visitée
function isValidPosition(x, y, visitedPositions) {
    return x >= 0 && x < 5 && y >= 0 && y < 5 && !visitedPositions.has(`${x},${y}`);
}

// Fonction pour générer un chemin aléatoire dans la matrice
function generateRandomPath() {
    const directions = ['⬆️', '➡️', '⬅️', '⬇️']; // Haut, Droite, Gauche, Bas

    let path = [];
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

    while (true) {
        let direction;
        do {
            direction = directions[Math.floor(Math.random() * directions.length)]; // Choisir une direction aléatoire
        } while (!isValidPosition(currentX, currentY, visitedPositions)); // Continuer à choisir une direction jusqu'à ce qu'elle soit valide

        // Ajouter la nouvelle position aux positions visitées
        visitedPositions.add(`${currentX},${currentY}`);

        path.push(direction);

        // Mettre à jour les coordonnées en fonction de la direction choisie
        if (direction === '⬆️') currentY--;
        else if (direction === '➡️') currentX++;
        else if (direction === '⬅️') currentX--;
        else if (direction === '⬇️') currentY++;

        if (!isValidPosition(currentX, currentY, visitedPositions)) break;
    }

    path[path.length - 1] = '🏁';

    if (path.length < 10) {
        return generateRandomPath();
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
            if ((prevDirection === 'DB' && direction === '➡️' || prevDirection === '⬅️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '➡️')) {
                corner = '└';
            } else if ((prevDirection === '⬆️' && direction === '➡️') || (prevDirection === '⬅️' && direction === '⬇️')) {
                corner = '┌';
            } else if ((prevDirection === 'DD' && direction === '⬇️') || (prevDirection === '➡️' && direction === '⬇️') || (prevDirection === '⬆️' && direction === '⬅️')) {
                corner = '┐';
            } else if ((prevDirection === '➡️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '⬅️')) {
                corner = '┘';
            } else if (direction == '🏁') {
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

        if (direction === 'DD') currentX++;
        else if (direction === 'DB') currentY++;
        else if (direction === '⬆️') currentY--;
        else if (direction === '➡️') currentX++;
        else if (direction === '⬅️') currentX--;
        else if (direction === '⬇️') currentY++;
    });

    // Appliquer les rotations sur chaque cellule

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
    if (currentValue === '🏁' || currentValue === 'DD' || currentValue === 'DB' || currentValue === '🔲') {
        return;
    }
    let newValue = rotateCell(currentValue, false);
    matrixWithPath[y][x] = newValue;
    updateMatrixDisplay();
    if (findPath(matrixWithPath) == true) {
        console.log('win');
    }

}


// Fonction pour mettre à jour l'affichage de la matrice
function updateMatrixDisplay() {
    let html = '';
    matrixWithPath.forEach((row, rowIndex) => {
        html += '<div>';
        row.forEach((cell, colIndex) => {
            if (cell === 'G🏁' ||
                cell === 'H🏁' ||
                cell === 'D🏁' ||
                cell === 'B🏁' ||
                cell === 'DD' ||
                cell === 'DB') {
                html += `<span>${cell}</span>`;
            } else {
                html += `<span onclick="handleClick(${colIndex}, ${rowIndex})">${cell}</span>`;
            }
        });
        html += '</div><br>';
    });
    document.querySelector("#resultat").innerHTML = html;
}

// Fonction pour effectuer une rotation aléatoire ou fixe sur une cellule
function rotateCell(cell, random = true) {
    const rotations = random ? Math.floor(Math.random() * 4) : 1;
    let rotatedCell = cell;
    for (let i = 0; i < rotations; i++) {
        switch (rotatedCell) {
            case '⬆️':
                rotatedCell = '➡️';
                break;
            case '➡️':
                rotatedCell = '⬇️';
                break;
            case '⬇️':
                rotatedCell = '⬅️';
                break;
            case '⬅️':
                rotatedCell = '⬆️';
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


//Générer une matrice aléatoire
const randomMatrix = generateMatrixRandom();

// Générer la matrice
const path = generateRandomPath();
console.log(path);
// Mettre à jour la matrice avec le chemin et les rotations
const matrixWithPath = updateMatrixWithPath(randomMatrix, path);
// Appeler la fonction pour afficher la matrice initiale
updateMatrixDisplay();


// Fonction findPath mise à jour pour tenir compte des flèches et des cases vides
function findPath(matrix) {
    const end = { x: -1, y: -1 };
    const start = { x: -1, y: -1 };
    const moves = { 'down': { x: 0, y: 1 }, 'up': { x: 0, y: -1 }, 'right': { x: 1, y: 0 }, 'left': { x: -1, y: 0 } };
    const directions = {
        'DD': 'right',
        'DB': 'down',
        '⬆️': 'up',
        '➡️': 'right',
        '⬅️': 'left',
        '⬇️': 'down',
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
        if (current.x < 0 || current.x > matrix[0].length-1 || current.y < 0 || current.y > matrix.length-1) {
            return false;
        }

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

            case "⬆️":
                if (current.y < tabPrev[0] && current.x == tabPrev[1]) {
                    move = moves[directions[direction]];
                }
                else return false;
                break;

            case "➡️":
                if (current.y == tabPrev[0] && current.x > tabPrev[1]) {
                    move = moves[directions[direction]];
                }
                else return false;
                break;

            case "⬇️":
                if (current.y > tabPrev[0] && current.x == tabPrev[1]) {
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

            default :
                return 'erreur';

        }
        current.x += move.x;
        current.y += move.y;
    }
}


// Exemple d'utilisation
const matrix1 = [
    ['DB', 'B🏁', '└', '➡️', '⬆️'],
    ['┐', '┘', '⬅️', '🔲', '⬇️'],
    ['┌', '┐', '🔲', '🔲', '🔲'],
    ['🔲', '┐', '🔲', '┘', '┐'],
    ['🔲', '┘', '┌', '⬆️', '🔲']
];

const matrix2 = [
    ['DB', 'B🏁', '└', '➡️', '⬆️'],
    ['└', '┘', '⬅️', '🔲', '⬇️'],
    ['┌', '┐', '🔲', '🔲', '🔲'],
    ['🔲', '┐', '🔲', '┘', '┐'],
    ['🔲', '┘', '┌', '⬆️', '🔲']
];

const matrix3 = [
    ['DD', '➡️', '➡️', '➡️', '┐'],
    ['└', '┘', '⬅️', '🔲', 'H🏁'],
    ['┌', '┐', '🔲', '🔲', '🔲'],
    ['🔲', '┐', '🔲', '┘', '┐'],
    ['🔲', '┘', '┌', '⬆️', '🔲']
];

const matrix4 = [
    ['DB', '⬇️', '🔲', '🔲', 'B🏁'],
    ['🔲', '⬅️', '⬇️', '⬇️', '┘'],
    ['┘', '🔲', '🔲', '🔲', '┌'],
    ['└', '┌', '⬇️', '┘', '⬆️'],
    ['⬆️', '🔲', '🔲', '⬆️', '🔲']
]

const matrix5 = [
    ['DB', '⬇️', '🔲', '🔲', 'B🏁'],
    ['└', '➡️', '➡️', '➡️', '┘'],
    ['┘', '🔲', '🔲', '🔲', '┌'],
    ['└', '┌', '⬇️', '┘', '⬆️'],
    ['⬆️', '🔲', '🔲', '⬆️', '🔲']
]

const matrix6 = [
    ['DB', '🔲', '└', '┌', '🔲'],
    ['└', '➡️', '┐', '┌', '🔲'],
    ['D🏁', '⬅️', '┘', '🔲', '┌'],
    ['🔲', '┌', '⬅️', '⬅️', '🔲'],
    ['🔲', '➡️', '┘', '└', '⬅️']
]

// console.log(findPath(matrix1)); // Renvoie true s'il existe un chemin entre le début et la fin
// console.log(findPath(matrix2));
// console.log(findPath(matrix3));
// console.log(findPath(matrix4));
// console.log(findPath(matrix6));


