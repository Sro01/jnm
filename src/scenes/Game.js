import { Scene } from "phaser";
import Main from "../main.js";
import Player from "../states/Player.js";
import Bullet from "../states/Bullet.js";
import { StateManager } from "../states/StateManager.js";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        // this.cameras.main.setBackgroundColor(0x000000);

        /** 배경 설정 */
        this.backgroundImg = this.add
            .tileSprite(0, 0, Main.config.width, Main.config.width, "snowbgImg")
            .setOrigin(0, 0)
            .setAlpha(0.5);

        // 플레이어 생성
        this.m_player = new Player(this, 100, 200, "otherPlayer");

        // StateManager 생성
        this.stateManager = new StateManager(this);

        // 서버 데이터 받기
        this.receiveServerData();

        // 키보드 입력 설정
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // HP 감소 테스트 (5초 후 실행)
        this.time.delayedCall(5000, () => {
            this.m_player.takeDamage(20);
        });

        // 마우스 클릭 시 총알 발사
        this.input.on("pointerdown", (pointer) => {
            // 총알 객체 생성
            const bullet = new Bullet(
                this,
                this.m_player.data.get("x"),
                this.m_player.data.get("y"),
                pointer.worldX,
                pointer.worldY,
                this.m_player.data.get("playerId")
            );
        });
    }

    update() {
        // 플레이어 이동 처리
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

    receiveServerData() {
        // 서버 데이터를 가정하고 업데이트
        const currentPlayerData = {
            playerId: "currentPlayer",
            x: 100,
            y: 200,
            hp: 100,
        };

        this.stateManager.updateState({
            players: {
                [currentPlayerData.playerId]: currentPlayerData,
            },
        });
    }
}

// this.input.once("pointerdown", () => {
//     this.scene.start("GameOver");
// });
