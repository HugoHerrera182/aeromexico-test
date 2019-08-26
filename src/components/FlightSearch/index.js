import React from 'react';
import Select from 'react-select'
import './FlightSearch.css';
import ExchangeIcon from '../../imgs/exchange.svg';
import flightService from '../../services/FlightSearch/flightSearch.service';
import FlightTableComponent from '../FlightTable';
import Swal from "sweetalert2";

class FlightSearchComponent extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      allAirports: null,
      allFlightsByAirport: null,
      originAirports: null,
      destinationAirports: null,
      origin: null,
      destination: null,
      originSelected: null,
      destinationSelected: null,
      flightDate: null,
      optionSelected: 'route',
      flightNumber: '',
    }
  }

  componentDidMount = () => {
    this.getAirports();
    this.getFlightsFromAirports();
    this.loadSelectDates();
  }

  getAirports = async () => {
    try {
      let response = [];
      let airports = [];
      response = await flightService.getAirports();
      response.forEach(element => {
        airports.push({ value: element.airport.code, label: `${element.airport.city} ${element.airport.code}` })
      });
      this.setState({
        ...this.state,
        allAirports: response,
        originAirports: airports,
      })
    } catch (e) {
      console.error(JSON.stringify(e));
      Swal.fire({
        type: 'error',
        title: 'Error cargando los aeropuertos',
        text: 'Favor de intentarlo maás tarde'
      });
    }
  }

  getFlightsFromAirports = async () => {
    try {
      let response = [];
      response = await flightService.getFlightsFromAirports();
      this.setState({
        ...this.state,
        allFlightsByAirport: response,
      });
    } catch (e) {
      console.error(JSON.stringify(e));
      Swal.fire({
        type: 'error',
        title: 'Error cargando los destinos de cada aeropuerto',
        text: 'Favor de intentarlo maás tarde'
      });
    }
  }

  loadSelectDates = () => {
    let today = new Date();
    let yesterday = new Date();
    let tomorrow = new Date();
    let todayOption = this.loadOptionsDate(today);
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);
    let dateOptions = [
      this.loadOptionsDate(yesterday),
      todayOption,
      this.loadOptionsDate(tomorrow),
    ];
    this.setState({
      ...this.state,
      dateOptions: dateOptions,
      flightDate: todayOption.value,
    })
  }

  loadOptionsDate = (date) => {
    let monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];
    let day = date.getDate();
    let completeday = day < 10 ? `0${day}` : day;
    let monthIndex = date.getMonth();
    let realMonth = monthIndex + 1;
    let completeMont = realMonth < 10 ? `0${realMonth}` : realMonth;
    let year = date.getFullYear();
    return { value: `${year}-${completeMont}-${completeday}`, label: `${day} de ${monthNames[monthIndex]}` };
  }

  handleChange = (selectOption, extraInfo) => {
    if (extraInfo.name === 'origin') {
      this.getDestinationsByAirport(selectOption);
    } else {
      this.setState({
        ...this.state,
        [extraInfo.name]: selectOption.value,
        destinationSelected: selectOption
      });
    }
  }

  handleChangeDate = (selectOption, extraInfo) => {
    this.setState({
      ...this.state,
      [extraInfo.name]: selectOption.value,
    });
  }

  getDestinationsByAirport = (airportCode) => {
    const { allFlightsByAirport, allAirports } = this.state;
    let destinationAirports = [];
    let airporsCode = [];
    airporsCode = allFlightsByAirport[airportCode.value].fliesToAirportCode;
    allAirports.forEach(element => {
      if (airporsCode.indexOf(element.airport.code) >= 0) {
        destinationAirports.push({ value: element.airport.code, label: `${element.airport.city}   ${element.airport.code}` });
      }
    });
    this.setState({
      ...this.state,
      destinationAirports: destinationAirports,
      origin: airportCode.value,
      originSelected: airportCode,
    });
  }

  handleOptionChange = (changeEvent) => {
    this.setState({
      ...this.state,
      optionSelected: changeEvent.target.value
    });
  }

  handleTextChange = (event) => {
    this.setState({
      ...this.state,
      flightNumber: event.target.value
    });
  }

  getFlightsByFlightNumber = async () => {
    const { flightNumber, flightDate } = this.state;
    try {
      let response = await flightService.getFlightsByFlightNumber(flightNumber, flightDate);
      this.buildDataTable(response);
    } catch (e) {
      console.error(JSON.stringify(e));
      Swal.fire({
        type: 'error',
        title: 'Error cargando los vuelos por ruta',
        text: 'Favor de intentarlo maás tarde'
      });
    }
  }

  getFlightsByRoute = async () => {
    const { origin, destination, flightDate } = this.state;
    try {
      Swal.fire({
        title: 'Buscando vuelos',
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      })
      let response = await flightService.getFlightsByRoute(origin, destination, flightDate);
      Swal.close();
      this.buildDataTable(response);
    } catch (e) {
      console.error(JSON.stringify(e));
      Swal.fire({
        type: 'error',
        title: 'Error cargando los vuelos por número de vuelo',
        text: 'Favor de intentarlo maás tarde'
      });
    }
  }

  buildDataTable = (allDataTable) => {
    let flights = [];
    allDataTable.forEach(element => {
      flights.push({
        id: `${element._collection[0].segment.marketingCarrier} ${element._collection[0].segment.marketingFlightCode}`,
        operatingCarrier: element._collection[0].segment.operatingCarrier,
        status: element._collection[0].status,
        departureAirport: element._collection[0].segment.departureAirport,
        boardingTerminal: element._collection[0].segment.boardingTerminal,
        boardingGate: element._collection[0].segment.boardingGate,
        departureDateTime: element._collection[0].segment.departureDateTime,
        arrivalDateTime: element._collection[0].segment.arrivalDateTime,
        arrivalAirport: element._collection[0].segment.arrivalAirport,
        arrivalTerminal: element._collection[0].arrivalTerminal,
        arrivalGate: element._collection[0].arrivalGate,
      })
    });
    if (!(flights.length > 0)) {
      flights = null;
      Swal.fire({
        type: 'error',
        title: 'No hay vuelos',
        text: 'Seleccionar otros filtros'
      })
    }  
    this.setState({
      ...this.state,
      dataTable: flights,
    });
  }

  exchangeData = () => {
    const { originSelected, origin, destinationSelected, destination } = this.state;
    this.setState({
      ...this.state,
      originSelected: destinationSelected,
      origin: destination,
      destinationSelected: originSelected,
      destination: origin,
    });
  }

  render() {
    const {
      originAirports,
      destinationAirports,
      origin,
      destination,
      dateOptions,
      optionSelected,
      flightNumber,
      dataTable,
      originSelected,
      destinationSelected,
    } = this.state;
    const today = new Date();
    const todayOption = this.loadOptionsDate(today);

    return (
      <section>
        <section className="body-search">
          <div className="search-options">
            <div className="block-search">
              <input type="radio" name="radioOptions" checked={optionSelected === 'route'} onChange={this.handleOptionChange} value="route" ></input>Destino
          </div>
            <div className="block-search">
              <input type="radio" name="radioOptions" checked={optionSelected === 'flightNumber'} onChange={this.handleOptionChange} value="flightNumber"></input>Número de vuelo
          </div>
          </div>
          <div className="search-filters">
            {optionSelected === 'route' ?
              <React.Fragment>
                <div className="block-search search-select">
                  <label>Origen</label>
                  <label>|</label>
                  <label>Ver todos</label>
                  <Select
                    value={originSelected}
                    isDisabled={originAirports === null}
                    name="origin"
                    options={originAirports}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="block-search">
                  <button className="exchange-icon" onClick={this.exchangeData} disabled={!(origin !== null && destination !== null)}>
                    <img alt="Exchange" src={ExchangeIcon}></img>
                  </button>

                </div>
                <div className="block-search search-select">
                  <label>Destino</label>
                  <label>|</label>
                  <label>Ver todos</label>
                  <Select
                    value={destinationSelected}
                    isDisabled={destinationAirports === null}
                    name="destination"
                    options={destinationAirports}
                    onChange={this.handleChange}
                  />
                </div>
              </React.Fragment>
              :
              <div className="block-search search-select">
                <label>Número de vuelo</label>
                <div>
                <input className="input-date" onChange={this.handleTextChange} type="text"></input>
              </div>
              </div>}

            <div className="block-search date-search">
              <label>Fecha de salida</label>
              <Select
                name="flightDate"
                defaultValue={todayOption}
                options={dateOptions}
                onChange={this.handleChangeDate}
              />
            </div>
            <div className="block-search">
              {optionSelected === 'route' ?
                <button onClick={this.getFlightsByRoute} disabled={!(origin !== null && destination !== null)} className="search-btn">Buscar</button>
                : <button onClick={this.getFlightsByFlightNumber} disabled={!(flightNumber !== '')} className="search-btn">Buscar</button>
              }
            </div>
          </div>
        </section>
        <FlightTableComponent
          dataTable={dataTable}
        />
      </section>
    );
  }
}

export default FlightSearchComponent
