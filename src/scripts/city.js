import dataJSON from '../../public/data.json'

class City {
  static cityArr = [];  //ESLint wont like this, ignore it


  static checkCityArr(cityName) {
    if (City.cityArr.indexOf(cityName) != -1) {
      throw Error("Duplicate city name")
    } else {
      City.cityArr.push(cityName)
    }
  }


  constructor(cityName, cityCenterLocation, cityBBox) {
    City.checkCityArr(cityName);
    //Check if city already exists, if so, throw error. This prevents duplicate cities
    this._cityName = cityName;
    this._cityCenter = cityCenterLocation;
    this._cityBBox = cityBBox;
    this._stationData = [];

    this._date = (() => {
      const date = new Date();
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000) - 30 * 60000).toISOString()
    })();

    this._url = `https://waterservices.usgs.gov/nwis/iv/?format=json&variable=00065&bBox=${this.cityBBox}&startDT=${this._date}`;

    this.getStationData = async function() {
      let response = await fetch(this.url);
      response = await response.json();
      const data = response.value.timeSeries;
      let stationArray = data.map(data => ({
        siteName: data.sourceInfo.siteName,
        siteCode: data.sourceInfo.siteCode[0].value,
        siteCoords: [data.sourceInfo.geoLocation.geogLocation.latitude, data.sourceInfo.geoLocation.geogLocation.longitude],
        siteVar: data.variable.variableDescription,
        siteValue: data.values["0"].value.slice(-1)[0] ? data.values["0"].value.slice(-1)[0].value : "Value unavailable",
        siteMean: dataJSON.hasOwnProperty(data.sourceInfo.siteCode[0].value) ? dataJSON[data.sourceInfo.siteCode[0].value].Mean : "N/A",
      }));
      stationArray = stationArray.filter(station => station.siteValue !== "Value unavailable");
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
    this.stationData = this.getStationData();
  };

};



export default City;
