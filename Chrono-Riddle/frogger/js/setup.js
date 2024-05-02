/***********************************************************************/
/**                            Canvas                                 **/
/***********************************************************************/

// Canvas 1
const canvas = document.getElementById("canvas1");
const ctx1 = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

// Canvas 2
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = 600;
canvas2.height = 600;

// Canvas 3
const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d");
canvas3.width = 600;
canvas3.height = 600;

// Canvas 4
const canvas4 = document.getElementById("canvas4");
const ctx4 = canvas4.getContext("2d");
canvas4.width = 600;
canvas4.height = 600;

// Canvas 5
const canvas5 = document.getElementById("canvas5");
const ctx5 = canvas5.getContext("2d");
canvas5.width = 600;
canvas5.height = 600;

/***********************************************************************/
/**                      Variables globales                           **/
/***********************************************************************/

const grid = 80;
let keys = [];
let score = 0;
let frame = 0;
let vitesseJeu = 1;
var safe = false;

const arrayParticules = [];
const maxParticules = 30;
const voituresArray = [];
const rondinArray = [];

var device;
function getDevice() {
    const ua = navigator.userAgent;

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        device = "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        device = "mobile";
    }
    else {
        device = "desktop";
    }
    return device;
}

getDevice()


/***********************************************************************/
/**                            Rouage                                 **/
/***********************************************************************/
// Variable du rouage, sera utile pour garder une trace
var cogwheel = false;
// Initialement FALSE
localStorage.setItem("cogwheel", cogwheel);


/***********************************************************************/
/**                         Divs d'event                              **/
/***********************************************************************/

// Boutons de déplacement
// Montré tant que le joueur n'a pas gagné
const control = document.querySelector(".controleur");
control.style.display = "block";

// Bouton de win 
// Caché tant que le joueur n'aura pas atteint l'autre côté
const win = document.querySelector(".bravo")
win.style.display = "none";

/***********************************************************************/
/**                             Images                                **/
/***********************************************************************/

const bg1 = new Image();
bg1.src = "frogger/img/background_lvl2.webp";

const herbe = new Image();
herbe.src = "frogger/img/grass.webp";

const collisions = new Image();
collisions.src = "frogger/img/collisions.webp";

const turtle = new Image();
turtle.src = "frogger/img/turtles.webp";

const rondin = new Image();
rondin.src = "frogger/img/log.webp";

const voiture = new Image();
voiture.src = "frogger/img/cars.webp";
let nombreVoiture = 3;

const frog_sprite = new Image();
frog_sprite.src = "frogger/img/frog_spritesheet.webp";