// From https://raw.githubusercontent.com/choojs/nanocomponent/master/example/leaflet.js
import html from "choo/html";
import Nanocomponent from "nanocomponent";
import nanologger from "nanologger";
import leaflet from "leaflet";
import onIdle from "on-idle";
import "leaflet/dist/leaflet.css";

class Leaflet extends Nanocomponent {
  constructor() {
    super();

    this._log = nanologger("Leaflet");
    this.map = null;
    this.mylocation = null;
  }

  createElement(mylocation) {
    this.mylocation = mylocation;
    return html`
      <div style="height: 100vh">
        <div id="map"></div>
      </div>
    `;
  }

  update(mylocation) {
    if (!this.map) return this._log.warn("missing map", "failed to update");
    if (mylocation !== this.mylocation) {
      onIdle(() => {
        this.mylocation = mylocation;
        this._log.info("update-mylocation", mylocation);

        const { latitude, longitude, accuracy } = mylocation;

        leaflet
          .marker({ lat: latitude, lng: longitude })
          .addTo(this.map)
          .bindPopup("You are here")
          .openPopup();

        leaflet
          .circle({ lat: latitude, lng: longitude }, accuracy)
          .addTo(this.map);
      });
    }
    return false;
  }

  beforerender(el) {
    this._log.info("create-map");

    const map = leaflet.map(el);

    map.locate({ setView: true, maxZoom: 16 });

    const tileLayer = leaflet.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    );

    tileLayer.addTo(map);
    this.map = map;
  }

  load() {
    this._log.info("load");
    this.map.invalidateSize();
  }

  unload() {
    this._log.info("unload");

    this.map.remove();
    this.map = null;
  }
}

export default Leaflet;
