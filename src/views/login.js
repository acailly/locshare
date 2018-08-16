import html from "choo/html";

const TITLE = "LOCSHARE - LOGIN";

export default view;

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  return html`
    <body>
      <form id="login" onsubmit=${handleSubmit}>
        <label for="username">User name</label>
        <input id="username" class="input" type="text" placeholder="Rocket Raccoon" required>
        <label for="team">Team</label>
        <input id="team" class="input" type="text" placeholder="Guardians of the Galaxy" required>
        <input class="button" type="submit" value="Show locations">
      </form>
    </body>
  `;

  function handleSubmit(e) {
    e.preventDefault();
    const username = document.forms["login"]["username"].value;
    const team = document.forms["login"]["team"].value;
    emit("username:set", username);
    emit("team:set", team);
    emit("room:enter", "acailly-locshare-" + team);
    emit("pushState", "/locshare/locations");
  }
}
