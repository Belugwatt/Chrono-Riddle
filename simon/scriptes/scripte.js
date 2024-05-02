son = document.querySelectorAll("audio");
    son.forEach(element => {
        element.volume = 0.2;
    });
    


    //          //            //             //        gestion lyre            //          //          //


    var tailleCorde =7;
    // Points de contrôle pour la courbe de Bézier quadratique
    var positionX = 300;
    var startY = 164;
    var endY = 750;
    var espace = 138;

    var amplitudeMax = 32;
    var vitesseDiminution = 0.25;

    var Lnotes=["song/note1.mp3","song/note2.mp3","song/note3.mp3","song/note4.mp3","song/note5.mp3"];
    var tempsN = 0;

    class canvas{
                constructor(id){
                    this.canvas = document.querySelector("#"+id);
                    this.ctx = this.canvas.getContext("2d");
                    this.elements = [];
                    this.melo = [];
                    this.meloJoueur = [];
                    this.jouer = false;
                    this.x = 1.4;

                    this.H = 700;
                    this.W = window.innerWidth;
                    
                    this.scaleX = this.W / 768 /2.5; // 768 est la largeur de référence
                    this.scaleY = this.W / 576 /2.8; // 576 est la hauteur de référence

                    this.xOffset = -(165); //pour décaler la lyre
                    this.yOffset = 4;
                    

                    this.canvas.addEventListener("click", this.gererClic.bind(this));

                    if (this.W <= 780) {this.x = 1;}
                    else {this.x = 1.4;}

                    this.canvas.height = this.H;
                    this.canvas.width = this.W/this.x;

                    window.requestAnimationFrame(()=> this.afficher());

                    window.addEventListener("resize", ()=> {
                        this.H = 700;
                        this.W = window.innerWidth;

                        this.scaleX = this.W / 768 /2.5; // 768 est la largeur de référence
                        this.scaleY = this.W / 576 /2.8; // 576 est la hauteur de référence

                        this.xOffset = -(165);
                        this.yOffset = 4;

                        if (this.W <= 780) {this.x = 1;}
                        else {this.x = 1.4;}

                        this.canvas.height = this.H;
                        this.canvas.width = this.W/this.x;
                        
                    })
                }

                afficher(){
                    this.ctx.clearRect(0,0,this.W*2,this.H);
                    //this.ctx.fillRect(0, 0, this.W*2, this.H);
                    this.render();
                    

                    this.elements.forEach(element => {
                        element.update();
                    });
                    //this.render();

                    window.requestAnimationFrame(()=> this.afficher());
                }

                creatParticule(){
                    for (let i = 0; i < 5; i++) {
                        this.elements.push(new corde(this));
                        espace+=40;
                    }
                }

                gererClic(event) {
                    if (this.jouer) {
                        let x = event.clientX - this.canvas.getBoundingClientRect().left;
                        let y = event.clientY - this.canvas.getBoundingClientRect().top;
                        this.elements.forEach(corde => {
                            if (corde.estClique(x, y)) {
                                corde.amplitude = amplitudeMax;
                                tempsN = 0;
                                corde.controlY=y;
                                corde.codeC = 99;
                                this.meloJoueur.push(corde.posX);
                                this.afficher();
                                                                        //vérifier si joue les bonnes notes
                                if (this.meloJoueur[this.meloJoueur.length-1] != this.melo[this.meloJoueur.length-1]) { //mauvaise note
                                    document.querySelector(".reponse").innerHTML="Wrong note !";
                                    document.querySelector(".reponse").classList.add("err");
                                    this.jouer=false;
                                } else {
                                    if (this.melo.length == this.meloJoueur.length) { //toutes les notes jouées sont bonnes
                                        document.querySelector(".reponse").innerHTML="Congratulations on your success !";
                                        document.querySelector(".lanceMelo").innerHTML="<a href='../index.html'>Skip</a>";
                                        document.querySelector(".reponse").classList.add("win");
                                        setTimeout(() => playSong("song/sf_win.mp3", 1), 650);
                                        this.jouer=false;
                                        // Ajoute l'item au localstorage
                                        localStorage.setItem("lever", true);
                                        // Reset les pages lors du win
                                        localStorage.setItem("chapterNum", 6);
                                        localStorage.setItem("pageNum", 0);
                                        localStorage.setItem("numPage", 0);
                                    }
                                    
                                }

                                switch (corde) { // jouer la bonne note
                                    case this.elements[0]:
                                        this.JoueN(0,"song/note1.mp3");
                                        break;
                                    case this.elements[1]:
                                        this.JoueN(1,"song/note2.mp3");
                                        break;
                                    case this.elements[2]:
                                        this.JoueN(2,"song/note3.mp3");
                                        break;
                                    case this.elements[3]:
                                        this.JoueN(3,"song/note4.mp3");
                                        break;
                                    case this.elements[4]:
                                        this.JoueN(4,"song/note5.mp3");
                                        break;
                                    default:
                                        break;
                                
                                
                            }
                        }});
                    } else {
                        document.querySelector(".reponse").innerHTML="Listen to the melody to play!";
                    }
                }

                render() {
                    let a = this.canvas;
                    let b = this.ctx;

                    if ((this.W) <= 1000) { //définition de la taille de l'instrument en fonction de la taille de l'écran
                        this.scaleX = 0.5; 
                        this.scaleY = 0.6666667;
                    }
                    else{
                        this.scaleX = 0.75; 
                        this.scaleY = 0.90;
                    }
                    
                    b.beginPath();
                    b.moveTo(0,0);
                    b.lineTo(768,0);
                    b.lineTo(768,576);
                    b.lineTo(0,576);
                    b.closePath();
                    b.fillStyle='rgb(145, 65, 49,0)';
                    b.fill('evenodd');
                    b.setTransform(1.33333 * this.scaleX,0,0,1.33333 * this.scaleY,0,0);
                    b.translate(this.xOffset, this.yOffset);
                    b.setTransform(0.81224 * this.scaleX,0,0,0.81224 * this.scaleY,248.07793 * this.scaleX,0);
                    b.translate(this.xOffset, this.yOffset);
                    b.beginPath();
                    b.moveTo(37.68,193.56);
                    b.lineTo(626.67999,193.56);
                    b.lineTo(626.67999,229.56);
                    b.lineTo(37.68,229.56);
                    b.closePath();
                    b.fillStyle='#48240F';
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(649.83002,568.32001);
                    b.bezierCurveTo(610.56,821.97998,440.96002,936.34998,332.97003,923.59998);
                    b.bezierCurveTo(332.78003,923.57996,332.59003,923.57996,332.40002,923.59998);
                    b.bezierCurveTo(224.39001,936.35999,44.79004,821.98999,5.46002,568.31995);
                    b.bezierCurveTo(5.25002,566.97992,6.31002,566.12994,7.42002,565.34998);
                    b.bezierCurveTo(172.67999,448.56,117.68,199.56,119.98,16.88);
                    b.bezierCurveTo(120,15.21,121.87,14.2,123.45,14.72);
                    b.bezierCurveTo(148.42,22.96,193.92001,23.93,205.39001,24.04);
                    b.bezierCurveTo(206.86002,24.05,208.04001,25.27,208.00002,26.74);
                    b.bezierCurveTo(206.06001,105.18,197.00002,420.09998,199.84001,478.09998);
                    b.bezierCurveTo(199.88,478.94998,199.51001,479.74997,198.85001,480.27997);
                    b.bezierCurveTo(106.01001,554.38995,157.03,703.23999,326.89001,696.10999);
                    b.bezierCurveTo(327.14001,696.10999,327.39001,696.08997,327.64001,696.07996);
                    b.bezierCurveTo(327.89001,696.08997,328.14001,696.10999,328.39001,696.10999);
                    b.bezierCurveTo(498.25,703.23999,550.26001,554.39001,457.42999,480.27997);
                    b.bezierCurveTo(456.76999,479.74997,456.39999,478.94998,456.44,478.09998);
                    b.bezierCurveTo(459.28,420.10999,449.22,105.18997,447.28,26.73999);
                    b.bezierCurveTo(447.23999,25.26999,448.42001,24.05999,449.88998,24.03999);
                    b.bezierCurveTo(461.35999,23.92999,506.84998,22.95999,531.82001,14.71999);
                    b.bezierCurveTo(533.41003,14.19999,535.35004,15.20999,535.28998,16.87999);
                    b.bezierCurveTo(529.67999,192.55998,494.67999,456.56,647.85999,565.34998);
                    b.bezierCurveTo(648.96997,566.13995,650.02997,566.97998,649.82001,568.31995);
                    b.lineTo(649.82001,568.31995);
                    b.lineTo(649.83002,568.32001);
                    b.closePath();
                    b.fillStyle='#89512F';
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(456.44,478.10001);
                    b.bezierCurveTo(455.59,478.07001,456.76999,479.75,457.42999,480.28);
                    b.bezierCurveTo(550.26001,554.39001,498.23999,703.23999,328.39001,696.10999);
                    b.bezierCurveTo(328.14001,696.10999,327.89001,696.08997,327.64001,696.07996);
                    b.bezierCurveTo(327.39001,696.08997,327.14001,696.10999,326.89001,696.10999);
                    b.bezierCurveTo(157.02002,703.23999,106.01001,554.39001,198.85002,480.27997);
                    b.bezierCurveTo(199.51003,479.74997,200.59003,477.69998,199.84003,478.09998);
                    b.bezierCurveTo(135.68002,512.56,59.58003,721.56,327.68002,724.56);
                    b.bezierCurveTo(595.68005,727.56,526.68005,514.56,456.44,478.09998);
                    b.lineTo(456.44,478.09998);
                    b.lineTo(456.44,478.10001);
                    b.closePath();
                    b.fillStyle='#7F4829';
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(649.83002,568.32001);
                    b.bezierCurveTo(648.23999,578.56,646.45001,588.57001,644.45001,598.35999);
                    b.bezierCurveTo(572.67999,571.56,477.67999,499.56,531.82001,14.72998);
                    b.bezierCurveTo(533.41003,14.20998,535.35004,15.21998,535.28998,16.88998);
                    b.bezierCurveTo(529.67999,192.56998,494.67999,456.56998,647.85999,565.35992);
                    b.bezierCurveTo(648.96997,566.1499,650.02997,566.98993,649.82001,568.3299);
                    b.lineTo(649.82001,568.3299);
                    b.lineTo(649.83002,568.32001);
                    b.closePath();
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(5.51,568.32001);
                    b.bezierCurveTo(7.1,578.56,8.89,588.57001,10.89,598.35999);
                    b.bezierCurveTo(82.66,571.56,177.66,499.56,123.52,14.72998);
                    b.bezierCurveTo(121.93,14.20998,119.99,15.21998,120.05,16.88998);
                    b.bezierCurveTo(125.66,192.56998,160.66,456.56998,7.48,565.35992);
                    b.bezierCurveTo(6.37,566.1499,5.31,566.98993,5.52,568.3299);
                    b.lineTo(5.52,568.3299);
                    b.lineTo(5.51,568.32001);
                    b.closePath();
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(103.01,3.76);
                    b.bezierCurveTo(101.32,29.6,111.47,39.32,208.79001,31.63);
                    b.bezierCurveTo(211.84001,31.39,214.56001,29.55,215.83,26.78);
                    b.bezierCurveTo(218.88,20.14,218.40001,9.07,216.92,2.35);
                    b.bezierCurveTo(216.62,1.01,215.44,0.06,214.06999,0.04);
                    b.bezierCurveTo(197.79999,-0.21,121.32999,0.78,105.92999,0.98);
                    b.bezierCurveTo(104.37999,1,103.10999,2.21,103.00999,3.75);
                    b.lineTo(103.00999,3.75);
                    b.lineTo(103.01,3.76);
                    b.closePath();
                    b.fillStyle='#321A0C';
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(552.28003,3.76);
                    b.bezierCurveTo(553.97003,29.6,543.82001,39.32,446.50003,31.63);
                    b.bezierCurveTo(443.45004,31.39,440.73004,29.55,439.46002,26.78);
                    b.bezierCurveTo(436.41003,20.14,436.89001,9.07,438.37003,2.35);
                    b.bezierCurveTo(438.67001,1.01,439.85004,0.06,441.22003,0.04);
                    b.bezierCurveTo(457.49002,-0.21,533.96002,0.78,549.36005,0.98);
                    b.bezierCurveTo(550.91003,1,552.18005,2.21,552.28003,3.75);
                    b.lineTo(552.28003,3.75);
                    b.lineTo(552.28003,3.76);
                    b.closePath();
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(13.61,169.56);
                    b.lineTo(29.75,169.56);
                    b.bezierCurveTo(36.34,169.56,41.68,174.89999,41.68,181.48999);
                    b.bezierCurveTo(40.2,204.87,39.86,226.95999,41.68,246.62999);
                    b.bezierCurveTo(41.68,253.21999,36.34,258.56,29.75,258.56);
                    b.lineTo(29.75,258.56);
                    b.lineTo(13.61,258.56);
                    b.bezierCurveTo(7.02,258.56,1.68,253.22,1.68,246.63);
                    b.bezierCurveTo(-0.56,224.92001,-0.56,203.20001,1.68,181.49001);
                    b.bezierCurveTo(1.68,174.90001,7.02,169.56,13.61,169.56);
                    b.closePath();
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(634.07001,166.56);
                    b.lineTo(617.92999,166.56);
                    b.bezierCurveTo(611.33997,166.56,606,171.89999,606,178.48999);
                    b.bezierCurveTo(607.47998,201.87,607.82001,223.95999,606,243.62999);
                    b.bezierCurveTo(606,250.21999,611.34003,255.56,617.92999,255.56);
                    b.lineTo(617.92999,255.56);
                    b.lineTo(634.07001,255.56);
                    b.bezierCurveTo(640.66003,255.56,646,250.22,646,243.63);
                    b.bezierCurveTo(648.23999,221.92001,648.23999,200.20001,646,178.49001);
                    b.bezierCurveTo(646,171.90001,640.65997,166.56,634.07001,166.56);
                    b.closePath();
                    b.fill('nonzero');
                    b.beginPath();
                    b.moveTo(420.32999,940.54999);
                    b.bezierCurveTo(361.56998,947.19,302.79999,947.19,244.03999,940.54999);
                    b.bezierCurveTo(230.73999,939.04999,220.68999,927.82001,220.68999,914.44);
                    b.lineTo(220.68999,914.44);
                    b.lineTo(220.68999,903.12);
                    b.bezierCurveTo(220.68999,898.09998,225.11998,894.23999,230.08998,894.92999);
                    b.bezierCurveTo(298.15997,904.38,366.21997,904.38,434.28998,894.92999);
                    b.bezierCurveTo(439.25998,894.23999,443.68997,898.09998,443.68997,903.12);
                    b.lineTo(443.68997,903.12);
                    b.lineTo(443.68997,914.44);
                    b.bezierCurveTo(443.68997,927.82001,433.62997,939.04999,420.33997,940.54999);
                    b.lineTo(420.33997,940.54999);
                    b.lineTo(420.32999,940.54999);
                    b.closePath();
                    b.fill('nonzero');
                    b.setTransform(0.33333 * this.scaleX,0,0,0.33333 * this.scaleY,0,0);
                    b.translate(this.xOffset, this.yOffset);
                    b.setTransform(1 * this.scaleX,0,0,1 * this.scaleY,0,0);
                    b.translate(this.xOffset+26, this.yOffset);
                    

                }


                JoueMelo(){ //jouer la mélodie à reproduire, et retenir les notes dans la liste melo
                    this.melo = [];
                    for (let i = 0; i < 5; i++) {
                        let n=Math.floor(Math.random() * 5);
                        setTimeout(() => this.JoueNote(n,Lnotes[n]), tempsN);
                        tempsN+=800;
                    }
                    setTimeout(() =>this.jouer=true, tempsN-100);
                    this.meloJoueur = [];
                    setTimeout(() =>document.querySelector(".reponse").innerHTML="Reproduce the melody !", tempsN-100);
                }

                JoueNote(n, src) { 
                    this.elements[n].amplitude = amplitudeMax;
                    this.elements[n].controlY=endY/2;
                    this.elements[n].codeC = 99;
                    playSong(src, 0.2);
                    this.melo.push(this.elements[n].posX);
                }

                JoueN(n, src) {
                    this.elements[n].amplitude = amplitudeMax;
                    this.elements[n].controlY=endY/2;
                    playSong(src, 0.2);
                }

            }

    class corde{

        constructor(parent){
            this.posX = positionX + espace;
            this.parent = parent;
            this.controlX = this.posX;
            this.codeC = 62;
            this.couleur = "#CE89"+this.codeC;
            this.amplitude = 20;
            this.temps = 0;
            this.controlY = endY/2;
            this.ajuste = 215;

        }
        update(){
            
            if (this.amplitude > 0) { //animation des cordes
                this.vibration();
                if (this.codeC>62) {
                    this.codeC-=1;
                }
            }
            else{ this.draw(); }
            
        }

        draw(){
            this.couleur = "#CE89"+this.codeC;
            this.parent.ctx.strokeStyle = this.couleur; // Vous pouvez changer la couleur ici
            this.parent.ctx.lineWidth = tailleCorde;
            this.parent.ctx.lineCap = "round";
            // Dessiner la courbe de Bézier quadratique
            this.parent.ctx.beginPath();
            this.parent.ctx.moveTo(this.posX, startY);
            this.parent.ctx.quadraticCurveTo(this.controlX, this.controlY, this.posX, endY);
            this.parent.ctx.stroke();
            this.parent.ctx.closePath();
            
        }

        vibration() {

            this.temps = new Date().getTime() * 0.012; // Convertir le timestamp en secondes
            this.controlX = this.posX + this.amplitude * Math.sin(this.temps); // Oscillation sinusoïdale
            this.draw();

            // Diminuer progressivement l'amplitude
            this.amplitude -= vitesseDiminution;

            // Réinitialiser l'amplitude à 0 si elle devient négative
            this.amplitude = Math.max(this.amplitude, 0);
        }

        estClique(x, y) {
                switch (this) {  //définition d'une variable d'ajustement, présent pour ajuster la valeur de x par rapport au modification faites avec les scales et les offsets sur l'instrument
                    case lecanvas.elements[0]:
                        if ((lecanvas.W) <= 1000) {this.ajuste = 282;}
                        else{this.ajuste = 208;}
                        break;
                    case lecanvas.elements[1]:
                        if ((lecanvas.W) <= 1000) {this.ajuste = 297;}
                        else{this.ajuste = 223;}
                        break;
                    case lecanvas.elements[2]:
                        if ((lecanvas.W) <= 1000) {this.ajuste = 325;}
                        else{this.ajuste = 233;}
                        break;
                    case lecanvas.elements[3]:
                        if ((lecanvas.W) <= 1000) {this.ajuste = 342;}
                        else{this.ajuste = 243;}
                        break;
                    case lecanvas.elements[4]:
                        if ((lecanvas.W) <= 1000) {this.ajuste = 357;}
                        else{this.ajuste = 248;}
                        break;
                    default:
                        break;
                };
            let vx= ((x+this.ajuste+tailleCorde)*lecanvas.scaleX)+lecanvas.xOffset;
            return vx > ((this.posX-tailleCorde)*lecanvas.scaleX)+lecanvas.xOffset && vx < ((this.posX + tailleCorde)*lecanvas.scaleX)+lecanvas.xOffset && y+38 > ((startY)*lecanvas.scaleY)+lecanvas.yOffset && y+38 < ((endY)*lecanvas.scaleY)+lecanvas.yOffset;
            //vérifie si là où on click, nous sommes sur une des cordes
        }
    }

    let lecanvas = new canvas("myCanvas");
    lecanvas.creatParticule();

    document.querySelector(".lanceMelo").addEventListener("click", () => {
        lecanvas.JoueMelo();
        document.querySelector(".reponse").classList.remove("err");
    });

    function playSong(src, vol) {
        var newAudio = new Audio(src);
        newAudio.volume = vol; // Définir le volume
        newAudio.play();
    }

/*
    
*/
function skip() {
    alert("You skipped the puzzle");
    // Ajoute l'item au localstorage
    document.querySelector(".lanceMelo").innerHTML="<a href='index.html'>Skip</a>";
    localStorage.setItem("lever", true);
    // Reset les pages lors du win
    localStorage.setItem("chapterNum", 6);
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
    localStorage.setItem("locNum", 3);
}

