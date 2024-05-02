/***********************************************************************/
/**              Fonction d'animation du jeu entier                   **/
/***********************************************************************/

function animate() {
    ctx1.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx2.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx4.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx5.clearRect(0, 0, canvas3.width, canvas3.height);

    ctx2.drawImage(bg1, 0, 0, canvas.width, canvas.height);

    // Particules de déplacement
    handleParticles();

    // Grenouille
    frogger.draw();
    frogger.update();

    // Obstacles
    handleObstacles();

    handleScore();

    ctx4.drawImage(herbe, 0, 0, canvas.width, canvas.height);
    frame++;
    requestAnimationFrame(animate);
}

animate();

/***********************************************************************/
/**                        Event Listener                             **/
/***********************************************************************/

// On récupère tous les boutons ayant la classe ".but"
const pad = document.querySelectorAll(".but");

// Pour tous les boutons ayant la classe ".but", on ajoute un event listener de click qui nous fera appeler la méthode frogger.jump()

for (let i = 0; i <= 3; i++) {

    // Quand le bouton est pressé

    if (device == "mobile" || device == "tablet") {
        pad[i].addEventListener("touchstart", function (e) {

            keys = [];
            var keyu = this.id;
            keys[keyu] = true;

            if (this.id == "up" || this.id == "down" || this.id == "left" || this.id == "right") {
                frogger.jump();
            }
        }
        )

        // Quand le bouton est relaché
        pad[i].addEventListener("touchend", function (e) {
            delete keys[this.id];
            frogger.moving = false;
            frogger.frameX = 0;
        })
    }

    else if (device == "desktop") {
        pad[i].addEventListener("click", function (e) {
            keys = [];
            var keyu = this.id;
            keys[keyu] = true;

            if (this.id == "up" || this.id == "down" || this.id == "left" || this.id == "right") {
                frogger.jump();
            }
        })

        pad[i].addEventListener("mouseup", function (e) {
            delete keys[this.id];
            frogger.moving = false;
            frogger.frameX = 0;
        })
    }
    // Pour le pc

}

/***********************************************************************/
/**                          Item récupéré                            **/
/***********************************************************************/

function retrieved() {
    cogwheel = true;
    win.style.display = "block";
    // Cache le pad de controle
    control.style.display = "none";

    // Ajoute l'item au localstorage
    localStorage.setItem("cogwheel", cogwheel);
    // Reset les pages lors du win
    localStorage.setItem("chapterNum", 3);
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
    localStorage.setItem("locNum", 2);
}


function scored() {
    score++;
    vitesseJeu += 0.3;
    frogger.x = canvas.width / 2 - frogger.width / 2;
    frogger.y = canvas.height - frogger.height - 40;
    if (score == 3) {
        retrieved();
    }
}

// Montre le score obtenu par le joueur
// Pour des raisons de temps, au bout de 3 points, le joueur aura gagné
function handleScore() {
    ctx4.fillStyle = 'white';
    ctx4.strokeStyle = 'white';
    ctx4.font = '15px Verdana';
    ctx4.fillText('Score', 265, 15);

    ctx4.fillStyle = "white"
    ctx4.font = '60px Verdana';
    ctx4.fillText(score + "/3", 240, 65);
}

// Collision entre deux objet a été détectée : 
function collision(first, second) {
    return !(first.x > second.width + second.x ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y);
}

// Si le joueur a touché un obstacle / est tombé dans l'eau
function resetGame() {
    frogger.x = canvas.width / 2 - frogger.width / 2;
    frogger.y = canvas.height - frogger.height - 40;
    vitesseJeu = 1;
}


var freddyx = document.querySelector(".mascote");
freddyx.style.display = "block";
function skip() {
    alert("You skipped the game");
    score = 3;
    freddyx.style.display = "none";
    retrieved();
}