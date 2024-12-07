import Phaser from "phaser";

export default class RedZone extends Phaser.Events.EventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.redZones = this.scene.physics.add.group(); // Red Zone 그룹

        // Red Zone 크기 설정
        this.zoneWidth = 100;
        this.zoneHeight = 100;
    }

    startRedZone() {
        // Red Zone 생성 타이머
        this.scene.time.addEvent({
            delay: 8000,
            loop: true,
            callback: this.prepareRedZone,
            callbackScope: this,
        });
    }

    prepareRedZone() {
        const x = Phaser.Math.Between(0, 1024 - this.zoneWidth);
        const y = Phaser.Math.Between(0, 768 - this.zoneHeight);

        // 반투명한 임시 Zone 생성
        const tempZone = this.scene.add.rectangle(
            x + this.zoneWidth / 2,
            y + this.zoneHeight / 2,
            this.zoneWidth,
            this.zoneHeight,
            0xff0000,
            0.5 // 반투명
        );

        // 깜빡이는 애니메이션
        const blinkTween = this.scene.tweens.add({
            targets: tempZone,
            alpha: { from: 0.5, to: 0.1 },
            yoyo: true,
            repeat: 5, // 3초 동안 (500ms * 6)
            duration: 300,
        });

        // 애니메이션 종료 후 Red Zone 생성
        this.scene.time.delayedCall(3000, () => {
            tempZone.destroy(); // 임시 Zone 제거
            this.createRedZone(x, y); // 최종 Red Zone 생성
        });
    }

    createRedZone(x, y) {
        const redZone = this.scene.add.rectangle(
            x + this.zoneWidth / 2,
            y + this.zoneHeight / 2,
            this.zoneWidth,
            this.zoneHeight,
            0x000000 // 최종 Red Zone 색상
        );
        this.scene.physics.add.existing(redZone);
        redZone.body.setImmovable(true);
        this.redZones.add(redZone);

        this.emit("redZoneCreated", redZone); // 생성 이벤트 방출
    }

    // 충돌 설정
    enableCollision(playerSprite, onCollision) {
        this.scene.physics.add.overlap(
            playerSprite,
            this.redZones,
            onCollision,
            null,
            this
        );
    }
}
