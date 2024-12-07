import Phaser from "phaser";

export default class Bullet extends Phaser.Events.EventEmitter {
    constructor(scene, x, y, targetX, targetY, bulletId, damage = 10) {
        super(); // EventEmitter 초기화
        this.scene = scene;

        // 스프라이트 생성
        this.sprite = scene.physics.add.sprite(x, y, "snowballImg");
        this.sprite.bulletId = bulletId;

        // DataManager 생성
        this.data = new Phaser.Data.DataManager(this);
        this.data.set({
            x: x,
            y: y,
            targetX: targetX,
            targetY: targetY,
            bulletId: bulletId,
            damage: damage,
        });

        // moveTo를 사용해 목표 지점으로 이동
        this.scene.physics.moveTo(this.sprite, targetX, targetY, 600);

        // 충돌 또는 일정 시간 후 제거
        this.scene.time.delayedCall(2000, () => this.destroy()); // 2초 후 제거
    }

    // 상태 업데이트
    updateState(newState) {
        this.data.merge(newState);
    }

    // 객체 제거
    destroy() {
        this.sprite.destroy();
    }
}
