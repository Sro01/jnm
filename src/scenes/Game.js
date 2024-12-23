import { Scene } from "phaser";
import Main from "../main.js";
import Player from "../states/Player.js";
import Bullet from "../states/Bullet.js";
import RedZone from "../states/RedZone.js";
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

        // Red Zone 객체 생성
        this.redZone = new RedZone(this);

        this.redZone.startRedZone();

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

        this.shoot();
    }

    update() {
        // 서버 데이터 받기
        this.receiveServerData();

        // 플레이어 이동 처리
        this.moveHandler();
    }

    handleRedZoneCollision(player, redZone) {
        if (player === this.m_player.playerSprite) {
            this.m_player.takeDamage(100); // 플레이어 데미지 입음
            console.log("Player stepped on Red Zone!");
        }
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

                if (this.m_player) {
                    // 카메라 설정
                    this.cameras.main.startFollow(this.m_player.playerSprite); // 플레이어 따라가기
                    this.cameras.main.setBounds(0, 0, 1024, 768); // 맵 크기 제한
                    const zoomFactor = 1024 / 600; // 플레이어 화면 확대
                    this.cameras.main.setZoom(zoomFactor);

                    this.redZone.enableCollision(
                        this.m_player.playerSprite,
                        this.handleRedZoneCollision.bind(this)
                    );
                }
                console.log(`현재 플레이어 생성: ${playerData.playerId}`);
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
                        console.log(`다른 플레이어 생성: ${playerId}`);
                    }
                });
            }
            this.stateManager.addOtherPlayer(playerData);
        });
    }

    shoot() {
        // 마우스 입력 설정
        this.input.on("pointerdown", (pointer) => {
            if (this.m_player) {
                const { x, y } = pointer; // 클릭한 위치
                const bullet = new Bullet(
                    this,
                    this.m_player.playerSprite.x,
                    this.m_player.playerSprite.y,
                    x,
                    y,
                    this.m_player.data.get("playerId") // bulletId는 플레이어 ID
                );

                // 총알 그룹에 추가
                this.physics.add.overlap(
                    bullet.bullet,
                    this.playersGroup,
                    (bulletSprite, playerSprite) => {
                        // 충돌한 플레이어가 현재 플레이어가 아니면 처리
                        const collidedPlayer = Object.values(
                            this.otherPlayers
                        ).find(
                            (player) => player.playerSprite === playerSprite
                        );

                        if (collidedPlayer) {
                            // HP 감소
                            collidedPlayer.takeDamage(
                                bullet.data.get("damage")
                            );

                            // 총알 제거
                            bullet.destroy();
                        }
                    },
                    null,
                    this
                );
            }
        });
    }
}
