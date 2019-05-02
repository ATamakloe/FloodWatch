const axios = require('axios');
const url = 'https://waterservices.usgs.gov/nwis/iv/?sites=08313000&period=P180D&format=json&parameterCd=00060';


const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

getData(url);
