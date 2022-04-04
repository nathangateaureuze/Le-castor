class Tableau1 extends Phaser.Scene{

    preload()
    {
        this.load.image('background', 'assets/tiled/images/background.png');
        this.load.image('spike', 'assets/tiled/images/spike.png');
        // At last image must be loaded with its JSON
        this.load.atlas('player', 'assets/tiled/images/kenney_player.png','assets/tiled/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tiled/tilesets/platformPack_tilesheet.png');
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/tiled/tilemaps/test.json');
    }

    create()
    {
        const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
        backgroundImage.setScale(2, 0.8);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');

        const platforms = map.createStaticLayer('Calque de Tuiles 1', tileset);

        this.inputs();
    }

    //position objet
    inputs()
    {
        let me=this;

        //touches enfoncées
        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    console.log("DROITE ENFONCÉE :o")
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    console.log("GAUCHE ENFONCÉE :o")
                    break;
            }
        });

        //touches relâchées
        this.input.keyboard.on('keyup', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    console.log("DROITE RELÂCHÉE :o")
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    console.log("GAUCHE RELÂCHÉE :o")
                    break;
            }
        });
    }

    update()
    {
    }
}
