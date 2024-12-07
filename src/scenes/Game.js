import { Scene } from "phaser";
import Main from "../main.js";
import Player from "../states/Player.js";
import Bullet from "../states/Bullet.js";
import { StateManager } from "../states/StateManager.js";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.otherPlayers = {}; // 다른 플레이어 저장소
    }

    create() {
        // this.cameras.main.setBackgroundColor(0x000000);

        /** 배경 설정 */
        this.backgroundImg = this.add
            .tileSprite(0, 0, Main.config.width, Main.config.width, "snowbgImg")
            .setOrigin(0, 0)
            .setAlpha(0.5);

        // StateManager 생성
        this.stateManager = new StateManager(this);

        // 키보드 입력 설정
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // 플레이어 간 충돌 방지
        this.playersGroup = this.physics.add.group();
    }

    update() {
        // 서버 데이터 받기
        this.receiveServerData();

        // 플레이어 이동 처리
        this.moveHandler();
    }

    moveHandler() {
        if (this.m_player) {
            if (this.cursors.left.isDown) {
                this.m_player.move("left");
            }
            if (this.cursors.right.isDown) {
                this.m_player.move("right");
            }
            if (this.cursors.up.isDown) {
                this.m_player.move("up");
            }
            if (this.cursors.down.isDown) {
                this.m_player.move("down");
            }
        }
    }

    receiveServerData() {
        // 서버로부터 받은 데이터 예시
        const serverPlayers = [
            {
                playerId: "player1",
                name: "currentPlayer",
                x: 100,
                y: 200,
            },
            {
                playerId: "player2",
                name: "otherPlayer",
                x: 300,
                y: 400,
            },
        ];

        serverPlayers.forEach((playerData) => {
            if (!this.m_player && playerData.playerId === "player1") {
                // 현재 플레이어 생성
                this.m_player = new Player(
                    this,
                    playerData.playerId,
                    playerData.name,
                    playerData.x,
                    playerData.y
                );
                this.playersGroup.add(this.m_player.playerSprite);
                console.log(`Current player created: ${playerData.playerId}`);
            } else {
                // 다른 플레이어 추가
                this.stateManager.on("playerAdded", (playerData) => {
                    const { playerId, name, x, y } = playerData;
                    if (playerId !== this.m_player.data.get("playerId")) {
                        const newPlayer = new Player(
                            this,
                            playerId,
                            name,
                            x,
                            y
                        );
                        this.otherPlayers[playerId] = newPlayer;

                        // 충돌 그룹에 추가
                        this.playersGroup.add(newPlayer.playerSprite);

                        // 충돌 감지 설정
                        this.physics.add.collider(
                            this.playersGroup,
                            this.playersGroup,
                            () => {
                                console.log("충돌");
                            }
                        );
                        console.log(`New player added: ${playerId}`);
                    }
                });
            }
            this.stateManager.addOtherPlayer(playerData);
        });
    }
}
