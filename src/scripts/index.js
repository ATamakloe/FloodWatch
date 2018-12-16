import {
  City,
  dataRefresh,
  createTable
} from './city';
import styles from '../styles/styles.css';

let date = new Date();
document.getElementById('CurrentTime').innerHTML = date.toLocaleTimeString();

const Houston = new City("Houston", [29.74, -95.36], [-95.7, 29.6, -95.02, 30.00]);
const Austin = new City("Austin", [30.26, -97.74], [-98.12, 30.05, -97.31, 30.61]);
const SanAntonio = new City("SanAntonio", [29.41, -98.49], [-99.1, 29.02, -97.95, 29.67]);
let cityArray = [Houston, Austin, SanAntonio];
let randomcity = cityArray[Math.floor(Math.random()*cityArray.length)]

//setInterval(dataRefresh(),5000)

//Google Maps Code ------------------------------//
var map;
let mapConfig = {
  lat: Houston.cityCenter[0],
  lng: Houston.cityCenter[1]
};

function initMap() {
  map = new google.maps.Map(document.getElementById('GoogleMapsContainer'), {
    center: mapConfig,
    zoom: 10
  });
};
window.initMap = initMap;




function changeLocation() {
  map.setCenter({lat:eval(this.id).cityCenter[0],lng:eval(this.id).cityCenter[1]})
  //For this to work, ID of li has to = name of the city it represents
};


function renderTable() {
  let tableCheck = document.getElementById("TABLE").rows[1].className;
  let rowArray = [...document.getElementsByClassName(tableCheck)];
  //Usage of == intentional over usage of ===
  if (this.id == tableCheck) {
    return;
  } else if (this.id != tableCheck) {
    rowArray.forEach(trow => trow.parentNode.removeChild(trow));
    createTable(eval(this.id));
  }
}

function renderMarkers(data) {
  data.forEach(function(element) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(element.siteCoords[0], element.siteCoords[1]),
      map: map,
      title: element.siteName,
      id: element.siteCode
    });
    var infowindow = new google.maps.InfoWindow({
      content: `${element.siteName}.  Water Height:${element.siteValue}`
    });

    google.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
  });
}

function cityInit(arrayofcities) {
  arrayofcities.forEach(function(cityInArray) {
    cityInArray.init();
    cityInArray.stationData.then(data => renderMarkers(data));
  })
};

cityInit(cityArray);

document.querySelectorAll("li").forEach(function(link) {
  link.addEventListener("click", changeLocation);
  link.addEventListener("click", renderTable);
});

createTable(Houston);
