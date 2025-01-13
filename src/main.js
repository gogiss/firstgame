import MainMenu from './scenes/mainMenu.js';
import AppleCatcherStart from './scenes/appleCatcherStart.js';
import AppleCatcher from './scenes/appleCatcher.js';

const sizes = {
    width: 500,
    height: 500,
};

const speedDown = 150;

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    scale: {
        mode: Phaser.Scale.FIT, // Scale the game while maintaining aspect ratio
    },
    canvas: gameCanvas,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: speedDown },
            debug: false,
        },
    },
    input: {
        activePointers: 1
    },
    dom: {
        createContainer: true,
    },
    scene: [MainMenu, AppleCatcherStart, AppleCatcher],
};

const game = new Phaser.Game(config);
