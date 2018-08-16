import choo from "choo";
import "bulma/css/bulma.min.css";

import userStore from "./stores/user";
import ipfsStore from "./stores/ipfs";

import viewLogin from "./views/login";
import viewLocations from "./views/locations";
import view404 from "./views/404";

var app = choo();
if (process.env.NODE_ENV !== "production") {
  app.use(require("choo-devtools")());
}

app.use(userStore);
app.use(ipfsStore);

app.route("/locshare", viewLogin);
app.route("/locshare/login", viewLogin);
app.route("/locshare/locations", viewLocations);
app.route("/*", view404);
app.route("/locshare/*", view404);

export default app.mount("body");
