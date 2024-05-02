class Obstacle {
    /***********************************************************************/
    /**                  Constructeur de la classe                        **/
    /***********************************************************************/
    constructor(x, y, width, height, speed, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.type = type;
        this.frameX = 0;
        this.frameY = 0;
        this.random = Math.floor(Math.random() * 30 + 30);
        this.typeVoiture = (Math.floor(Math.random() * nombreVoiture))
    }

    /***********************************************************************/
    /**                       Dessine les obstacles                       **/
    /***********************************************************************/
    draw() {
        switch (this.type) {
            case "tortue":
                if (frame % this.random === 0) {
                    if (this.frameX >= 1) {
                        this.frameX = 0;
                    }
                    else {
                        this.frameX++;
                    }
                }
                ctx1.drawImage(turtle, this.frameX * 70, this.frameY * 70, 70, 70, this.x, this.y, this.width, this.height);
                break;
            case "car":
                ctx2.drawImage(voiture, this.frameX * this.width, this.typeVoiture * this.height, grid * 2, grid, this.x, this.y, this.width, this.height);
                break;
            case "log":
                ctx1.drawImage(rondin, this.x, this.y, this.width, this.height);
                break;
        }

        //ctx3.fillStyle = "blue";
        //ctx3.fillRect(this.x, this.y, this.width, this.height);
    }

    /***********************************************************************/
    /**                  Anime les obstacles du jeu                       **/
    /***********************************************************************/
    update() {
        this.x += this.speed * vitesseJeu;

        // Si l'obstacle dépasse le canvas, ramène au point de spawn
        if (this.speed > 0) {
            // Si la vitesse est positive, on a ramène au début du canvas
            if (this.x > canvas.width + this.width) {
                this.x = 0 - this.width;
                this.typeVoiture = (Math.floor(Math.random() * nombreVoiture));
            }
        }
        else {
            this.frameX = 1;
            // Si la vitesse est négative, alors on retourne à la fin du canvas
            if (this.x < 0 - this.width) {
                this.x = canvas.width + this.width;
                this.typeVoiture = (Math.floor(Math.random() * nombreVoiture));
            }
        }


    }
}

/***********************************************************************/
/**      Initialisation des obstacles et de leur comportement         **/
/***********************************************************************/

function init_obstacles() {
    // Ligne 1
    for (let i = 0; i < 2; i++) {
        let x = i * 350;
        voituresArray.push(new Obstacle(x, canvas.height - grid * 2 - 20, grid * 2, grid, 1, 'car'));
    }
    // Ligne 2, direction opposée à la ligne 1
    for (let i = 0; i < 2; i++) {
        let x = i * 300;
        voituresArray.push(new Obstacle(x, canvas.height - grid * 3 - 20, grid * 2, grid, -2, 'car'));
    }
    // Ligne 3
    for (let i = 0; i < 2; i++) {
        let x = i * 400;
        voituresArray.push(new Obstacle(x, canvas.height - grid * 4 - 20, grid * 2, grid, 1, 'car'));
    }
    // Ligne 4, éléments flottants dans la rivière
    for (let i = 0; i < 2; i++) {
        let x = i * 500;
        rondinArray.push(new Obstacle(x, canvas.height - grid * 5 - 20, grid * 2, grid, -2, 'log'));
    }
    // Ligne 5, tortues
    for (let i = 0; i < 3; i++) {
        let x = i * 200;
        rondinArray.push(new Obstacle(x, canvas.height - grid * 6 - 20, grid, grid, 1, 'tortue'))
    }
}

init_obstacles();

function handleObstacles() {
    // Dessin des voitures
    for (let i = 0; i < voituresArray.length; i++) {
        voituresArray[i].update();
        voituresArray[i].draw();
    }
    // Dessin des rondins de bois dans l'eau
    for (let i = 0; i < rondinArray.length; i++) {
        rondinArray[i].update();
        rondinArray[i].draw();
    }
    // Collisions avec les voitures et les camions
    for (let i = 0; i < voituresArray.length; i++) {
        if (collision(frogger, voituresArray[i])) {
            ctx4.drawImage(collisions, 0, 100, 100, 100, frogger.x, frogger.y, 50, 50);
            resetGame();
        }
    }
    // Collisions avec les rondins et les tortues 
    if(frogger.y < 250 && frogger.y > 100){
        safe = false;
        for (let i = 0; i < rondinArray.length; i++){
            if (collision(frogger, rondinArray[i])){
                frogger.x += rondinArray[i].speed;
                safe = true;
            }
        }
        if (!safe){
            resetGame();
        }
    }
}