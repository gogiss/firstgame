import "../style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 150;

class AppleCatcher extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
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

    this.add.image(0, 0, 'bg').setOrigin(0, 0);

    this.player = this.physics.add.sprite(0, sizes.height - 100, 'basket').setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6).setOffset(this.player.width / 10, this.player.height - this.player.height / 10);

    this.player.setInteractive();
    this.player.setDepth(10);
    this.input.setDraggable(this.player);

    // Dragging
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = gameObject.y;
    });

    this.target = this.physics.add.image(0, 0, 'apple').setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    this.emitter = this.add.particles(0, 0, 'money', {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${this.remainingTime.toPrecision(3)}`);

    if (this.target.y >= sizes.height) {
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
    return Math.floor(Math.random() * 400);
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
    const winLoseText = this.hasWon ? 'Win!' : 'Lose!';
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

    restartButton.on('pointerdown', () => {
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