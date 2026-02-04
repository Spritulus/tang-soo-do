import { Scene } from 'phaser';

export class level1 extends Scene {
    constructor () {
        super('level1');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black, Sans-Serif',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
        };
        this.GROUND_LEVEL = (this.HEIGHT / 16) * 15;
        this.enemyKey = 'sensei-sugaku';
        this.enemyName = 'Sensei Sugaku';
    }

    init (data) {
        this.playerKey = data?.key;
        this.playerName = data?.name;
    }

    preload () {
        this.initVariables();
    }

    initVariables () {
        
        this.playerHealth = 100;
        this.playerIsAttacking = false;
        this.playerIsDisabled = false;
        this.playerCanTakeHit = true;

        this.enemyHealth = 100;
        this.enemyIsAttacking = false;
        this.enemyIsDisabled = false;
        this.enemyCanTakeHit = true;   

        this.enemyMoveInterval = 900;
        this.enemyLastMoveTime = 0;

        this.timeLimit = 90000;
        
    }

    create () {
        this.createEnvironment();
        this.cameras.main.setBackgroundColor(0x33b1ff);
        
        // Init Menu
        this.scene.launch('MenuBasic');
        this.menu = this.scene.get('MenuBasic');
        this.menu.initWithParentScene(this);
        
        // Set up cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Set up camera bounds
        this.cameras.main.setBounds(0, 0, this.WIDTH, this.HEIGHT);

        // Set up enemy and player
        this.createEnemy();
        this.createPlayer();
        this.anims.resumeAll();

        this.menu.createHealthBars(this.playerName, this.enemyName);
        this.menu.createStatusDisplay('');
        this.physics.add.overlap(this.enemy, this.player, () => {
            if (this.enemyIsAttacking && this.playerCanTakeHit) {
                this.playerHealth -= 10;
                this.playerIsDisabled = true;
                this.playerCanTakeHit = false;
                this.player.setVelocityX(-400 * (this.playerIsFlipped ? 1 : -1));
                this.player.setVelocityY(-600);
                this.time.delayedCall(400, () => {
                    this.player.setVelocityX(0);
                    this.playerIsDisabled = false;
                });
                this.time.delayedCall(500, () => {
                    this.playerCanTakeHit = true;
                });
                this.player.play(this.playerKey + '-take-hit' + (this.playerIsFlipped ? '-flipped' : ''), true);
                if (this.playerHealth <= 0) {
                    this.player.play(this.playerKey + '-death' + (this.playerIsFlipped ? '-flipped' : ''), true);
                }
            }
            if (this.playerIsAttacking && this.enemyCanTakeHit) {
                this.enemyHealth -= 10;
                this.enemyIsDisabled = true;
                this.enemyCanTakeHit = false;
                this.enemy.setVelocityX(-400 * (this.enemyIsFlipped ? 1 : -1));
                this.enemy.setVelocityY(-600);
                this.time.delayedCall(400, () => {
                    this.enemy.setVelocityX(0);
                    this.enemyIsDisabled = false;
                    this.makeEnemyMove(true);
                });
                this.time.delayedCall(500, () => {
                    this.enemyCanTakeHit = true;
                });
                this.enemy.play(this.enemyKey + '-take-hit' + (this.enemyIsFlipped ? '-flipped' : ''), true);
                if (this.enemyHealth <= 0) {
                    this.enemy.play(this.enemyKey + '-death' + (this.enemyIsFlipped ? '-flipped' : ''), true);
                }
            }
            this.menu.updateHealthBars(this.playerHealth, this.enemyHealth);
        });
        this.startGame();
        this.showInstructions();
    }

    

    startGame () {
        this.isGameRunning = true;
        this.anims.resumeAll();
        this.physics.resume();
    }

    showInstructions () {
        this.instructions = this.add.text(this.WIDTH / 2, this.HEIGHT / 16 * 15, this.sys.game.device.os.desktop ? 'Use the arrow keys to move and spacebar attack your opponent.' : 'Prepare to fight!', {
            ...this.TEXT_STYLE,
            fontSize: 18,
            strokeThickness: 4,
        }).setOrigin(0.5).setInteractive().setAlpha(0);
        this.tweens.add({
            targets: this.instructions,
            duration: 500,
            ease: 'Power2',
            alpha: 1,
            onComplete: () => {
                setTimeout(() => {
                    this.tweens.add({
                        targets: this.instructions,
                        duration: 500,
                        ease: 'Power2',
                        alpha: 0,
                        onComplete: () => {
                            this.instructions.destroy();
                        }
                    });
                }, 4000);
            }
        });
    }

    update (time, delta) { 
        const playerXMin = this.player.body.offset.x * -1,
            playerXMax = this.WIDTH - this.player.body.offset.x - this.player.body.width,
            enemyXMin = this.enemy.body.offset.x * -1,
            enemyXMax = this.WIDTH - this.enemy.body.offset.x - this.enemy.body.width;

        this.playerIsFlipped = this.player.body.position.x < this.enemy.body.position.x;
        this.enemyIsFlipped = !this.playerIsFlipped ;

        // Time Limit
        if (this.isGameRunning) {
            this.timeLimit -= this.isGameRunning ? delta : 0;
            if (this.timeLimit <= 0) {
                this.timeLimit = 0;
                this.stopGame('Time Up!');
            }
            this.menu.updateStatusDisplay(Math.floor(this.timeLimit/1000));
        }

        // Player Movement
        if (this.isGameRunning && this.isGameRunning && !this.playerIsDisabled && !this.playerIsAttacking && this.playerHealth > 0) {
            if (!this.playerIsDisabled) this.player.body.setVelocityX(0);
            if (this.cursors.left.isDown) {
                this.player.body.setVelocityX(-200);
            } else if (this.cursors.right.isDown) {
                this.player.body.setVelocityX(200);
            }
        }

        // Player Jump
        if ((this.cursors.up.isDown) && this.player.body.onFloor() && this.isGameRunning && !this.playerIsDisabled && this.playerHealth > 0) {
            this.player.body.setVelocityY(-1600);
        }

        // Enemy AI
        this.enemyLastMoveTime += delta;
        if (this.isGameRunning && (this.enemyLastMoveTime > this.enemyMoveInterval)) {
            this.makeEnemyMove();
        }
        // Keep characters within bounds
        if (this.player.x < playerXMin) {
            this.player.setPosition(playerXMin, this.player.y);
        } else if (this.player.x > playerXMax) {
            this.player.setPosition(playerXMax, this.player.y);
        }

        if (this.enemy.x < enemyXMin) {
            this.enemy.setPosition(enemyXMin, this.player.y);
        } else if (this.enemy.x > enemyXMax) {
            this.enemy.setPosition(enemyXMax, this.player.y);
        }

        // Keep enemy above ground - Fixes glitch where enemy can fall through ground
        if (this.enemy.y - this.enemy.body.height - this.enemy.body.offset.y >= this.GROUND_LEVEL) {
            this.enemy.y = this.GROUND_LEVEL;
        }

        // Player Default Animation
        if (!this.playerIsAttacking && !this.playerIsDisabled && this.playerHealth > 0) {
            if (this.player.body.onFloor()) {
                if (Math.abs(this.player.body.velocity.x) > 0) {
                    this.player.play(this.playerKey + '-move' + (this.playerIsFlipped ? '-flipped' : ''), true);
                } else {
                    this.player.play(this.playerKey + '-idle' + (this.playerIsFlipped ? '-flipped' : ''), true);
                }
            } else {
                this.player.play(this.playerKey + '-jump' + (this.playerIsFlipped ? '-flipped' : ''), true);
            }
        }

        // Enemy Default Animation
        if (!this.enemyIsAttacking && !this.enemyIsDisabled && this.enemyHealth > 0) {
            if (this.enemy.body.onFloor()) {
                if (Math.abs(this.enemy.body.velocity.x) > 0) {
                    this.enemy.play(this.enemyKey + '-move' + (this.enemyIsFlipped ? '-flipped' : ''), true);
                } else {
                    this.enemy.play(this.enemyKey + '-idle' + (this.enemyIsFlipped ? '-flipped' : ''), true);
                }
            } else {
                this.enemy.play(this.enemyKey + '-jump' + (this.enemyIsFlipped ? '-flipped' : ''), true);
            }
        }

        this.updateZoom();

        // Check for Game Over
        if (this.isGameRunning) {
            if (this.player.y > this.HEIGHT + 100 || this.playerHealth <= 0) {
                this.stopGame(this.enemyHealth === 100 ? 'Complete loss!' : 'You lose!');
                this.menu.updateStatusDisplay('KO');
            } else if (this.enemyHealth <= 0) { 
                this.stopGame(this.playerHealth === 100 ? 'Perfect win!' : 'You win!');
                this.menu.updateStatusDisplay('KO');
            }
        }
    }
    
    stopGame (status) {
        this.isGameRunning = false;
        this.menu.stopGame(status);
    }

    restartGame () {
        
        this.initVariables();
        this.menu.updateHealthBars(this.playerHealth, this.enemyHealth);
        this.player.setPosition(200, this.GROUND_LEVEL - this.player.body.offset.y - this.player.body.height);
        this.enemy.setPosition(this.WIDTH - 400, this.GROUND_LEVEL - this.enemy.body.offset.y - this.enemy.body.height);
        this.player.setVelocityY(0);
        this.player.play(this.playerKey + '-move-flipped', true);
        this.physics.resume();
        this.anims.resumeAll();
        this.startGame();
    }

    pauseGame () {
        this.isGameRunning = false;
        
        this.physics.pause();
        this.anims.pauseAll();
    }

    unpauseGame () {
        this.isGameRunning = true;

        this.physics.resume();
        this.anims.resumeAll();
    }

    createEnvironment() {
        this.belowGround = this.add.rectangle(0, this.GROUND_LEVEL, this.WIDTH, this.HEIGHT / 16, '0x000000').setOrigin(0, 0).setAlpha(0);
        this.physics.add.existing(this.belowGround);
        this.belowGround.body.setImmovable();
        this.bgLayer0 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-dojo-horizontal-gradient').setOrigin(0, 0);
        this.bgLayer1 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-dojo-dojo').setOrigin(0, 0);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(200, this.GROUND_LEVEL - 58 - 123, 'sprite-' + this.playerKey).setGravityY(5000).setOrigin(0, 1);
        this.player.setSize(68, 123, true).setOffset(66, 58);
        this.playerIsFlipped = true;
        this.player.play(this.playerKey + '-idle' + (this.playerIsFlipped ? '-flipped' : ''), true);
        this.cameras.main.startFollow(this.player);
        this.physics.add.collider(this.player, this.belowGround);
        this.player.on('animationcomplete', () => {
            if (this.playerHealth > 0) {
                this.player.play(this.playerKey + '-idle' + (this.playerIsFlipped ? '-flipped' : ''), true);
            }
        });

        this.spaceBar.on('down', () => {
            if (this.isGameRunning && !this.playerIsDisabled && !this.playerIsAttacking && this.playerHealth > 0) {
                this.playerIsAttacking = true;
                this.playerIsDisabled = false;
                this.player.setVelocityX(100 * (this.playerIsFlipped ? 1 : -1));
                this.player.play(this.playerKey + '-attack-1' + (this.playerIsFlipped ? '-flipped' : ''), true);
                this.time.delayedCall(250, () => {
                    this.player.setVelocityX(0);
                    this.playerIsAttacking = false;
                });
                this.time.delayedCall(300, () => {
                    this.playerIsDisabled = false;
                });
            }
        });
    }

    
    createEnemy () {
        this.enemy = this.physics.add.sprite(this.WIDTH - 400, this.HEIGHT / 2, 'element-' + this.enemyKey).setGravityY(5000).setOrigin(0, 1);
        this.enemy.setSize(69, 154, true).setOffset(65, 27);
        this.enemyIsFlipped = false;
        this.enemy.play(this.enemyKey + '-idle' + (this.enemyIsFlipped ? '-flipped' : ''), true);
        this.physics.add.collider(this.enemy, this.belowGround);

        this.enemy.on('animationcomplete', () => {
            if (this.enemyHealth > 0) {
                this.enemy.play(this.enemyKey + '-idle' + (this.enemyIsFlipped ? '-flipped' : ''), true);
            }
        });
    }

    updateZoom () {
        const playerX = this.player.body.position.x,
            enemyX = this.enemy.body.position.x;
        
        let newZoomLevel;
        
        if (Math.abs(playerX - enemyX) < 300 && playerX > 200 && playerX < this.WIDTH - 200) {
            if (this.cameras.main.zoom !== 1.08) {
                newZoomLevel = 1.08;
            }
        } else if (Math.abs(playerX - enemyX) > 700) {
            if (this.cameras.main.zoom !== 1) {
                newZoomLevel = 1;
            }
        } else if (this.cameras.main.zoom !== 1.04) {
            newZoomLevel = 1.04;
        }

        if (newZoomLevel) {
            this.cameras.main.zoomTo(newZoomLevel, 500);
        }
    }
        
    makeEnemyMove (forceAttack = false) {
        if (!this.isGameRunning || this.enemyHealth <= 0) return;

        this.enemyLastMoveTime = 0;
        
        if ((forceAttack || Phaser.Math.Between(0, 5) < 3) && !this.enemyIsAttacking && !this.enemyIsDisabled) {
            // Attack
            this.enemyIsAttacking = true;
            this.enemy.setVelocityX(100 * (this.enemyIsFlipped ? 1 : -1));
            this.enemy.play(this.enemyKey + '-attack-1' + (this.enemyIsFlipped ? '-flipped' : ''), true);
            this.time.delayedCall(300, () => {
                this.enemyIsAttacking = false;
                if (!this.enemyIsDisabled) this.enemy.setVelocityX(0);
            });
        }
        
        if (Phaser.Math.Between(0, 1) === 0) {
            // Move
            this.enemy.setVelocityX(300 * (this.enemy.body.position.x > this.WIDTH * 0.5 ? -1 : 1));
            this.time.delayedCall(Phaser.Math.Between(300, 900), () => {
                this.enemy.setVelocityX(0);
            });
        }
        
        if (Phaser.Math.Between(0, 3) === 0 && this.enemy.body.onFloor() && !this.enemyIsDisabled) {
            // Jump
            this.enemy.setVelocityY(-1600);

            this.enemy.setVelocityX(300 * (this.enemy.body.position.x > this.WIDTH * 0.5 ? -1 : 1));
            this.time.delayedCall(Phaser.Math.Between(300, 900), () => {
                this.enemy.setVelocityX(0);
            });
        }
    }

    // Mobile Controls Handlers
    updateMobileCursor (key, isDown) {
        if (key) {
            this.cursors[key].isDown = isDown;
        } else {
            this.cursors.left.isDown = false;
            this.cursors.right.isDown = false;
            this.cursors.up.isDown = false;
            this.cursors.down.isDown = false;
        }
    }

    handleMobileActionButton (isDown) {
        if (isDown) {
            this.spaceBar.emit('down');
        } else {
            this.spaceBar.emit('up');
        }
    }

    handleMobileActionButtonSecondary (isDown) {
        if (isDown) {
            this.spaceBar.emit('down');
        } else {
            this.spaceBar.emit('up');
        }
    }
}