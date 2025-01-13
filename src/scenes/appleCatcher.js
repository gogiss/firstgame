import "../style.css";
import Phaser from "phaser";

class AppleCatcher extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }

  preload() {
    this.load.image('bg', '/firstgame/assets/bg.png');
    this.load.image('basket', '/firstgame/assets/basket.png');
    this.load.image('apple', '/firstgame/assets/apple.png');
    this.load.image('money', '/firstgame/assets/money.png');
    this.load.audio('coin', '/firstgame/assets/coin.mp3');
    this.load.audio('bgMusic', '/firstgame/assets/bgMusic.mp3');
  }

  create() {
    this.coinMusic = this.sound.add('coin');
    this.bgMusic = this.sound.add('bgMusic');
    this.bgMusic.play();

    this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.speedDown = this.cameras.main.height / 2;
    this.playerSpeed = this.cameras.main.width / 1.8;
    this.player = this.physics.add.sprite(0, 0, 'basket').setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setPosition(this.cameras.main.width / 2, this.cameras.main.height);

    const scale = Math.max(this.cameras.main.width / this.player.width * 0.1, this.cameras.main.height / this.player.height * 0.1);
    this.player.setScale(scale);

    this.player.setInteractive();
    this.player.setDepth(10);
    this.input.setDraggable(this.player);

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = gameObject.y;
    });

    this.target = this.physics.add.image(this.cameras.main.width / 2, 0, 'apple').setOrigin(0, 0);
    this.target.setMaxVelocity(0, this.speedDown);
    this.target.setScale(scale);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();

    const cameraHeight = this.cameras.main.height;
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: `${Math.round(cameraHeight * 0.05)}px Arial`,
      fill: "#000000",
    });
    this.textScore = this.add.text(10, this.textTime.y + this.textTime.height + 10, "Score: 0", {
      font: `${Math.round(cameraHeight * 0.05)}px Arial`,
      fill: "#000000",
    });

    this.startTime = this.time.now;
    this.timerDuration = 10000;

    this.emitter = this.add.particles(0, 0, 'money', {
      speed: 100,
      gravityY: this.speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  update() {
    const elapsedTime = this.time.now - this.startTime;
    this.remainingTime = Math.max(0, this.timerDuration - elapsedTime);
    this.textTime.setText(`Remaining Time: ${Math.ceil(this.remainingTime / 1000)} seconds`);
    if (this.remainingTime <= 0) {
      this.gameOver();
    }

    if (this.target.y >= this.cameras.main.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * this.cameras.main.width * 0.9);
  }

  targetHit() {
    this.coinMusic.play();
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver() {
    this.target.destroy(true);
    this.input.removeAllListeners();
    this.input.setDraggable(this.player, false);
    this.player.disableBody();
    this.time.removeAllEvents();

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    
    // Define container dimensions dynamically
    const containerWidth = cameraWidth * 0.8; // 80% of the screen width
    const containerHeight = cameraHeight * 0.6; // 60% of the screen height
    
    // Add a semi-transparent background to the container
    const background = this.add.rectangle(0, 0, containerWidth, containerHeight, 0x000000, 0.5).setOrigin(0.5);
    
    // Text styles and positioning
    const textStyle = {
      fontSize: `${Math.round(cameraHeight * 0.05)}px`, // 5% of screen height for font size
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    };
    
    const gameEndTitleText = this.add.text(0, -containerHeight * 0.4, 'Game Ended', {
      ...textStyle,
      fontSize: `${Math.round(cameraHeight * 0.06)}px`, // Slightly larger font for the title
    }).setOrigin(0.5);
    
    const winLoseText = this.add.text(0, -containerHeight * 0.2, `You ${this.points >= 10 ? 'Win!' : 'Lose!'}`, textStyle).setOrigin(0.5);
    
    const finalScoreText = this.add.text(0, 0, `Final Score: ${this.points}`, textStyle).setOrigin(0.5);
    
    // Button styles
    const buttonStyle = {
      fontSize: `${Math.round(cameraHeight * 0.04)}px`, // Button font size (4% of screen height)
      fontStyle: 'bold',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: cameraWidth * 0.02, y: cameraHeight * 0.01 }, // Dynamic padding
      align: 'center',
    };
    
    const restartButton = this.add.text(0, containerHeight * 0.2, 'Restart Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    
    restartButton.on('pointerdown', () => {
      this.bgMusic.destroy();
      this.points = 0;
      this.scene.restart('scene-game');
    });
    
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#45a049' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#4CAF50' });
    });
    
    const backToMainMenuButton = this.add.text(0, containerHeight * 0.35, 'To Game Select', buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    
    backToMainMenuButton.on('pointerdown', () => {
      this.bgMusic.destroy();
      this.points = 0;

      this.scene.stop('scene-game');
      this.scene.start('MainMenu');
    });
    
    backToMainMenuButton.on('pointerover', () => {
      backToMainMenuButton.setStyle({ backgroundColor: '#45a049' });
    });
    
    backToMainMenuButton.on('pointerout', () => {
      backToMainMenuButton.setStyle({ backgroundColor: '#4CAF50' });
    });
    
    // Create container and add all elements
    const container = this.add.container(centerX, centerY, [
      background,
      gameEndTitleText,
      winLoseText,
      finalScoreText,
      restartButton,
      backToMainMenuButton,
    ]);
    
    // Scale the container to fit the screen
    container.setSize(containerWidth, containerHeight);
    container.setDepth(15);
  }
}

export default AppleCatcher;