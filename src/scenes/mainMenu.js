import "../style.css";
import Phaser from "phaser";

class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("background", "/firstgame/assets/forest.jpg");
        this.load.image("playButton", "/firstgame/assets/playButton.png");
        this.load.image("playButton", "/firstgame/assets/playButton.png")
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.image(0, 0, "background").setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const playButton = this.add.text(0, -30, 'Play', {
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5).setInteractive();
        
        const homePageButton = this.add.text(0, 30, 'Home Page', {
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        const container = this.add.container(centerX, centerY, [playButton, homePageButton]);
        const background = this.add.rectangle(0, 0, 200, 120, 0x000000, 0.5);
        container.addAt(background, 0);

        playButton.on('pointerdown', () => {
            this.scene.transition({
                target: "apple-catcher-start",
                duration: 500,
                moveBelow: true,
            });
        });

        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#45a049' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#4CAF50' });
        });

        homePageButton.on('pointerdown', () => {
            window.location.href = '/index.html';
        });

        homePageButton.on('pointerover', () => {
            homePageButton.setStyle({ backgroundColor: '#45a049' });
        });

        homePageButton.on('pointerout', () => {
            homePageButton.setStyle({ backgroundColor: '#4CAF50' });
        });
    }
}

export default MainMenu;