class Particule {
    /***********************************************************************/
    /**                  Constructeur de la classe                        **/
    /***********************************************************************/
    constructor(x, y) {
        this.x = x + 25;
        this.y = y + 25;
        this.radius = Math.random() * 20 + 1;
        this.opacite = 0.5;
        this.directionX = Math.random() * 1 - 0.5;
        this.directionY = Math.random() * 1 - 0.5;
    }

    /***********************************************************************/
    /**               Dessine des particules de poussière                 **/
    /***********************************************************************/

    draw() {
        ctx3.fillStyle = 'rgba(150,150,150,' + this.opacite + ')';
        ctx3.beginPath();
        ctx3.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx3.fill();
        ctx3.closePath();
    }

    /***********************************************************************/
    /**              Anime les particules de poussière                    **/
    /***********************************************************************/

    update() {
        this.x += this.directionX;
        this.y += this.directionY;
        if (this.opacite > 0.1) {
            this.opacite -= 0.09;
        }
        if (this.radius > 0.15) {
            this.radius -= 0.14;
        }
    }
}

/***********************************************************************/
/**                    Génère les particules                          **/
/***********************************************************************/

function handleParticles() {
    // Particules de poussière
    for (let i = 0; i < arrayParticules.length; i++) {
        arrayParticules[i].update();
        arrayParticules[i].draw();
    }

    // Enlève la dernière particule du tableau, car une fois rempli, plus aucune particule ne sera générée
    if (arrayParticules.length > maxParticules) {
        for (let i = 0; i < 20; i++) {
            arrayParticules.pop();
        }
    }


    const pad = document.querySelectorAll(".but");
    // Pour tous les boutons ayant la classe ".but", on ajoute un event listener de click qui créera des particules
    for (let i = 0; i <= 3; i++) {

        if (device == "tablet" || device == "mobile") {
            // Ne fait apparaitre les particules qu'à la fin du mouvement, donc quand le bouton est relaché
            pad[i].addEventListener("touchend", function (e) {
                keys = [];
                var keyu = this.id;
                keys[keyu] = true;
                // Pour les particules de poussière
                if (this.id == "up" || this.id == "down" || this.id == "left" || this.id == "right") {
                    if (frogger.y > 250 && arrayParticules.length < maxParticules + 10) {
                        for (let i = 0; i < 10; i++) {
                            arrayParticules.unshift(new Particule(frogger.x, frogger.y));
                        }
                    }
                }
            })
        }

        else if (device == "desktop") {
            pad[i].addEventListener("mouseup", function (e) {
                keys = [];
                var keyu = this.id;
                keys[keyu] = true;
                // Pour les particules de poussière
                if (this.id == "up" || this.id == "down" || this.id == "left" || this.id == "right") {
                    if (frogger.y > 250 && arrayParticules.length < maxParticules + 10) {
                        for (let i = 0; i < 10; i++) {
                            arrayParticules.unshift(new Particule(frogger.x, frogger.y));
                        }
                    }
                }
            })
        }

    }
}