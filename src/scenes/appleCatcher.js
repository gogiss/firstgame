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
    this.player.setSize(this.cameras.main.width / 10, this.cameras.main.height / 10)
      .setOffset(this.player.width / 10, this.player.height - this.player.height / 10)
      .setPosition(this.cameras.main.width / 2, this.cameras.main.height);

    this.player.setInteractive();
    this.player.setDepth(10);
    this.input.setDraggable(this.player);

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = gameObject.y;
    });

    this.target = this.physics.add.image(this.cameras.main.width / 2, 0, 'apple').setOrigin(0, 0);
    this.target.setMaxVelocity(0, this.speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();
    
    //Need to make font sizes match screen size
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
    this.input.removeAllListeners();
    this.input.setDraggable(this.player, false);
    this.player.disableBody();
    this.time.removeAllEvents();

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const gameEndTitleText = this.add.text(0, -100, 'Game Ended', {
      fontSize: '48px',
      fontStyle: 'bold',
      // color: '#ff0000',
      align: 'center',
    }).setOrigin(0.5);

    // Need to add music according to win/loss
    const winLoseText = this.add.text(0, -30, `You ${this.points >= 10 ? 'Win!' : 'Lose!'}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    const finalScoreText = this.add.text(0, 30, `Final Score: ${this.points}`, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    const restartButton = this.add.text(0, 150, 'Restart Game', {
      fontSize: '24px',
      fontStyle: 'bold',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    restartButton.setDepth(20);

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

    const backToMainMenuButton = this.add.text(0, 200, 'To Game Select', {
      fontSize: '24px',
      fontStyle: 'bold',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    backToMainMenuButton.setDepth(20);

    backToMainMenuButton.on('pointerdown', () => {
      this.bgMusic.destroy();
      this.points = 0;

      this.scene.start('MainMenu');
      this.scene.stop();
    });
    
    backToMainMenuButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#45a049' });
    });

    backToMainMenuButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#4CAF50' });
    });

    const container = this.add.container(centerX, centerY, [gameEndTitleText, winLoseText, finalScoreText, restartButton, backToMainMenuButton]);
    const background = this.add.rectangle(0, 0, this.cameras.main.width * 0.25, this.cameras.main.height * 0.75, 0x000000, 0.5);
    container.addAt(background, 0);
    container.setDepth(15);
  }
}

export default AppleCatcher;