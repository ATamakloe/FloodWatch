import City from './city';
import styles from '../styles/styles.css';

let time = document.getElementById('CurrentTime');
time.innerHTML = (new Date()).toLocaleTimeString();


/*Create City objects and add each one to array. City objects handle the AJAX calls
to USGS*/

const Houston = new City("Houston", [29.74, -95.36], [-95.7, 29.6, -95.02, 30.00]);
const Austin = new City("Austin", [30.26, -97.74], [-98.12, 30.05, -97.31, 30.61]);
const SanAntonio = new City("San Antonio", [29.41, -98.49], [-99.1, 29.02, -97.95, 29.67]);
let cityArray = [Houston, Austin, SanAntonio];



//Functions for creating the map and populating with data
var map;

const mapConfig = {
  lat: Houston.cityCenter[0],
  lng: Houston.cityCenter[1]
};
const initMap = () => {
  map = new google.maps.Map(document.getElementById('GoogleMapsContainer'), {
    center: mapConfig,
    zoom: 11,
    mapTypeId: 'terrain'
  });
};
window.initMap = initMap;


const computeValueOverMean = (value, mean) => {
  const valoveravg = mean == "N/A" ? "N/A" : (value / mean);
  if (valoveravg == "N/A") {
    return "N/A";
  } else if (valoveravg <=1.25) {
    return "Safe";
  } else if (valoveravg > 1.25 && valoveravg < 1.5) {
    return "Caution";
  } else if (valoveravg => 1.5) {
    return "Danger";
  };
};

const renderMarkers = (data) => {
  data.forEach( (element)  => {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(element.siteCoords[0], element.siteCoords[1]),
      map: map,
      title: element.siteName,
      id: element.siteCode,
      });

    let infowindow = new google.maps.InfoWindow(
      {content: `${element.siteName}.  Water Height:${element.siteValue} ft`}
    );


    if (computeValueOverMean(element.siteValue, element.siteMean) == "N/A") {
      marker.setIcon("../../public/assets/noavgflag.png");
    } else if (computeValueOverMean(element.siteValue, element.siteMean) == "Safe") {
      marker.setIcon("../../public/assets/safeflag.png");
    } else if (computeValueOverMean(element.siteValue, element.siteMean) == "Caution") {
      marker.setIcon("../../public/assets/cautionflag.png");
    } else if (computeValueOverMean(element.siteValue, element.siteMean) == "Danger") {
      marker.setIcon("../../public/assets/dangerflag.png");
    };

    google.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
  });
};

const cityInit = (arrayofcities) => {
  arrayofcities.forEach(function(cityInArray) {
    //Call init function of each city and populate map with markers
    cityInArray.init();
    cityInArray.stationData.then(data => renderMarkers(data));
  });
};

cityInit(cityArray);
//------------------------------------------------------------------------------


//Functions (event handlers) that handle changing the map when city names are clicked on
const changeMapLocationOnClick = function() {
  map.setCenter({
    lat: eval(this.id).cityCenter[0],
    lng: eval(this.id).cityCenter[1]
  });
  //For this to work, ID of li has to = name of the city it represents
};

const changeTableOnClick = function() {
  /*Check what city's data is being displayed on the table.
   If its the city that was clicked on, do nothing. If it isn't,
   wipe the table and load the city that was clicked on
  */
  let tableCheck = document.getElementById("TABLE").rows[1].classList[0];
  let rowArray = [...document.getElementsByClassName(tableCheck)];
  if (this.id == tableCheck[0]) {
    return;
  } else if (this.id != tableCheck) {
    rowArray.forEach(trow => trow.parentNode.removeChild(trow));
    initTable(eval(this.id));
  };
};

//Add each event handler to each li element

document.querySelectorAll("li").forEach( (link) => {
  link.addEventListener("click", changeMapLocationOnClick);
  link.addEventListener("click", changeTableOnClick);
});

//-----------------------------------------------------------------------
//Function to initialize the table
const initTable = (city) => {
  //Refactor this before it becomes a monster
  let row = document.getElementById('TABLE');
  city.stationData.then( (data) => {
    document.getElementById("TableCaptionCityName").innerHTML=`${city.cityName}`;
  data.map( (results) => {
    //Create a new row
    let newRow = row.insertRow(1);
    newRow.className+=`${city.cityName}`;
    newRow.id = `${results.siteCode}`;
    newRow.setAttribute("tabindex","0");
    //Give that row Site Name, Water Height, and Average Height Cells
    let newCell = newRow.insertCell(0);
    newCell.className += "SiteNames";
    newCell.setAttribute("data-label","Site Name");
    let newCell2 = newRow.insertCell(1);
    newCell2.className += "WaterHeight";
    newCell2.setAttribute("data-label","Water Height");
    let newCell3 = newRow.insertCell(2);
    newCell3.className += "AverageHeight";
    newCell3.setAttribute("data-label","Average Height");

    //Put data in those cells
    let newText = document.createTextNode(results.siteName);
    let newText2 = document.createTextNode(results.siteValue);
    let newText3 = document.createTextNode(results.siteMean !== "N/A" ? results.siteMean.toFixed(2) : "N/A");
    newCell.appendChild(newText);
    newCell2.appendChild(newText2);
    newCell3.appendChild(newText3);

    /*Style each table row depending on site value to site mean ratio (see computeValueOverMean function)
    class names come from SemanticUI. See: https://semantic-ui.com/collections/table.html */

    if (computeValueOverMean(results.siteValue, results.siteMean) === "N/A") {
      newRow.className+=" active";
    } else if (computeValueOverMean(results.siteValue, results.siteMean) === "Safe") {
      newRow.className+=" positive";
    } else if (computeValueOverMean(results.siteValue, results.siteMean) === "Caution") {
      newRow.className+=" warning";
    } else if (computeValueOverMean(results.siteValue, results.siteMean) === "Danger") {
      newRow.className+=" negative";
    };

  });
});
};

initTable(Houston);
