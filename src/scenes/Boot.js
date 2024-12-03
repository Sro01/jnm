import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  Boot Scene은 일반적으로 Preloader에 필요한 자산(예: 게임 로고 또는 배경)을 로드하는 데 사용됩니다.
        //  자산의 파일 크기가 작을수록 좋습니다. Boot Scene 자체에는 프리로더가 없습니다.

        this.load.image("background", "assets/bg.png");
        // this.load.image("background", "assets/images/snow_background.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}
