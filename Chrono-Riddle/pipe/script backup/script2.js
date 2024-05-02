// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrix() {
    return Array.from({ length: 5 }, () => Array(5).fill('🔲'));
}


// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrixRandom() {
    const symbols = ['⬆️', '➡️', '⬅️', '⬇️', '┘', '└', '┐', '┌'];
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



// Fonction pour mettre à jour la matrice avec le chemin
function updateMatrixWithPath(matrix, path) {
    let currentX = 0;
    let currentY = 0;

    path.forEach((direction, index) => {
        matrix[currentY][currentX] = direction;




        // Vérifier s'il s'agit d'une direction autre que le début du chemin
        if (index > 0) {
            const prevDirection = path[index - 1];

            // Déterminer l'angle correspondant en fonction des deux directions
            let corner;
            if ((prevDirection ==='DB' && direction ==='➡️' || prevDirection === '⬅️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '➡️')) {
                corner = '└';
            } else if ((prevDirection === '⬆️' && direction === '➡️') || (prevDirection === '⬅️' && direction === '⬇️')) {
                corner = '┌';
            } else if ((prevDirection ==='DD' && direction ==='⬇️' || prevDirection === '➡️' && direction === '⬇️') || (prevDirection === '⬅️' && direction === '⬆️')) {
                corner = '┐';
            } else if ((prevDirection === '➡️' && direction === '⬆️') || (prevDirection === '⬇️' && direction === '⬅️')) {
                corner = '┘';
            }

            // Si un angle a été déterminé, mettre à jour la case correspondante
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


    //La matrix propose un chemin fonctionnel, maintenant on replace les flèches qui change de direction par des angles ┘└ ┐┌



    return matrix;
}

//Générer une matrice aléatoire
const randomMatrix = generateMatrixRandom();
// Générer la matrice
const matrix = generateMatrix();
// Générer le chemin
const path = generateRandomPath();
// Mettre à jour la matrice avec le chemin
const matrixWithPath = updateMatrixWithPath(randomMatrix, path);

// Pour voir uniquement le chemin soluce généré par le code :
// const matrixWithPath = updateMatrixWithPath(matrix, path);

console.log(path);
console.log(matrixWithPath);


document.querySelector("#resultat").innerHTML =
    `<div>${matrixWithPath[0]}</div><br>
<div>${matrixWithPath[1]}</div><br>
<div>${matrixWithPath[2]}</div><br>
<div>${matrixWithPath[3]}</div><br>
<div>${matrixWithPath[4]}</div><br>
<div>Le chemin : ${path}</div>`;

