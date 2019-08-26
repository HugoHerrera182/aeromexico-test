import React from 'react';
import './Header.css';
import Logo from '../../imgs/logoAM1.png';
import Country from '../../imgs/banderaMX5.svg';
import MailIcon from '../../imgs/mail3.svg';

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <div className="header">
        <div className="header-left">
          <div className="header-left-logo">
            <a href="#" >
            <img className="logo" alt="logo" src={Logo}></img>
          </a>
          </div>
          <a href="#">Reserva</a>
          <a href="#">Tu viaje</a>
          <a href="#">Check-In</a>
          <a href="#">Upgrade</a>
          <a href="#">Club Premier</a>
        </div>
        <div className="header-right">
          <a href="#" className="divide">
            <img alt="emailLogo" className="mail-icon" src={MailIcon}></img>
          </a>
          <a href="#">
            <img alt="countryLogo" className="flag" src={Country}></img>
          </a>
          <a href="#">Iniciar sesión</a>
        </div>
        <div className="header-right">
          <a href="#">Promociones</a>
          <a href="#">Rastrea un vuelo</a>
          <a href="#">Destinos</a>
          <a href="#">Mas</a>
        </div>
      </div>
    );
  }
}

export default HeaderComponent
