import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  우리는 이 이미지를 Boot Scene에서 로드했으므로, 여기에서 표시할 수 있습니다
        this.add.image(512, 384, "background");

        //  간단한 진행 바입니다. 이것은 바의 윤곽선입니다.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  이것은 진행 바 자체입니다. 진행 상황에 따라 왼쪽에서 크기가 증가합니다.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  로더 플러그인에서 발생하는 'progress' 이벤트를 사용하여 로딩 바를 업데이트합니다
        this.load.on("progress", (progress) => {
            //  진행 바를 업데이트합니다 (우리의 바는 464px 너비이므로 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  게임 자산을 로드합니다 - 자신의 자산으로 교체하세요
        this.load.setPath("assets/");

        this.load.image("logo", "logo.png");

        this.load.image("snowbgImg", "images/snow_background.png");
        this.load.image("snowmanImg", "images/snowman.png");
        this.load.image("snowballImg", "images/snowball.png");
    }

    create() {
        //  모든 자산이 로드되면, 나머지 게임에서 사용할 수 있는 전역 객체를 여기에서 생성하는 것이 종종 유용합니다.
        //  예를 들어, 다른 씬에서 사용할 수 있도록 전역 애니메이션을 정의할 수 있습니다.

        //  MainMenu로 이동합니다. 카메라 페이드와 같은 씬 전환으로 교체할 수도 있습니다.
        this.scene.start("Game");
    }
}
