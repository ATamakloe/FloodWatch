// TODO: 1. MOVE VIEW LOGIC TO SEPERATE FILE
import dataJSON from '../../public/data.json'
console.log(dataJSON);
class City {
  constructor(cityName, cityCenterLocation, cityBBox) {
    this._cityName = cityName;
    this._stationData = [];
    this._weather = [];
    this._cityCenter = cityCenterLocation;
    this._cityBBox = cityBBox;
    let date = new Date();
    this._date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) - 30*60000).toISOString()
    this._url =`https://waterservices.usgs.gov/nwis/iv/?format=json&variable=00065&bBox=${this.cityBBox}&startDT=${this._date}`;


    /*this.getWeather = async function() {
      try {
        return await fetch(url)
          .then(function(response) {
            return response.json()
          });
      } catch (error) {
        return error;
      };
    };
    */

    this.getStationData = async function() {
      let response = await fetch(this.url);
      let responsev2 = await response.json();
      let data = await responsev2.value.timeSeries;
      let stationArray = data.map(data => ({
        siteName: data.sourceInfo.siteName,
        siteCode: data.sourceInfo.siteCode[0].value,
        siteCoords: [data.sourceInfo.geoLocation.geogLocation.latitude, data.sourceInfo.geoLocation.geogLocation.longitude],
        siteVar: data.variable.variableDescription,
        siteValue: data.values["0"].value.slice(-1)[0] ? data.values["0"].value.slice(-1)[0].value : "Value unavailable",
        siteMean: dataJSON.hasOwnProperty(data.sourceInfo.siteCode[0].value) ? dataJSON[data.sourceInfo.siteCode[0].value].Mean : "N/A",
      }));
      console.log(stationArray);
      return stationArray;

    };
  }

    get cityName() {
      return this._cityName;
    }

    get stationData() {
      return this._stationData;
    }

    set stationData(newValue) {
      this._stationData = newValue;
    }

    get weather() {
      return this._weather;
    }

    set weather(newValue) {
      this._weather = newValue;
    }

    get cityCenter() {
      return this._cityCenter;
    }

    get cityBBox() {
      return this._cityBBox;
    }

    get url() {
      return this._url;
    }


  init() {
    //this.weather = this.getWeather();
    this.stationData = this.getStationData();
  };

};

//Update this function to
const dataRefresh = function(CityName) {
  [...document.getElementsByClassName("SiteNames")].forEach(tabledata => tabledata.innerHTML="Loading...");
  [...document.getElementsByClassName("WaterHeight")].forEach(tabledata => tabledata.innerHTML="Loading...");
  CityName.getStationData().then(function(data) {
    data.forEach(function(cv, i) {
      document.getElementById("TABLE").rows[i+1].cells[0].innerHTML = cv.siteName;
      document.getElementById("TABLE").rows[i+1].cells[1].innerHTML = cv.siteValue;
    })
  })
  document.getElementById('CurrentTime').innerHTML=date.toLocaleTimeString();
  console.log("refreshed");
};


const createTable = function(City) {
  let row = document.getElementById('TABLE');
  City.stationData.then(function(data) {
  data.map(function(results) {
    let newRow = row.insertRow(1);
    newRow.className+=`${City.cityName}`;
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

export {City, dataRefresh, createTable};
