import dataJSON from '../../public/data.json'
class City {
  static cityArr = [];

  static checkCityArr(cityName) {
    if (City.cityArr.indexOf(cityName) != -1) {
      throw Error("Duplicate city name")
    } else {
      City.cityArr.push(cityName)
    }
  }


  constructor(cityName, cityCenterLocation, cityBBox) {
    City.checkCityArr(cityName)
    this._cityName = cityName;
    this._cityCenter = cityCenterLocation;
    this._cityBBox = cityBBox;
    this._stationData = [];

    let date = new Date();
    this._date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) - 30 * 60000).toISOString()
    this._url = `https://waterservices.usgs.gov/nwis/iv/?format=json&variable=00065&bBox=${this.cityBBox}&startDT=${this._date}`;

    this.getStationData = async function() {
      let response = await fetch(this.url);
      let responsev2 = await response.json();
      let data = responsev2.value.timeSeries;
      let stationArray = data.map(data => ({
        siteName: data.sourceInfo.siteName,
        siteCode: data.sourceInfo.siteCode[0].value,
        siteCoords: [data.sourceInfo.geoLocation.geogLocation.latitude, data.sourceInfo.geoLocation.geogLocation.longitude],
        siteVar: data.variable.variableDescription,
        siteValue: data.values["0"].value.slice(-1)[0] ? data.values["0"].value.slice(-1)[0].value : "Value unavailable",
        siteMean: dataJSON.hasOwnProperty(data.sourceInfo.siteCode[0].value) ? dataJSON[data.sourceInfo.siteCode[0].value].Mean : "N/A",
      }));
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



export {
  City
};
