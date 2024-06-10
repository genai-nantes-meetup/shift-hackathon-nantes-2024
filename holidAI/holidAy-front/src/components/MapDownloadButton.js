import React from 'react';
import logo from "../assets/logo.png"


class MapDownloadButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mapUrl: ''
      };
    }
  
    generateMapUrl = () => {
      const { latitude, longitude, zoom, size } = this.props;
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${size}&key=${API_KEY}`;
      this.setState({ mapUrl });
    }
  
    downloadMap = () => {
      this.generateMapUrl();
      const link = document.createElement('a');
      link.href = this.state.mapUrl;
      link.download = 'map.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  
    render() {
      return (
        <div>
          <button onClick={this.downloadMap}>Download Map</button>
        </div>
      );
    }
  }
  
  export default MapDownloadButton;