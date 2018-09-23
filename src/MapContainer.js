import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'

export default class MapContainer extends Component {

  state = {
    locations: [{
        name: "MacKerricher State Park",
        location: {
          lat: 39.488802,
          lng: -123.784986,
        },
        search: "MacKerricher_State_Park"
      },
      {
        name: "Laguna Point",
        location: {
          lat: 39.489604,
          lng: -123.804493,
        },
        search: "MacKerricher_State_Park, Laguna_Point"
      },
      {
        name: "Ten Mile River",
        location: {
          lat: 39.546877,
          lng: -123.757269,
        },
        search: "Ten_Mile_River_(California)"
      },
      {
        name: "Noyo Headlands State Park",
        location: {
          lat: 39.432217,
          lng: -123.812925,
        },
        search: "Noyo_Headlands_State_Park"
      },
      {
        name: "Mendocino Coast Botanical Gardens",
        location: {
          lat: 39.409633,
          lng: -123.809829,
        },
        search: "Mendocino_Coast_Botanical_Gardens"
      },
      {
        name: "Jug Handle Beach Natural Park",
        location: {
          lat: 39.377322,
          lng: -123.817640,
        },
        search: "Jug_Handle_Beach_Natural_Park"
      },
      {
        name: "Point Cabrillo Lighthouse",
        location: {
          lat: 39.348970,
          lng: -123.826145,
        },
        search: "Point_Cabrillo_Light"
      },
      {
        name: "Russian Gulch State Marine Conservation",
        location: {
          lat: 39.330235,
          lng: -123.805760,
        },
        search: "Russian_Gulch_State_Marine_Conservation"
      },
      {
        name: "Point Mendocino Trail",
        location: {
          lat: 39.305060,
          lng: -123.809969,
        },
        search: "Point_Mendocino_Trail"
      },
      {
        name: "Big River Beach",
        location: {
          lat: 39.302637,
          lng: -123.791042,
        },
        search: "Big River"
      }
    ],
    query: '',
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    highlightedIcon: null,
    error: null,
    mapError: null
  }

  componentDidMount() {
    this.loadMap()
    this.onclickLocation()
    // Create a "highlighted location" marker color for when the user
    // clicks on the marker.
    this.setState({
      highlightedIcon: this.makeMarkerIcon('ffc169')
    })
  }

  loadMap() {
    if (this.props && this.props.google) {
      const {
        google
      } = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {
          lat: 45.188529,
          lng: 5.724523999999974
        },
        zoom: 12,
        mapTypeId: 'terrain'
      })

      this.map = new maps.Map(node, mapConfig)
      this.addMarkers()
    } else {
      this.setState({
        mapError: "error while loading the app"
      })
    }
  }



  handleValueChange = (e) => {
    this.setState({
      query: e.target.value
    })
  }

  addMarkers = () => {
    const {
      google
    } = this.props
    let {
      infowindow
    } = this.state
    const bounds = new google.maps.LatLngBounds();

    this.state.locations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: {
          lat: location.location.lat,
          lng: location.location.lng
        },
        map: this.map,
        title: location.name,
        search: location.search
      });


      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow) => {
    //console.log("Marker: ", marker);
    //const defaultIcon = marker.getIcon()
    const {
      highlightedIcon
    } = this.state
    const {
      google
    } = this.props

    const service = new google.maps.places.PlacesService(this.map)
    const geocoder = new google.maps.Geocoder()


    if (infowindow.marker !== marker) {
      // reset the color of previous marker

     // if (infowindow.marker) {
        //const ind = markers.findIndex(m => m.title === infowindow.marker.title)
        //markers[ind].setIcon(defaultIcon)  
     // }
      // change marker icon color of clicked marker

      //markers[ind].setIcon(defaultIcon)
      marker.setIcon(highlightedIcon)
      infowindow.marker = marker;
       console.log(marker)
  //    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/{marker.title}';
  //    fetch(url)
  //    .then(data => {

  //     if(data.ok) {
  //        return data.json()
  //      } else {
  //        throw new Error(data.statusText)
  //      }
  //   })

  //   .then(data => {
  //      infowindow.content(data.title)
  //    })
  //    .catch(err => {
  //      this.setState({error: err.toString()})
  //    })

      geocoder.geocode({
        'location': marker.position}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            service.getDetails({
              placeId: results[1].place_id
            }, (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                infowindow.setContent(`<h3>${marker.title}</h3>
        <div>Latitude: ${marker.getPosition().lat()}</div>
        <div>Longitude: ${marker.getPosition().lng()}</div>
        <div>${place.name}, ${place.formatted_address}</div>`);
                infowindow.open(this.map, marker);
              }
            });

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });

      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.marker = null
        //marker.setIcon(defaultIcon)
      });
    }
  }

  onclickLocation = () => {
    //const {markers} = this.state
    const that = this
    const {
      infowindow
    } = this.state

    const displayInfowindow = (e) => {
      let markers = this.state.markers;
      console.log("state: ", this.state);
      console.log("markers: ", markers);
      console.log("other onclickLocation :",

        e.target.innerText.toLowerCase());
      const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
      console.log("marker index: ", markerInd);
      that.populateInfoWindow(markers[markerInd], infowindow, that.state[markerInd])
    }
    //const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
    //that.populateInfoWindow(markers[markerInd], infowindow[markerInd])

    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })

    document.querySelector('.locations-list').addEventListener('keydown', function (e) {
      if (e.keyCode === 13) {
        displayInfowindow(e)
      }
    })
  }

  makeMarkerIcon = (markerColor) => {
    const {
      google
    } = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  render() {
      const {
        locations,
        query,
        markers,
        infowindow
      } = this.state
      if (query) {
        // get the index of elements that does not start with the query
        // and use that index with markers array to setMap to null
        locations.forEach((l, i) => {
          if (l.name.toLowerCase().includes(query.toLowerCase())) {
            markers[i].setVisible(true)
          } else {
            if (infowindow.marker === markers[i]) {
              // close the info window if marker removed
              infowindow.close()
            }
            markers[i].setVisible(false)
          }
        })
      } else {
        locations.forEach((l, i) => {
          if (markers.length && markers[i]) {
            markers[i].setVisible(true)
          }
        })
      }

      return ( <
          div > {
            this.state.error ? ( <
              div className = "error" >
              An error has occurred; please
              try later <
              div className = "error-description" > {
                this.state.error
              } < /div> <
              /div>):
              ( < div className = "container" >
                <
                div className = "sidebar text-input text-input-hidden" >
                <
                input role = "search"
                type = 'text'
                value = {
                  this.state.value
                }
                onChange = {
                  this.handleValueChange
                }
                /> <
                div >
                <
                ul className = "locations-list" > {
                  markers.filter(m => m.getVisible()).map((m, i) =>
                    ( < li role = "link"
                      key = {
                        i
                      }
                      tabIndex = {
                        i
                      } > {
                        m.title
                      } < /li>))
                    } < /ul> <
                    /div> <
                    /div> <
                    div role = "application"
                    className = "map"
                    ref = "map" >
                    loading map...{
                      this.state.mapError && < div className = "error" > {
                        this.state.mapError
                      } < /div>} <
                      /div> <
                      /div>)} <
                      /div>
                    )
                  }
                }