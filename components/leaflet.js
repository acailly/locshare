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
    this.positions = null;
    this.circles = {};
  }

  createElement(positions) {
    this.positions = positions;
    return html`
      <div style="height: 100vh">
        <div id="map"></div>
      </div>
    `;
  }

  update(positions) {
    if (!this.map) return this._log.warn("missing map", "failed to update");
    if (positions !== this.positions) {
      onIdle(() => {
        this.positions = positions;
        this._log.info("update-myposition", positions);

        const usernames = Object.keys(positions);

        usernames.forEach(username => {
          const { latitude, longitude, accuracy } = positions[username];

          const circle = leaflet
            .circle({ lat: latitude, lng: longitude }, accuracy / 2.0)
            .addTo(this.map);

          if (this.circles[username]) {
            this.map.removeLayer(this.circles[username]);
          }
          this.circles[username] = circle;

          circle.bindPopup(username).openPopup();
        });
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
    this.positions = null;
  }
}

export default Leaflet;
