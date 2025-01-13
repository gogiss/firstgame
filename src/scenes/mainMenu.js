import "../style.css";
import Phaser from "phaser";

class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("background", "/firstgame/assets/bg.png");
        this.load.image("playButton", "/firstgame/assets/playButton.png");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.image(0, 0, "background").setOrigin(0, 0);

        // this.add.text(centerX, centerY - 200, "My Phaser Game", {
        //     font: "48px Arial",
        //     fill: "#ffffff",
        // }).setOrigin(0.5, 0.5);

        const playButton = this.add.text(centerX, centerY, 'Play', {
            fontSize: '24px',
            fontStyle: 'bold',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5).setInteractive();

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
    }
}

export default MainMenu;