import axios from 'axios';

export default {

  async getAirports() {
    return await axios.get(`https://mad.amlab7.com/cms/api/v1/airports?language=es&status=1`)
      .then(res => {
        return res.data.airports;
      })
  },

  async getFlightsFromAirports() {
    return await axios.get(`https://mad.amlab7.com/api/v1/airports?store=mx&pos=WEB`)
      .then(res => {
        return res.data._collection;
      })
  },

  async getFlightsByRoute(origin, destination, date) {
    return await axios.get(`https://mad.amlab7.com/api/v1/checkin/flight-status?store=mx&pos=WEB&flight=&date=${date}&origin=${origin}&destination=${destination}`)
      .then(res => {
        return res.data._collection;
      })
  },

  async getFlightsByFlightNumber(flightNumber, date) {
    return await axios.get(`https://mad.amlab7.com/api/v1/checkin/flight-status?store=mx&pos=WEB&flight=${flightNumber}&date=${date}&origin=&destination=`)
      .then(res => {
        return res.data._collection;
      })
  },

}
