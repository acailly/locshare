import Fingerprint2 from "fingerprintjs2";

export default store;

function store(state, emitter) {
  state.username = "unknown";
  state.team = "";
  state.positions = {};

  //Compute the default username
  new Fingerprint2().get(function(result) {
    console.log("DEBUG Default username (by fingerprinting) is", result);
    state.username = result;
  });

  emitter.on("DOMContentLoaded", function() {
    emitter.on("username:set", function(username) {
      state.username = username;
      emitter.emit(state.events.RENDER);
    });
    emitter.on("team:set", function(team) {
      state.team = team;
      emitter.emit(state.events.RENDER);
    });
  });
}
