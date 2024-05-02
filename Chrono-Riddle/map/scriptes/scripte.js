const lieu2 = [47.7451821084126, 7.336975043460907];
const lieu3 = [47.74672430906432, 7.339280457191423];


// Récupère le numéro de la localisation de l'utilisateur
var loc = localStorage.getItem("locNum");

// Si il n'est pas présent dans le local storage :
if (loc === null) {
    localStorage.setItem("locNum", 1); // Va à la localisation du parc
}

if (loc == 2) {
    var lieuLat = lieu2[0];
    var lieuLong = lieu2[1];
}
else if (loc == 3) {
    var lieuLat = lieu3[0];
    var lieuLong = lieu3[1];
}
else {
    document.querySelector("body").innerHTML = "<h1>Error</h1>"
}


var map = L.map('map');
var map1 = document.querySelector(".map");


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//                                                                      ici

var userMarker;  // Globally declare the user marker
var routeControl;  // Globally declare the route control

var watchID = navigator.geolocation.watchPosition(onLocationUpdate, onLocationError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000
});

function onLocationUpdate(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    var userLocation = L.latLng(latitude, longitude);

    // Si la carte n'a pas encore été initialisée (première mise à jour de position)
    if (!map._loaded) {
        map.setView(userLocation, 18);
    }

    // Mise à jour du marker de l'utilisateur et recentrage de la carte
    updateUserLocation(userLocation);

    // Vérifiez si l'utilisateur est proche de la destination et mettez à jour l'itinéraire si nécessaire
    if (!isNear({ lat: lieuLat, lng: lieuLong }, userLocation, 30)) {
        updateRoute(userLocation);
    } else {
        arrived(map1);  // Appeler la fonction arrived si près de la destination
    }
}

function isNear(point1, point2, threshold) {
    var R = 6371e3; // Rayon de la Terre en mètres
    var lat1 = point1.lat * Math.PI / 180; // Convertir les latitudes en radians
    var lat2 = point2.lat * Math.PI / 180;
    var deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
    var deltaLon = (point2.lng - point1.lng) * Math.PI / 180;

    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var distance = R * c; // Distance en mètres
    console.log(distance);
    return distance <= threshold;
}


function updateUserLocation(userLocation) {
    // Supprime ou crée un nouveau marker de la position de l'utilisateur
    if (userMarker) {
        userMarker.setLatLng(userLocation);
    } else {
        userMarker = L.marker(userLocation, {
            icon: rgbb, // Assurez-vous que cette icône est bien définie ailleurs dans votre code
            draggable: false
        }).addTo(map);
    }

    map.panTo(userLocation);
}

function updateRoute(userLocation) {
    // Mise à jour ou création d'une nouvelle instance de L.Routing.control avec les nouveaux waypoints
    if (routeControl) {
        routeControl.spliceWaypoints(0, 1, userLocation);
    } else {
        routeControl = L.Routing.control({
            waypoints: [
                userLocation,
                L.latLng(lieuLat, lieuLong)
            ],
            routeWhileDragging: true
        }).addTo(map);
    }
}


//                                                                      ici

//setTimeout()

function onLocationFound(e) {

    L.Routing.control({
        waypoints: [
            L.latLng(e.latlng),
            L.latLng(lieuLat, lieuLong)
        ],
        routeWhileDragging: true,
        createMarker: function (i, waypoint, n) {
            if (i === 0) {
                // Départ
                return L.marker(waypoint.latLng, {
                    draggable: false,
                    icon: rgbb,
                    zIndexOffset: 1000
                });
            } else {
                return L.marker(waypoint.latLng, {
                    draggable: false,
                    zIndexOffset: 1000
                });
            }
        }
    }).addTo(map);

    if (e.latitude == lieuLat && e.longitude == lieuLong) {
        arrived(map1);
    }
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var rgbb = L.icon({
    iconUrl: 'simon/fredyx.png',

    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
});




function arrived(map1) {
    document.querySelector("body").innerHTML = "<a class='cont' href='index.html'>Continue</a>";
    map1.style.display = "none";
    console.log("on y est");

    switch (loc) {
        case "2":
            localStorage.setItem("chapterNum", 4); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 2);
            break;
        case "3": {
            localStorage.setItem("chapterNum", 7); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 3);
            // Faire ça une fois que le temps sera venu
            break;
        }
    }
}

// Reset les chapitres
function resetChapter() {
    localStorage.setItem("pageNum", 0);
    localStorage.setItem("numPage", 0);
}

function admin_test_arrived(){
    document.querySelector("body").innerHTML = "<a class='cont' href='index.html'>Continue</a>";
    console.log("on y est");

    switch (loc) {
        case "2":
            localStorage.setItem("chapterNum", 4); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 2);
            break;
        case "3": {
            localStorage.setItem("chapterNum", 7); // Change le numéro du chapitre dans lequel le joueur va jouer
            resetChapter();
            localStorage.setItem("locNum", 3);
            // Faire ça une fois que le temps sera venu
            break;
        }
    }
}