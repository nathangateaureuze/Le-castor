class Tableau1 extends Phaser.Scene{

    preload()
    {

        //fond
        this.load.image('background', 'assets/tiled/images/background.png');

        //piques
        this.load.image('spike', 'assets/tiled/images/spike.png');

        //player png assets + découpage
        this.load.atlas('player', 'assets/tiled/images/kenney_player.png','assets/tiled/images/kenney_player_atlas.json');

        //tiled png map
        this.load.image('tiles', 'assets/tiled/tilesets/platformPack_tilesheet.png');

        //tiled json map
        this.load.tilemapTiledJSON('map', 'assets/tiled/tilemaps/level1.json');

        //tileset png
        this.load.image('tileset','assets/tiled/tilesets/platformPack_tilesheet.png');
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);
        const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
        backgroundImage.setScale(2, 0.8);

        const map = this.make.tilemap({ key: 'map' });

        const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');

        const platforms = map.createLayer('Platforms', tileset, 0, 0);

        platforms.setCollisionByExclusion(-1, true);




        this.player = this.physics.add.sprite(50, 0, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'robo_player_0' }],
            frameRate: 10,
        });
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'robo_player_1' }],
            frameRate: 10,
        });
        this.cursors = this.input.keyboard.createCursorKeys();




        let me = this;
        const eau = map.createLayer('Eau', tileset, 0, 0);
        eau.setCollisionByExclusion(-1, true);

        this.eaus = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        // Let's get the spike objects, these are NOT sprites
        // We'll create eau in our sprite group for each object in our map
        map.getObjectLayer('Eauo').objects.forEach((eauo) => {
            this.eauoo = this.eaus.create(eauo.x, eauo.y).setOrigin(0).setDisplaySize(eauo.width,eauo.height);
            //this.eauoo.visible = false ;
        });
        //this.physics.add.overlap(eauo,this.player, this.dansleau.bind(this));
        this.physics.add.overlap(this.player, this.eaus,function () {
            console.log("yfrjh")
        });


        this.inputs();
    }

    dansleau()
    {
        console.log("dans l'eau");
    }


    //position objet
    inputs()
    {
        //touches enfoncées
        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    //console.log("DROITE ENFONCÉE :o")
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    //console.log("GAUCHE ENFONCÉE :o")
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
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }
}
