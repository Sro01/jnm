import Player from "./Player";

export class StateManager extends Phaser.Events.EventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.state = new Phaser.Data.DataManager(scene);
        this.state.set({
            players: {},
        });

        // this.startServerSync();
    }

    addPlayer(player) {
        const playerId = player.data.get("playerId");
        this.state.get("players")[playerId] = player.data.getAll();

        // Player의 상태 변경 이벤트를 StateManager에 연결
        player.on("changedata", (parent, key, value) => {
            this.state.get("players")[playerId][key] = value;
            this.emit("stateUpdated", this.state.getAll());
        });
    }

    addOtherPlayer(playerData) {
        const playerId = playerData.playerId;
        const players = this.state.get("players");

        if (!players[playerId]) {
            players[playerId] = playerData;
            this.emit("playerAdded", playerData); // 이벤트 방출
        }
    }

    updateState() {}

    // Convert the state to JSON and send it to the server
    syncWithServer() {
        const stateJSON = JSON.stringify(this.state.getAll()); // Convert to JSON
        console.log(stateJSON);
        // this.socket.emit("syncState", stateJSON); // Send to server
    }

    // Start server synchronization loop
    startServerSync() {
        this.scene.time.addEvent({
            delay: 1000 / 60, // 60fps
            loop: true,
            callback: () => this.syncWithServer(),
        });
    }
}
