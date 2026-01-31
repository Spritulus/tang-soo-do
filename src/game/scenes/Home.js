import { Scene } from 'phaser';

export class Home extends Scene {
    constructor () {
        super('Home');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
        };
        this.gameSpeed = 3;
        this.didCreateAnims = false;
    }

    init () {
        this.characters = [
            {
                key: 'tae-kwon-do-child',
                name: 'Tae Kwon Do Child'
            }
        ];
    }

    preload () {
        this.createAnims();
    }

    create () {
        this.createEnvironment();
        
        this.cameras.main.setBackgroundColor(0x33b1ff);
        this.createMenu();
        this.createLogo();
    }

    createEnvironment() {
        this.bgLayer0 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-dojo-horizontal-gradient').setOrigin(0, 0);
        this.bgLayer1 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-dojo-dojo').setOrigin(0, 0);
    }

    update (time, delta) { 
    }
    

    createMenu () {
        const options = [
            {
                text: 'Start Game',
                onClick: () => {
                    this.scene.start('level1', this.characters[0]);
                }
            }
        ];

        this.menu?.destroy && this.menu.destroy();
        this.menu = this.add.container(this.WIDTH / 2, this.HEIGHT / 2 - 70);
        this.menu.add(this.getMenuItems(options));
        this.menu.setPosition(this.WIDTH / 2, (this.HEIGHT - this.menu.height) / 2);
    }

    getMenuItems (options) {
        const menuItems = [
                this.add.image(0, -72, 'logo').setOrigin(0.5)
            ],
            scene = this;

        let index = 0;

        for (const option of options) {
            const button = scene.add.text(0, 80 + index * 70, option.text, this.TEXT_STYLE).setOrigin(0.5).setInteractive();
            button.on('pointerdown', option.onClick);
            menuItems.push(button);
            index++;
        }
        
        return menuItems;
    }

    

    createLogo () {
        this.spritulusLogoContainer = this.add.container();
        this.spritulusLogo = this.add.image(0, 0, 'spritulus-logo').setScale(0.5);
        this.spritulusText = this.add.text(16, this.HEIGHT - 32, 'Made with Spritulus', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff'
        });
        this.spritulusLogo.setPosition(16 + (this.spritulusText.width * 0.5), this.spritulusText.y - 32);
        this.spritulusLogoContainer.add(this.spritulusLogo);
        this.spritulusLogoContainer.add(this.spritulusText);
        this.spritulusLogo.setInteractive();
        this.spritulusLogo.on('pointerdown', () => {
            window.open('https://spritulus.com', '_blank');
        });
    }
        
    createAnims () {
        if (!this.didCreateAnims) {
        this.anims.create({
            key: 'tae-kwon-do-child-idle',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'tae-kwon-do-child-idle-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 35, end: 42 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'tae-kwon-do-child-move',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 24, end: 31 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'tae-kwon-do-child-move-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 59, end: 66 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'tae-kwon-do-child-jump',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 17, end: 18 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-jump-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 52, end: 53 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-fall',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 15, end: 16 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-fall-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 50, end: 51 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-take-hit',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 32, end: 34 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-take-hit-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 67, end: 69 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-attack-1',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 19, end: 23 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-attack-1-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 54, end: 58 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-death',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 8, end: 14 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'tae-kwon-do-child-death-flipped',
            frames: this.anims.generateFrameNumbers('character-tae-kwon-do-child', { start: 43, end: 49 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-idle',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'sensei-sugaku-idle-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 35, end: 42 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'sensei-sugaku-move',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 24, end: 31 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'sensei-sugaku-move-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 59, end: 66 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'sensei-sugaku-jump',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 17, end: 18 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-jump-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 52, end: 53 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-fall',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 15, end: 16 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-fall-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 50, end: 51 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-attack-1',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 19, end: 23 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-attack-1-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 54, end: 58 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-take-hit',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 32, end: 34 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-take-hit-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 67, end: 69 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-death',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 8, end: 14 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sensei-sugaku-death-flipped',
            frames: this.anims.generateFrameNumbers('element-sensei-sugaku', { start: 43, end: 49 }),
            frameRate: 8,
            repeat: 0
        });
            this.didCreateAnims = true;
        }
    }
}