export default store;

function store(state, emitter) {
  state.username = "unknown";
  state.team = "";
  state.positions = {};

  emitter.on("DOMContentLoaded", function() {
    emitter.on("username:set", function(username) {
      state.username = username;
      emitter.emit(state.events.RENDER);
    });
    emitter.on("team:set", function(team) {
      state.team = team;
      emitter.emit(state.events.RENDER);
    });
    emitter.on("myposition:set", function(position) {
      if (state.username) {
        state.positions = Object.assign({}, state.positions);
        state.positions[state.username] = position;
        emitter.emit(state.events.RENDER);
      } else {
        console.error("Username is not set, can't update my location");
      }
    });
  });
}
