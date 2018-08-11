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

    this._log = nanologger("leaflet");
    this.map = null; // capture leaflet
    this.coords = [0, 0]; // null island
  }

  createElement(coords) {
    this.coords = coords;
    return html`
      <div style="height: 100vh">
        <div id="map"></div>
      </div>
    `;
  }

  update() {
    if (!this.map) return this._log.warn("missing map", "failed to update");
    if (coords[0] !== this.coords[0] || coords[1] !== this.coords[1]) {
      const self = this;
      onIdle(function() {
        self.coords = coords;
        self._log.info("update-map", coords);
        self.map.setView(coords, 12);
      });
    }
    return false;
  }

  beforerender(el) {
    const coords = this.coords;
    this._log.info("create-map", coords);

    const map = leaflet.map(el).setView(coords, 12);

    const tileLayer = L.tileLayer(
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
    this.coords = [0, 0];
  }
}

export default Leaflet;
