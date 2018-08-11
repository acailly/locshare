import html from "choo/html";
import MyLocation from "../components/MyLocation";
import Leaflet from "../components/Leaflet";

const TITLE = "LOCSHARE - LOCATIONS";

export default view;

const myLocation = new MyLocation();
const leaflet = new Leaflet();

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  const saveMyLocation = latlng => emit("mylocation:set", latlng);

  return html`
    <body>
      ${myLocation.render(saveMyLocation)}
      ${leaflet.render(state.mylocation)}
    </body>
  `;
}
