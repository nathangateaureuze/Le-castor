let gameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 981 }
        }
    },
    scene: new Tableau1(),
};
let game = new Phaser.Game(gameConfig);
