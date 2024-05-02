class Frogger {

    /***********************************************************************/
    /** Méthode constructeur de la classe.                                **/
    /** Définition des variables utilisées dans la classe                 **/
    /***********************************************************************/

    constructor() {
        this.largSprite = 250;
        this.hautSprite = 250;
        this.width = this.largSprite / 5;
        this.height = this.hautSprite / 5;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 40;
        this.bouge = false;
        this.frameX = 0;
        this.frameY = 0;
    }

    /***********************************************************************/
    /** Méthode d'update de la classe.                                    **/
    /** Méthode permettant de mettre à jour les différentes frames        **/
    /***********************************************************************/
    update() {
        if (keys["up"]) {
            if (this.moving === false) {
                this.y -= grid;
                this.moving = true;
                this.frameY = 0;
            }
        }
        if (keys["down"]) {
            if (this.y < canvas.height - this.height * 2 && this.moving === false) {
                this.y += grid;
                this.moving = true;

                this.frameY = 3;
            }
        }
        if (keys["left"]) {
            if (this.x > this.width && this.moving === false) {
                this.x -= grid;
                this.moving = true;

                this.frameY = 2;
            }
        }
        if (keys["right"]) {
            if (this.x < canvas.width - this.width * 2 && this.moving === false) {
                this.x += grid;
                this.moving = true;

                this.frameY = 1;
            }
        }
        // Si le joueur a atteint le bout du canvas sans se faire écraser, 
        // alors il a gagné, la pièce sera récupérée et l'aventure continue
        if (this.y < 0) {
            scored();
        }
    }

    /***********************************************************************/
    /** Méthode draw de la classe.                                        **/
    /** Méthode permettant de dessiner le canvas                          **/
    /***********************************************************************/

    draw() {
        ctx3.drawImage(frog_sprite, this.frameX * this.largSprite, this.frameY * this.hautSprite, this.largSprite, this.hautSprite, this.x - 38, this.y - 30, this.width * 2.5, this.height * 2.5);
    }

    jump() {
        if (this.moving === false){
            this.frameX = 1
        }
        else if (this.frameX === 1){
            this.frame = 0;
        }
    }
}

// Frogger étant l'élément que le joueur utilise : est RGB-B / Freddix
const frogger = new Frogger();
