import Phaser from "phaser";

export default class Player extends Phaser.Events.EventEmitter {
    constructor(scene, x, y, playerId, hp = 100, speed = 10) {
        super(); // EventEmitter 초기화
        this.scene = scene;
        this.playerId = playerId;

        // 스프라이트 생성
        this.player = scene.physics.add.sprite(x, y, "snowmanImg");
        // this.sprite.playerId = playerId;

        // DataManager 생성
        this.data = new Phaser.Data.DataManager(this);
        this.data.set({
            x: x,
            y: y,
            hp: hp,
            speed: speed,
            playerId: playerId,
        });

        // HP 텍스트 표시
        this.hpText = scene.add
            .text(x, y - 30, `HP: ${hp}`, {
                font: "16px Arial",
                fill: "#ff0000",
            })
            .setOrigin(0.5);

        // 데이터 변경 이벤트 리스너
        this.data.events.on("changedata", this.syncWithSprite, this);
    }

    // 상태 동기화
    syncWithSprite(parent, key, value) {
        if (key === "x" || key === "y") {
            this.player.setPosition(this.data.get("x"), this.data.get("y"));
            this.hpText.setPosition(
                this.data.get("x"),
                this.data.get("y") - 20
            );
        } else if (key === "hp") {
            this.hpText.setText(`HP: ${value}`);
        }
    }

    // 플레이어 상태 업데이트
    updateState(newState) {
        this.data.merge(newState); // 상태 병합
    }

    // 이동 처리
    move(direction) {
        const speed = this.data.get("speed");
        if (direction === "left") {
            this.data.set("x", this.data.get("x") - speed);
        } else if (direction === "right") {
            this.data.set("x", this.data.get("x") + speed);
        } else if (direction === "up") {
            this.data.set("y", this.data.get("y") - speed);
        } else if (direction === "down") {
            this.data.set("y", this.data.get("y") + speed);
        }
    }

    // HP 감소 처리
    takeDamage(amount) {
        const newHp = Math.max(this.data.get("hp") - amount, 0);
        this.data.set("hp", newHp);
        if (newHp <= 0) this.destroy();
    }

    // 객체 제거
    destroy() {
        this.player.destroy();
        this.hpText.destroy();
    }
}
