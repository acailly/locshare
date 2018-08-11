import html from "choo/html";
import Leaflet from "../components/leaflet.js";

const TITLE = "LOCSHARE - LOCATIONS";

export default view;

const leaflet = new Leaflet();

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  return html`
    <body>
      ${leaflet.render(state.coords)}
    </body>
  `;
}
