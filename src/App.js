import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import MapContainer from './MapContainer'
import Gallery from 'react-grid-gallery';

class App extends Component {
  componentDidMount() {
    document.querySelector('.menu').addEventListener('click', this.toggleSideBar)
    document.querySelector('.menu').addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        document.querySelector('.menu').focus()
        this.toggleSideBar()
      }
    })
  }

  toggleSideBar = () => {
    document.querySelector('.sidebar').classList.toggle('text-input-hidden')
  }

  render() {
    return (
      <div>
        <a className="menu" tabIndex="0">
          <svg className="hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
          </svg>
        </a>
        <h1 className="heading"> CA North Coast</h1>
        <h2 className = "subheading">Nature Trails: Mendocino to Ten Mile River</h2>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBQr4JM_y5nd5MyVZS6mCzp6mfV9awDytk'
})(App)