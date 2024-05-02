// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrix() {
    return Array.from({ length: 5 }, () => Array(5).fill('🔲'));
}

// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrixRandom() {
    const symbols = ['⬆️', '➡️', '⬅️', '⬇️', '🔲', '🔲', '🔲', '🔲', '┘', '└', '┐', '┌'];
    return Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => symbols[Math.floor(Math.random() * symbols.length)]));
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

    if (path.length < 5) {
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
            if ((prevDirection ==='DB' && direction ==='➡️' || prevDirection === '⬅️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '➡️')) {
                corner = '└';
            } else if ((prevDirection === '⬆️' && direction === '➡️') || (prevDirection === '⬅️' && direction === '⬇️')) {
                corner = '┌';
            } else if ((prevDirection ==='DD' && direction ==='⬇️' || prevDirection === '➡️' && direction === '⬇️') || (prevDirection === '⬅️' && direction === '⬆️')) {
                corner = '┐';
            } else if ((prevDirection === '➡️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '⬅️')) {
                corner = '┘';
            } else if (direction == '🏁'){
                switch (prevDirection){
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
    if (currentValue === '🏁' || currentValue === 'DD' || currentValue === 'DB' || currentValue==='🔲' ) {
        return;
    }
    let newValue = rotateCell(currentValue, false);
    matrixWithPath[y][x] = newValue;
    updateMatrixDisplay();
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
console.log(matrixWithPath) ;
// Appeler la fonction pour afficher la matrice initiale
updateMatrixDisplay();


function findPath(matrix) {
    const end = { x: -1, y: -1 };
    const start = { x: -1, y: -1 };
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
    const moves = { 'down': { x: 0, y: 1 }, 'up': { x: 0, y: -1 }, 'right': { x: 1, y: 0 }, 'left': { x: -1, y: 0 } };

    // Find the start and end points
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === '🏁') {
                end.x = j;
                end.y = i;
            } else if (matrix[i][j] === 'DD' || matrix[i][j] === 'DB') {
                start.x = j;
                start.y = i;
            }
        }
    }

    console.log(start,end);

    // If start or end points not found, return false
    if (end.x === -1 || end.y === -1 || start.x === -1 || start.y === -1) {
        return false;
    }

    let current = { x: start.x, y: start.y, direction: directions[matrix[start.y][start.x]],};

    while (true) {
        const move = moves[current.direction];
        current.x += move.x;
        current.y += move.y;
        console.log(current);
        // Check if we have reached the end
        if (current.x === end.x && current.y === end.y) {
            return true;
        }

        // Check if the move is within the matrix boundaries
        if (current.x < 0 || current.x > matrix.length || current.y < 0 || current.y > matrix[current.x].length) {
            return false;
        }
        
        // Check if the next move is valid (no change in direction for consecutive moves)
        const nextDirectionSymbol = matrix[current.y][current.x];
        

        const nextDirection = Array.isArray(directions[nextDirectionSymbol]) ? 
            chooseDirection(directions[nextDirectionSymbol], current.direction) : 
            directions[nextDirectionSymbol];

        console.log(nextDirectionSymbol,nextDirection);

        if (!nextDirection) {
            // Unknown direction symbol, cannot proceed
            return false;
        }


        current.direction = nextDirection;
        console.log('fin boucle')
    }
}

function chooseDirection(possibleDirections, currentDirection) {
    // Check if the current direction is one of the possible directions at the corner
    if (possibleDirections.includes(currentDirection)) {
        // If yes, continue in the current direction
        return currentDirection;
    } else {
        // Otherwise, choose the other direction
        return possibleDirections.find(direction => direction !== currentDirection);
    }
}

// Exemple d'utilisation
const matrix1 = [
    ['DB', '🏁', '└', '➡️', '⬆️'],
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

console.log(findPath(matrix1)); // Renvoie true s'il existe un chemin entre le début et la fin
// console.log(findPath(matrix2));
// console.log(findPath(matrix3));