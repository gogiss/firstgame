import "../style.css";
import Phaser from "phaser";

class AppleCatcherStart extends Phaser.Scene {
  constructor() {
    super("apple-catcher-start");
  }

  preload() {
    this.load.image('bg', '/firstgame/assets/bg.png');
    this.load.audio('bgMusic', '/firstgame/assets/bgMusic.mp3');
  }

  create() {
    this.bgMusic = this.sound.add('bgMusic');
    this.bgMusic.play();

    this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Position and add text elements (H1 and paragraph equivalents)
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Title text
    this.add.text(centerX, centerY - 100, 'Apple Catcher', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    // Description text
    this.add.text(centerX, centerY - 50, 'You have 30 seconds to catch apples!', {
      fontSize: '20px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY, 'If you catch more than 10 apples you win.', {
      fontSize: '20px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 50, 'If you catch less than 10 apples you lose.', {
      fontSize: '20px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 100, 'Click the start button to begin', {
      fontSize: '20px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    // Create a start button (using a text object for simplicity)
    const startButton = this.add.text(centerX, centerY + 150, 'Start', {
      fontSize: '24px',
      fontStyle: 'bold',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    startButton.on('pointerdown', () => {
      this.bgMusic.destroy();

      this.scene.start('scene-game');
    });

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#45a049' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#4CAF50' });
    });
  }

  update() {
  }
}

export default AppleCatcherStart;