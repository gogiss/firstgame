import MainMenu from './scenes/mainMenu.js';
import AppleCatcherStart from './scenes/appleCatcherStart.js';
import AppleCatcher from './scenes/appleCatcher.js';

const speedDown = 200;
//Need to fix game resize after switching landscape/portrait

const config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
