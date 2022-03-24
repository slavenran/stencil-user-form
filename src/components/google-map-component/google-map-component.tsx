import { h, Component, Prop } from "@stencil/core";
import { Geolocation } from '@capacitor/geolocation';

@Component({
  tag: 'google-map-component',
  styleUrl: 'google-map-component.scss',
  shadow: true
})
export class GoogleMapComponent {
  
  @Prop() apiKey: string;

  public map: any;
  private mapElement: HTMLElement;

  render() {
    return <div ref={(el) => this.mapElement = el as HTMLElement} id='google-map-container'></div>;
  }

  componentDidLoad() {
    this.init().then(() => {
      console.log("Google Maps ready.")
    }, (err) => {
      console.log(err);
    });
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.injectSDK().then(() => {
        this.initMap().then(() => {
          resolve(true);
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  injectSDK(): Promise<any> {
    return new Promise((resolve) => {
      window['mapInit'] = () => {
        resolve(true);
      }
      let script = document.createElement('script');
      script.id = 'googleMaps';
      if(this.apiKey){
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }
      document.body.appendChild(script);
    });
  }

  initMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15
        };
        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);
      }, () => {
        reject('Could not initialise map');
      });
    });
  }
}