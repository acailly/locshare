import choo from "choo";
import "bulma/css/bulma.min.css";

import store from "./store";

import viewLogin from "./views/login";
import viewLocations from "./views/locations";
import view404 from "./views/404";

var app = choo();
if (process.env.NODE_ENV !== "production") {
  app.use(require("choo-devtools")());
} else {
  app.use(require("choo-service-worker")());
}

app.use(store);

app.route("/", viewLogin);
app.route("/login", viewLogin);
app.route("/locations", viewLocations);
app.route("/*", view404);

export default app.mount("body");
