import Phaser from "phaser";

export default class RedZone extends Phaser.Events.EventEmitter {
    constructor(scene) {
        super();
        this.scene = scene;
        this.redZones = this.scene.physics.add.group(); // Red Zone 그룹
    }

    startRedZone() {
        // Red Zone 생성 타이머
        this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: this.createRedZone,
            callbackScope: this,
        });
    }

    createRedZone() {
        const x = Phaser.Math.Between(0, 1024 - 100);
        const y = Phaser.Math.Between(0, 768 - 100);

        const redZone = this.scene.add.rectangle(
            x + 50,
            y + 50,
            100,
            100,
            0x000000
        );
        this.scene.physics.add.existing(redZone);
        redZone.body.setImmovable(true);
        this.redZones.add(redZone);
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
