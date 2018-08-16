import Y from "yjs";
import yMemory from "y-memory";
import yIpfs from "y-ipfs-connector";
import yArray from "y-array";
import yMap from "y-map";

Y.extend(yArray, yIpfs, yMemory, yMap);

export default store;

function store(state, emitter) {
  initIpfsStore(state, emitter);
}

function initIpfsStore(state, emitter) {
  console.log("Initializing IPFS...");
  var repo = "ipfs/acailly-locshare/" + Math.random();

  var ipfs = new window.Ipfs({
    repo: repo,
    EXPERIMENTAL: {
      pubsub: true
    }
  });

  ipfs.on("error", err => {
    console.error(err);
  });

  ipfs.on("ready", () => {
    console.log("IPFS node is ready, getting the id...");

    ipfs.id((err, info) => {
      if (err) {
        throw err;
      }

      console.log("IPFS node ready with address " + info.id);

      ipfs.id((err, peerId) => {
        if (err) {
          throw err;
        }

        console.log("Peer ID is:", peerId);

        window.peerId = peerId;

        Y({
          db: {
            name: "memory"
          },
          connector: {
            name: "ipfs",
            room: "acailly-locshare",
            ipfs: ipfs
          },
          share: {
            positions: "Map"
          }
        }).then(function(y) {
          y.share.positions.observe(event => {
            state.positions = {};
            const users = y.share.positions.keys();
            users.forEach(user => {
              const userPosition = y.share.positions.get(user);
              console.log("DEBUG updated user position is", user, userPosition); //TODO ACY
              state.positions[user] = userPosition;
            });
            emitter.emit(state.events.RENDER);
          });

          emitter.on("myposition:set", function(position) {
            if (state.username) {
              console.log("Updating position of", state.username); //TODO ACY
              y.share.positions.set(state.username, position);
            } else {
              console.error("Username is not set, can't update my location");
            }
          });
        });
      });
    });
  });
}
