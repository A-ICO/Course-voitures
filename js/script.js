// Constructeur pour les voitures
function Voiture(x, y, imgId) {
    this.x = x;
    this.y = y;
    this.imgId = imgId;
    this.intervalId = null;
    this.dessiner();
}

// Méthode pour dessiner la voiture
Voiture.prototype.dessiner = function () {
    $(this.imgId).css({ left: this.x + "px", bottom: this.y + "px" });
};

// Méthode pour déplacer la voiture vers la gauche
Voiture.prototype.deplacerAGauche = function (distance) {
    this.x -= distance;
    if (this.x <= 0) this.x = 0; // Empêche la voiture de sortir de l'écran à gauche

    const trackWidth = $("#track").width(); // Largeur dynamique de la piste
    if (this.x > trackWidth) {
        this.x = trackWidth; // Empêche la voiture de sortir à droite
    }

    this.dessiner();
};

// Méthode pour réinitialiser la position de la voiture
Voiture.prototype.reinitialiser = function () {
    this.x = 1220; // Position de départ
    this.dessiner();
};

// Initialisation des voitures
var car1 = new Voiture(1220, 250, "#car1");
var car2 = new Voiture(1220, 40, "#car2");

let isRaceOn = false;
let countdownInterval = null;
let confettiInstance = null; // Variable pour gérer les confettis

// Fonction pour démarrer la course
function startRace() {
    isRaceOn = true;
    car1.intervalId = setInterval(() => {
        car1.deplacerAGauche(Math.floor(Math.random() * 15));
        checkWinner(car1, "Car 1");
    }, 1);

    car2.intervalId = setInterval(() => {
        car2.deplacerAGauche(Math.floor(Math.random() * 15));
        checkWinner(car2, "Car 2");
    },1);
}

// Fonction pour arrêter la course
function stopRace() {
    clearInterval(car1.intervalId);
    clearInterval(car2.intervalId);
    isRaceOn = false;
}

// Fonction pour afficher les confettis
function afficherConfettis() {
    const confettiSettings = {
        target: 'confettiCanvas',
        max: 300,
        size: 1,
        animate: true,
        props: ['circle', 'square'],
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
        clock: 25,
        rotate: true,
        start_from_edge: false,
        respawn: true,
    };

    confettiInstance = new ConfettiGenerator(confettiSettings); // Crée l'instance
    confettiInstance.render(); // Démarre l'animation
}

// Fonction pour détecter le gagnant
function checkWinner(car, name) {
    if (car.x <= 0 && isRaceOn) {
        stopRace();
        $("#winner").text(name + " a gagné !");
        afficherConfettis(); // Affiche les confettis
    }
}

// Fonction pour réinitialiser la course
function resetRace() {
    stopRace(); // Arrête toute course en cours
    car1.reinitialiser(); // Réinitialise la position de car1
    car2.reinitialiser(); // Réinitialise la position de car2
    $("#winner").text(""); // Efface le message du gagnant
    $("#countdown").text(""); // Efface le compte à rebours
    isRaceOn = false; // Indique que la course est arrêtée

    // Supprime les confettis
    if (confettiInstance) {
        confettiInstance.clear(); // Arrête et supprime les confettis
        confettiInstance = null; // Réinitialise l'instance
    }
}

// Compte à rebours avant la course
function countdown() {
    let counter = 3;
    $("#countdown").text(counter).css("display", "block"); // Affiche le compte à rebours
    countdownInterval = setInterval(() => {
        counter--;
        if (counter > 0) {
            $("#countdown").text(counter); // Met à jour le texte du compte à rebours
        } else {
            clearInterval(countdownInterval);
            $("#countdown").text("Go !"); // Affiche "Go!"
            setTimeout(() => {
                $("#countdown").fadeOut(); // Cache le compte à rebours après "Go!"
            }, 500);
            startRace(); // Lance la course
        }
    }, 1000);
}

// Gestionnaire d'événements pour les boutons
$("#start").click((event) => {
    event.preventDefault(); // Empêche le comportement par défaut
    if (!isRaceOn) {
        countdown(); // Démarre le compte à rebours
    }
});

$("#restart").click((event) => {
    event.preventDefault(); // Empêche le comportement par défaut
    resetRace(); // Réinitialise la course sans la relancer
});