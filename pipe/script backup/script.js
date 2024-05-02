// Fonction pour générer une matrice 5x5 remplie de zéros
function generateMatrix() {
    return Array.from({ length: 5 }, () => Array(5).fill('🔲'));
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

        if (path[path.length - 1] == 'DB' || path[path.length - 1] == 'DD') {
            //situation début
            path.push(direction);

            // Mettre à jour les coordonnées en fonction de la direction choisie
            if (direction === '⬆️') currentY--;
            else if (direction === '➡️') currentX++;
            else if (direction === '⬅️') currentX--;
            else if (direction === '⬇️') currentY++;

        }
        else {

            //Situation arpès le début
            if (path[path.length - 1] == direction) {
                //situation si on change pas de direction
                path.push(direction);


                // Mettre à jour les coordonnées en fonction de la direction choisie
                if (direction === '⬆️') currentY--;
                else if (direction === '➡️') currentX++;
                else if (direction === '⬅️') currentX--;
                else if (direction === '⬇️') currentY++;

                else {
                    console.log('Erreur de direction');
                }


            }

            else {
                //situation où il y a/avait une rotation
                if (path[path.length - 1] == '⬆️' ||
                    path[path.length - 1] == '➡️' ||
                    path[path.length - 1] == '⬇️' ||
                    path[path.length - 1] == '⬅️') {

                    //situation où la case avant c'est une direction
                    switch (direction) {
                        case '⬆️':
                            switch (path[path.length - 1]) {

                                case '➡️':
                                    path.push('┘');
                                    currentY--;
                                    break;

                                case '⬇️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '⬅️':
                                    path.push('└');
                                    currentY--;
                                    break;
                            }

                        case '➡️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    path.push('┌');
                                    currentX++;
                                    break;

                                case '⬇️':
                                    path.push('└');
                                    currentX++;
                                    break;

                                case '⬅️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();
                            }

                        case '⬇️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '➡️':
                                    path.push('┐');
                                    currentY++;
                                    break;

                                case '⬅️':
                                    path.push('┌');
                                    currentY++;
                                    break;

                            }

                        case '⬅️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    path.push('┐');
                                    currentX--;
                                    break;

                                case '➡️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '⬇️':
                                    path.push('┘');
                                    currentX--;
                                    break;
                            }
                    }
                }
                else {
                    //situation où la case précédent est une case angle
                    switch (direction) {
                        case '⬆️':
                            switch (path[path.length - 1]) {

                                case '┘':
                                    path.push('┘');
                                    currentY--;
                                    break;

                                case '└':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '┌':
                                    path.push('└');
                                    currentY--;
                                    break;

                                case '┐':
                                    path.push('└');
                                    currentY--;
                                    break;
                            }

                        case '➡️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    path.push('┌');
                                    currentX++;
                                    break;

                                case '⬇️':
                                    path.push('└');
                                    currentX++;
                                    break;

                                case '⬅️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();
                            }

                        case '⬇️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '➡️':
                                    path.push('┐');
                                    currentY++;
                                    break;

                                case '⬅️':
                                    path.push('┌');
                                    currentY++;
                                    break;

                            }

                        case '⬅️':
                            switch (path[path.length - 1]) {

                                case '⬆️':
                                    path.push('┐');
                                    currentX--;
                                    break;

                                case '➡️':
                                    //cas impossible, on relance la génération
                                    return generateRandomPath();

                                case '⬇️':
                                    path.push('┘');
                                    currentX--;
                                    break;
                            }
                    }
                }



                console.log('On tourne', path);
            }
        }
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

    path.forEach(direction => {
        matrix[currentY][currentX] = direction;
        if (direction === 'DD') currentX++;
        else if (direction === 'DB') currentY++;
        else if (direction === '⬆️') currentY--;
        else if (direction === '➡️') currentX++;
        else if (direction === '⬅️') currentX--;
        else if (direction === '⬇️') currentY++;
        //it false bro
        else if (direction === '┌') currentX++;
        else if (direction === '┐') currentY++;
        else if (direction === '┘') currentY--;
        else if (direction === '┘') currentX--;
    });

    return matrix;
}

// Générer la matrice
const matrix = generateMatrix();
// Générer le chemin
const path = generateRandomPath();
// Mettre à jour la matrice avec le chemin
const matrixWithPath = updateMatrixWithPath(matrix, path);
console.log(path);
console.log(matrixWithPath);

document.querySelector("#resultat").innerHTML =
    `<div>${matrixWithPath[0]}</div><br>
<div>${matrixWithPath[1]}</div><br>
<div>${matrixWithPath[2]}</div><br>
<div>${matrixWithPath[3]}</div><br>
<div>${matrixWithPath[4]}</div><br>
<div>Le chemin : ${path}</div>`;

