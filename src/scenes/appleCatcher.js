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
    this.player.setSize(this.cameras.main.width / 10, this.cameras.main.height / 10).setOffset(this.player.width / 10, this.player.height - this.player.height / 10).setPosition(this.cameras.main.width / 2, this.cameras.main.height - this.player.height);

    this.player.setInteractive();
    this.player.setDepth(10);
    this.input.setDraggable(this.player);

    // Dragging
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = gameObject.y;
    });

    this.target = this.physics.add.image(this.cameras.main.width / 2, 0, 'apple').setOrigin(0, 0);
    this.target.setMaxVelocity(0, this.speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(this.cameras.main.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.startTime = this.time.now;
    this.timerDuration = 30000;

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
    this.player.disableBody();
    this.time.removeAllEvents();

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Game Over text
    this.add.text(centerX, centerY - 100, 'Game Over', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ff0000',
      align: 'center',
    }).setOrigin(0.5);

    // Win/Lose Text
    // Need to add music according to win/loss
    const winLoseText = this.points >= 10 ? 'Win!' : 'Lose!';
    this.add.text(centerX, centerY - 30, `You ${winLoseText}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // Final Score Text
    this.add.text(centerX, centerY + 30, `Final Score: ${this.points}`, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    // Add button to go back to the main menu or restart
    const restartButton = this.add.text(centerX, centerY + 150, 'Restart Game', {
      fontSize: '24px',
      fontStyle: 'bold',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.setDepth(20);

    restartButton.on('pointerdown', () => {
      this.points = 0;

      this.scene.restart('scene-game');
    });

    // Optional: Add hover effects to the button
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#45a049' });
    });

    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#4CAF50' });
    });
  }
}

export default AppleCatcher;