import Phaser from "phaser";

export default class Bullet extends Phaser.Events.EventEmitter {
    constructor(scene, x, y, targetX, targetY, bulletId, damage = 10) {
        super(); // EventEmitter 초기화
        this.scene = scene;

        // 스프라이트 생성
        this.bullet = scene.physics.add.sprite(x, y, "snowballImg");
        this.bullet.bulletId = bulletId;

        // DataManager 생성
        this.data = new Phaser.Data.DataManager(this);
        this.data.set({
            x: x,
            y: y,
            targetX: targetX,
            targetY: targetY,
            bulletId: bulletId,
            damage: damage,
            speed: 700,
        });

        // moveTo를 사용해 목표 지점으로 이동
        this.scene.physics.moveTo(
            this.bullet,
            // data에서 값을 가져와서 인자로 할당
            this.data.get("targetX"),
            this.data.get("targetY"),
            this.data.get("speed")
        );

        // 충돌 또는 일정 시간 후 제거
        this.scene.time.delayedCall(1000, () => this.destroy()); // 2초 후 제거
    }

    // 객체 제거
    destroy() {
        this.bullet.destroy();
    }
}
