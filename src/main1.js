let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    },
    pixelArt: true,
    scene: [new Menu(),new Tableau1(),new Fin()]

};
let game = new Phaser.Game(gameConfig);
