import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor () {
        super('Preloader');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
    }

    init () {
        this.cameras.main.setBackgroundColor(0x33b1ff);
        const margin = 50,
            progressdBarHeight = 16;

        this.add.rectangle(margin, (this.HEIGHT - progressdBarHeight)/2, this.WIDTH - (margin * 2), progressdBarHeight)
            .setStrokeStyle(1, 0xffffff)
            .setOrigin(0, 0);
        const bar = this.add.rectangle(margin + 2, (this.HEIGHT - progressdBarHeight)/2 + 2, 50, progressdBarHeight - 4, 0xffffff)
            .setOrigin(0, 0);
        this.load.on('progress', (progress) => {
            bar.width = 4 + ((this.WIDTH - (margin * 2) - 8) * progress);
        });
    }

    preload () {
        this.load.setPath('assets');
        
        // Spritulus Logo
        this.load.svg('spritulus-logo', 'spritulus-logo.svg');

        // Pause-Play Icons
        this.load.svg('pause-icon', 'pause-icon.svg');
        this.load.svg('play-icon', 'play-icon.svg');
        
        // Game Logo
        this.load.svg('logo', 'logo.svg', {
            height: 500,
            width: 500
        });
        // Characters
        this.load.spritesheet(
            'character-tae-kwon-do-child',
            'character-tae-kwon-do-child.png',
            { frameWidth: 200, frameHeight: 200 }
        );

        // Elements
        this.load.spritesheet(
            'element-sensei-sugaku',
            'element-sensei-sugaku.png',
            { frameWidth: 200, frameHeight: 200 }
        );

        // Environments
        const dojoScale = Math.round((this.HEIGHT / 720) * 1000) / 1000;
        this.load.svg(
            'part-dojo-horizontal-gradient',
            'part-dojo-horizontal-gradient.svg',
            { width: 1280 * dojoScale, height: 720 * dojoScale }
        );

        this.load.svg(
            'part-dojo-dojo',
            'part-dojo-dojo.svg',
            { width: 1280 * dojoScale, height: 720 * dojoScale }
        );

    }

    create () {
        this.scene.start('Home');
    }
}