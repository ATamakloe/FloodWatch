import {
  City
} from './city';
import styles from '../styles/styles.css';


let time = document.getElementById('CurrentTime');
time.innerHTML = (new Date()).toLocaleTimeString();

const Houston = new City("Houston", [29.74, -95.36], [-95.7, 29.6, -95.02, 30.00]);
const Austin = new City("Austin", [30.26, -97.74], [-98.12, 30.05, -97.31, 30.61]);
const SanAntonio = new City("SanAntonio", [29.41, -98.49], [-99.1, 29.02, -97.95, 29.67]);
let cityArray = [Houston, Austin, SanAntonio];

var map;
const mapConfig = {
  lat: Houston.cityCenter[0],
  lng: Houston.cityCenter[1]
};
const initMap = function() {
  map = new google.maps.Map(document.getElementById('GoogleMapsContainer'), {
    center: mapConfig,
    zoom: 10,
    mapTypeId: 'terrain'
  });
};
window.initMap = initMap;

const renderMarkers = function(data) {
  data.forEach(function(element) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(element.siteCoords[0], element.siteCoords[1]),
      map: map,
      title: element.siteName,
      id: element.siteCode,
    });
    let infowindow = new google.maps.InfoWindow({
      content: `${element.siteName}.  Water Height:${element.siteValue}`
    });

    google.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
  });
};
const cityInit = function(arrayofcities) {
  arrayofcities.forEach(function(cityInArray) {
    cityInArray.init();
    cityInArray.stationData.then(data => renderMarkers(data));
  });
};

cityInit(cityArray);


const changeMapLocation = function() {
  map.setCenter({
    lat: eval(this.id).cityCenter[0],
    lng: eval(this.id).cityCenter[1]
  });
  //For this to work, ID of li has to = name of the city it represents
};

const changeTable = function() {
  let tableCheck = document.getElementById("TABLE").rows[1].className;
  let rowArray = [...document.getElementsByClassName(tableCheck)];
  //Usage of == intentional over usage of ===
  if (this.id == tableCheck) {
    return;
  } else if (this.id != tableCheck) {
    rowArray.forEach(trow => trow.parentNode.removeChild(trow));
    createTable(eval(this.id));
  };
};




document.querySelectorAll("li").forEach(function(link) {
  link.addEventListener("click", changeMapLocation);
  link.addEventListener("click", changeTable);
});

const createTable = function(city) {
  let row = document.getElementById('TABLE');
  city.stationData.then(function(data) {
  data.map(function(results) {
    let newRow = row.insertRow(1);
    newRow.className+=`${city.cityName}`;
    newRow.id = `${results.siteCode}`
    let newCell = newRow.insertCell(0);
    newCell.className += "SiteNames";
    let newCell2 = newRow.insertCell(1)
    newCell2.className += "WaterHeight";
    let newCell3 = newRow.insertCell(2)
    newCell3.className += "AverageHeight";
    let newText = document.createTextNode(results.siteName);
    let newText2 = document.createTextNode(results.siteValue);
    let newText3 = document.createTextNode(results.siteMean !== "N/A" ? results.siteMean.toFixed(2) : "N/A") ;
    newCell.appendChild(newText);
    newCell2.appendChild(newText2);
    newCell3.appendChild(newText3);
  });
  })
};

createTable(Houston);
