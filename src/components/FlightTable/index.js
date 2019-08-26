import React from 'react';
import './FlightTable.css';
import ArrowIcon from '../../imgs/line2.png'
import flightService from '../../services/FlightSearch/flightSearch.service'
import FlightStatus from '../types/flightStatus'

class FlightTableComponent extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      dataTable: null,
    }
  }

  componentDidMount = () => {

  }

  render() {

    return (
      <section className="table-flight">
        {this.props.dataTable ?
        <table id="flightTable">
          <tbody>
            <tr className="table-header">
              <td className="flight-number">Número de vuelo</td>
              <td className="flight-status">Estado</td>
              <td className="flight-origin">Origen</td>
              <td className="flight-start">Hora de salida</td>
              <td className="flight-img"></td>
              <td className="flight-end">Hora de llegada</td>
              <td className="flight-destination">Destino</td>
            </tr>
              {this.props.dataTable.map(row => {
                let departureDateTime = row.departureDateTime;
                let arrivalDateTime = row.arrivalDateTime;
                departureDateTime = departureDateTime.substring(11, 16);
                arrivalDateTime = arrivalDateTime.substring(11, 16);
                return <tr key={row.id}>
                  <td>
                    <div>
                      <label className="main-label">{row.id}</label>
                      { row.operatingCarrier !== 'AM' ? <p>Operado por Aerolitoral DBA Aeromexico Connect</p> : ''}
                    </div>
                  </td>
                  <td>
                    <div>
                      <label className={row.status}>{FlightStatus[row.status]}</label>
                    </div>
                  </td>
                  <td>
                    <div>
                      <label>{row.departureAirport}</label>
                      <label className="main-p">{departureDateTime}</label>
                      <p>Terminal {row.boardingTerminal}</p>
                      <p>Sala {row.boardingGate}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <label className="main-label">{departureDateTime}</label>
                    </div>
                  </td>
                  <td>
                    <img alt="travelIcon" src={ArrowIcon}></img>
                  </td>
                  <td>
                    <div>
                      <label className="main-label">{arrivalDateTime}</label>
                    </div>
                  </td>
                  <td>
                    <div>
                      <label>{row.arrivalAirport}</label>
                      <label className="main-p">{arrivalDateTime}</label>
                      <p>Terminal {row.arrivalTerminal}</p>
                      <p>Sala {row.arrivalGate}</p>
                    </div>
                  </td>
                </tr>
              })}
          </tbody>  
        </table>
        : '' }
      </section>
    );
  }
}

export default FlightTableComponent
