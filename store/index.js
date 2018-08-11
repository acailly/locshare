export default store;

function store(state, emitter) {
  state.username = "";
  state.team = "";
  state.coords = [39.9526, -75.1652];

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
