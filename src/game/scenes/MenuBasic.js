import { Scene } from 'phaser';
import { VirtualJoystick } from 'phaser-virtual-joystick';

export class MenuBasic extends Scene {
    constructor () {
        super('MenuBasic');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
        };
        // 1v1 Fight UI Constants
        this.MARGIN_INNER = 3;
        this.HEALTH_BAR_HEIGHT_OUTER = 20;
        this.MARGIN_OUTER = 16;
        this.FONT_SIZE = 28;
        this.HEALTH_BAR_HEIGHT_INNER = this.HEALTH_BAR_HEIGHT_OUTER - (this.MARGIN_INNER * 2);
        this.HEALTH_BAR_WIDTH_OUTER = (this.WIDTH - (this.MARGIN_OUTER * 4) - 100) / 2;
        this.HEALTH_BAR_WIDTH_INNER = this.HEALTH_BAR_WIDTH_OUTER - (this.MARGIN_INNER * 2);
    }

    preload () {
    }

    create () {
        this.createMobileControls();
    }

    update () {
        this.joystick?.update();
    }

    initWithParentScene (parentScene) {
        this.parentScene = parentScene;
        this.gameStatus = 'Ready';
    }

    // Game Control Methods
    stopGame (status) {
        this.gameStatus = status;
        if (this.pauseButton?.active) {
            this.pauseButton.setTexture('play-icon');
        }
        this.displayMenu();
        this.removePauseButton();
    }

    restartGame () {
        this.menu?.destroy && this.menu.destroy();
        if (this.pauseButton?.active) {
            this.pauseButton.setTexture('pause-icon');
        }
        this.parentScene.restartGame();
    }

    pauseGame () {
        this.gameStatus = 'Paused';
        if (this.pauseButton?.active) {
            this.pauseButton.setTexture('play-icon');
        }
        this.displayMenu();
        this.parentScene.pauseGame();
    }

    unpauseGame () {
        this.gameStatus = 'Playing';
        this.menu?.destroy && this.menu.destroy();
        if (this.pauseButton?.active) {
            this.pauseButton.setTexture('pause-icon');
        }
        this.parentScene.unpauseGame();
    }
    
    // Menu Overlay
    displayMenu () {
        const buttons = [
            { text: 'Restart Game', onClick: () => this.restartGame() },
            { text: 'Exit to Main Menu', onClick: () => {
                this.menu.destroy();
                this.scene.stop();
                this.parentScene.scene.start('Home');
            }}
        ];

        if (this.gameStatus === 'Paused') {
            buttons.unshift({ text: 'Continue Game', onClick: () => this.unpauseGame() });
        }

        this.menu?.destroy && this.menu.destroy();
        this.menu = this.add.container(this.WIDTH / 2, this.HEIGHT / 2 - 70);
        this.menu.add(this.getMenuItems(this.gameStatus, buttons));
    }

    getMenuItems (title, buttons) {
        const menuItems = [this.add.text(0, -32, title, {
                ...this.TEXT_STYLE,
                fontSize: 64
            }).setOrigin(0.5)],
            scene = this;

        let index = 0;

        for (const buttonInfo of buttons) {
            const button = scene.add.text(0, 50 + index * 70, buttonInfo.text, this.TEXT_STYLE).setOrigin(0.5).setInteractive();
            button.on('pointerdown', buttonInfo.onClick);
            menuItems.push(button);
            index++;
        }
        
        return menuItems;
    }
    
    // Pause-Play Button 
    createPauseButton () {
        this.removePauseButton();

        this.circleBackground = this.add.circle(40, 40, 32, 0x000000).setAlpha(0.6);
        this.pauseButton = this.add.image(40, 40, 'pause-icon').setScale(0.33);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => {
            if (this.parentScene.physics.world.isPaused) {
                this.gameStatus === 'Paused' ? this.unpauseGame() : this.restartGame();
            } else {
                this.pauseGame();
            }
        });
    }

    removePauseButton () {
        this.pauseButton && this.pauseButton.destroy();
        this.circleBackground && this.circleBackground.destroy();
    }

    // Updates Status Display in 1v1 Fight
    updateStatusDisplay (text) {
        this.statusDisplay?.active && this.statusDisplay.setText(text);
    }
    
    
    // 1v1 Fight UI
    createStatusDisplay (initialText = '') {
        this.statusDisplay = this.add.text(this.WIDTH / 2, this.MARGIN_OUTER / 4, initialText, {
            ...this.TEXT_STYLE
        }).setOrigin(0.5, 0);
        this.statusDisplay.setInteractive();
        this.statusDisplay.on('pointerdown', () => {
            if (this.parentScene.isGameRunning) {
                this.parentScene.physics.world.isPaused ? this.unpauseGame() : this.pauseGame();
            }
        });
    }
        
    createHealthBars (playerName = 'Player', enemyName = 'Enemy') {
        this.playerNameText = this.add.text(this.MARGIN_OUTER, this.MARGIN_OUTER + this.HEALTH_BAR_HEIGHT_OUTER + 5, playerName, {
            ...this.TEXT_STYLE, fontSize: this.FONT_SIZE
        }).setOrigin(0, 0);
        this.enemyNameText = this.add.text(this.WIDTH - this.MARGIN_OUTER, this.MARGIN_OUTER + this.HEALTH_BAR_HEIGHT_OUTER + 5, enemyName, {
            ...this.TEXT_STYLE, fontSize: this.FONT_SIZE
        }).setOrigin(1, 0);
        this.playerHealthBarBorder = this.add.rectangle(this.MARGIN_OUTER, this.MARGIN_OUTER, this.HEALTH_BAR_WIDTH_OUTER, this.HEALTH_BAR_HEIGHT_OUTER, 0xffffff).setOrigin(0, 0).setStrokeStyle(2, 0x000000);
        this.playerHealthBar = this.add.rectangle(this.MARGIN_OUTER + this.MARGIN_INNER, this.MARGIN_OUTER + this.MARGIN_INNER, this.HEALTH_BAR_WIDTH_INNER, this.HEALTH_BAR_HEIGHT_INNER, 0xff0000).setOrigin(0, 0);
        this.enemyHealthBarBorder = this.add.rectangle(this.WIDTH - this.HEALTH_BAR_WIDTH_OUTER - this.MARGIN_OUTER, this.MARGIN_OUTER, this.HEALTH_BAR_WIDTH_OUTER, this.HEALTH_BAR_HEIGHT_OUTER, 0xffffff).setOrigin(0, 0).setStrokeStyle(2, 0x000000);
        this.enemyHealthBar = this.add.rectangle(this.WIDTH - this.HEALTH_BAR_WIDTH_OUTER - this.MARGIN_OUTER + this.MARGIN_INNER, this.MARGIN_OUTER + this.MARGIN_INNER, this.HEALTH_BAR_WIDTH_INNER, this.HEALTH_BAR_HEIGHT_INNER, 0xff0000).setOrigin(0, 0);
    }

    animateHealthBar (healthBar, newWidth) {
        this.tweens.add({
            targets: healthBar,
            width: newWidth,
            duration: 100
        });
    }

    updateHealthBars (playerHealth, enemyHealth) {
        const widthInner = this.HEALTH_BAR_WIDTH_INNER / this.cameras.main.zoom,
            newPlayerWidth = widthInner* (playerHealth / 100),
            newEnemyWidth = widthInner * (enemyHealth / 100);

        this.animateHealthBar(this.playerHealthBar, newPlayerWidth);
        this.animateHealthBar(this.enemyHealthBar, newEnemyWidth);
    }

    // Mobile Controls
    createMobileControls () {
        if (!this.parentScene.updateMobileCursor) return;

        if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
            this.joystick = new VirtualJoystick({
                scene: this,
                enableWithoutTouch: true,
                baseArea: {
                    fillColor: 0x888888,
                    strokeColor: 0x000000,
                },
                stick: {
                    fillColor: 0x888888,
                    strokeColor: 0x000000,
                },
                deadZone: {
                    fillColor: 0x888888,
                    strokeColor: 0x000000
                }
            });

            this.add.existing(this.joystick);
            this.joystick.on('press', () => {
                console.log('Joystick pressed');
            });
            this.joystick.on('release', () => {
                this.parentScene.updateMobileCursor();
            });
            this.joystick.on('move', (data) => {
                if (data.y < -0.6 && Math.abs(data.x) < 0.4) {
                    this.parentScene.updateMobileCursor('up', true);
                } else {
                    this.parentScene.updateMobileCursor('up', false);
                }
                    
                if (data.x > 0.4) {
                    this.parentScene.updateMobileCursor('right', true);
                } else {
                    this.parentScene.updateMobileCursor('right', false);
                }

                if (data.x < -0.4) {
                    this.parentScene.updateMobileCursor('left', true);
                } else {
                    this.parentScene.updateMobileCursor('left', false);
                }

                if (data.y > 0.6 && Math.abs(data.x) < 0.4) {
                    this.parentScene.updateMobileCursor('down', true);
                } else {
                    this.parentScene.updateMobileCursor('down', false);
                }
            });

            this.upperButton = this.add.rectangle(this.WIDTH/2, 0, this.WIDTH/2, this.HEIGHT/2, 0x000000, 0).setOrigin(0, 0).setInteractive();
            this.upperButton.on('pointerdown', (data) => {
                this.touchCircle = this.add.circle(data.x, data.y, 64, 0xffffff, 0.5);
                this.tweens.add({
                    targets: this.touchCircle,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.touchCircle.destroy();
                    }
                });
                this.parentScene.handleMobileActionButton(true);
            });
            this.upperButton.on('pointerup', () => {
                this.parentScene.handleMobileActionButton(false);
            });

            this.lowerButton = this.add.rectangle(this.WIDTH/2, this.HEIGHT/2, this.WIDTH/2, this.HEIGHT/2, 0x000000, 0).setOrigin(0, 0).setInteractive();
            this.lowerButton.on('pointerdown', (data) => {
                this.touchCircle = this.add.circle(data.x, data.y, 64, 0xffffff, 0.5);
                this.tweens.add({
                    targets: this.touchCircle,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.touchCircle.destroy();
                    }
                });
                this.parentScene.handleMobileActionButtonSecondary(true);
            });
            this.lowerButton.on('pointerup', () => {
                this.parentScene.handleMobileActionButtonSecondary(false);
            });
        }
    }
}