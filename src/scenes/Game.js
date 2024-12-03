import { Scene } from "phaser";
import Main from "../main.js";
import Player from "../states/Player.js";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        /** 배경 설정 */
        this.backgroundImg = this.add
            .tileSprite(0, 0, Main.config.width, Main.config.width, "snowbgImg")
            .setOrigin(0, 0)
            .setAlpha(0.5);

        // 플레이어 생성
        this.player = new Player(this, 100, 200, "player1");

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
            this.player.takeDamage(20);
        });

        this.input.once("pointerdown", () => {
            this.scene.start("GameOver");
        });
    }

    update() {
        // 플레이어 이동 처리
        if (this.cursors.left.isDown) {
            this.player.move("left");
        }
        if (this.cursors.right.isDown) {
            this.player.move("right");
        }
        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }
    }
}
