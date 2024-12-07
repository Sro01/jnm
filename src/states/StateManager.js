import Player from "./Player";

export class StateManager extends Phaser.Events.EventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.state = {};
        this.players = {}; // 플레이어 객체 저장
    }

    // 서버로부터 상태 업데이트
    updateState(newState) {
        this.state = { ...this.state, ...newState };

        // 플레이어 상태 처리
        Object.entries(newState.players || {}).forEach(
            ([playerId, playerState]) => {
                if (!this.players[playerId]) {
                    // 새로운 플레이어 생성
                    this.players[playerId] = new Player(
                        this.scene,
                        playerState.x,
                        playerState.y,
                        playerId,
                        playerState.hp
                    );
                } else {
                    // 기존 플레이어 상태 업데이트
                    this.players[playerId].updateState(playerState);
                }
            }
        );

        this.emit("stateUpdated", this.state); // 상태 변경 이벤트 발생
    }

    // 상태 반환
    getState() {
        return this.state;
    }
}
