import html from "choo/html";
import Nanocomponent from "nanocomponent";
import nanologger from "nanologger";

class MyLocation extends Nanocomponent {
  constructor() {
    super();
    this._log = nanologger("MyLocation");
    this.watchID = undefined;
    this.callback = latlng => {
      console.log(`MyLocation - Position is not handled`, latlng);
    };
  }

  beforerender(el) {
    if ("geolocation" in navigator) {
      const updateLocation = position => {
        this._log.info("update-location", position);
        this.callback(position);
      };

      this.watchID = navigator.geolocation.watchPosition(
        position => {
          updateLocation(position.coords);
        },
        () => {
          alert("Location error");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    }
  }

  createElement(callback) {
    if (callback) {
      this.callback = callback;
    }
    return html`
      <div id="my-location">
      </div>
    `;
  }

  update() {
    return true;
  }

  unload() {
    this._log.info("unload");

    navigator.geolocation.clearWatch(this.watchID);
    this.watchID = undefined;
  }
}

export default MyLocation;
