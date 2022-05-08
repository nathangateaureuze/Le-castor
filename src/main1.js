let gameConfig = {
    type: Phaser.AUTO,
    width: 800,//1920,
    height: 600,//1080,
    backgroundColor: '#000000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    },
    scene: new Tableau1(),
    debug:true

};
let game = new Phaser.Game(gameConfig);
