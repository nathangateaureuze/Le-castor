class Tableau1 extends Phaser.Scene{

    preload()
    {

        //fond
        this.load.image('background', 'assets/tiled/images/background.png');

        //piques
        this.load.image('spike', 'assets/tiled/images/spike.png');
        this.load.image('saw', 'assets/tiled/images/saw.png');
        this.load.image('checkpoints', 'assets/tiled/images/checkpoints.png');
        this.load.image('ressources', 'assets/tiled/images/ressources.png');
        this.load.image('branches', 'assets/tiled/images/branches.png');

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
        this.sautage = false;
        this.danseau = false;
        this.danssurface = false;
        this.materiaux = 0;

        this.cameras.main.setRoundPixels(true);
        const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
        backgroundImage.setScale(2, 0.8);

        const map = this.make.tilemap({ key: 'map' });

        const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');

        const platforms = map.createLayer('Platforms', tileset, 0, 0);

        platforms.setCollisionByExclusion(-1, true);

        this.speciales = map.createLayer('Speciales', tileset, 0, 0);




        let me = this;
        const eau = map.createLayer('Eau', tileset, 0, 0);
        eau.setCollisionByExclusion(-1, true);


        this.barrages = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Barrage').objects.forEach((barrage) => {
            this.barrageboup = this.barrages.create(barrage.x, barrage.y-barrage.height,"saw").setOrigin(0).setDisplaySize(barrage.width,barrage.height);
        });

        this.checkpoints = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Checkpoints').objects.forEach((checkpoint) => {
            this.checkpointboup = this.checkpoints.create(checkpoint.x, checkpoint.y-checkpoint.height,"checkpoints").setOrigin(0).setDisplaySize(checkpoint.width,checkpoint.height);
        });

        this.branches = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Branches').objects.forEach((branche) => {
            this.brancheboup = this.branches.create(branche.x, branche.y-branche.height,"branches").setOrigin(0).setDisplaySize(branche.width,branche.height);
        });

        this.ressources = this.physics.add.group({
            allowGravity: true,
            immovable: true
        });
        this.physics.add.collider(this.ressources, platforms);
        this.physics.add.collider(this.ressources, this.speciales);
        map.getObjectLayer('Ressources').objects.forEach((ressource) => {
            this.ressourceboup = this.ressources.create(ressource.x, ressource.y-ressource.height,"ressources").setOrigin(0).setDisplaySize(ressource.width,ressource.height);
        });

        this.constructeurs = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Constructeur').objects.forEach((constructeur) => {
            this.constructeurboup = this.constructeurs.create(constructeur.x, constructeur.y-constructeur.height,"ressources").setOrigin(0).setDisplaySize(constructeur.width,constructeur.height);
        });


        this.eaus = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Eauo').objects.forEach((eauo) => {
            this.eauoo = this.eaus.create(eauo.x, eauo.y).setOrigin(0).setDisplaySize(eauo.width,eauo.height);
            //this.eauoo.visible = false ;
        });


        this.eauss = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Surface').objects.forEach((eauos) => {
            this.eausoo = this.eauss.create(eauos.x, eauos.y).setOrigin(0).setDisplaySize(eauos.width,eauos.height);
            //this.eausoo.visible = false ;
        });

        this.player = this.physics.add.sprite(3000, 100, 'player');

        this.checkpointY = 100;
        this.checkpointX = 100;
        this.physics.add.overlap(this.player, this.checkpoints,function ()
        {
            me.checkpointX = me.player.x;
            me.checkpointY = me.player.y;
        });

        this.physics.add.collider(this.player, this.ressources,function (joueur , ressource)
        {
            me.materiaux += 1 ;
            ressource.destroy();
        });
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, this.speciales);
        this.physics.add.collider(this.player, this.barrages,function ()
        {
            me.respawn();
        });
        this.physics.add.overlap(this.player, this.constructeurs,function ()
        {
            if (me.materiaux >= 1)
            {
                me.materiaux -= 1;
                const ponts = map.createLayer('Ponts', tileset, 0, 0);
                ponts.setCollisionByExclusion(-1, true);
                me.physics.add.collider(me.player, ponts);
            }
        });
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

        this.sword = this.physics.add.sprite(100, 100, "saw");
        this.sword.body.setAllowGravity(false);
        this.sword.setDepth(1);
        this.sword.setVisible(false);
        this.sword.attack = 100;
        this.sword.disableBody();
        this.physics.add.collider(this.sword, this.branches,function (crocs , branche)
        {
            me.ressourceboup = me.ressources.create(branche.x, branche.y-branche.height,"ressources").setOrigin(0)
            me.materiaux += 1 ;
            branche.destroy();
        });

        this.physics.add.overlap(this.player, this.eaus);
        //this.physics.add.overlap(this.player, this.eauss);


        this.cameras.main.startFollow(this.player);
        this.cameras.main.setRoundPixels(true);
        this.inputs();
    }

    respawn()
    {
        this.player.setPosition(this.checkpointX,this.checkpointY);
    }

    //position objet
    inputs()
    {
        let me = this;

        //touches enfoncées
        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    if (me.danseau == false)
                    {
                        me.player.setVelocityX(200);
                        if (me.player.body.onFloor()) {
                            me.player.play('walk', true);
                        }
                    }
                    else
                    {
                        me.player.setVelocityX(300);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    if (me.danseau == false)
                    {
                        me.player.setVelocityX(-200);
                        if (me.player.body.onFloor()) {
                            me.player.play('walk', true);
                        }
                    }
                    else
                    {
                        me.player.setVelocityX(-300);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(-300);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(300);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    if (me.player.body.onFloor() || me.sautage == true || me.danssurface == true) {
                        me.sautage = false;
                        me.player.setVelocityY(-650);
                        me.player.play('jump', true);
                    }
                    break;
                default:
                    me.player.play('idle', true);
                    me.player.setVelocityX(0);
                    break;
            }
        });

        //touches relâchées
        this.input.keyboard.on('keyup', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    me.player.play('idle', true);
                    me.player.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    me.player.play('idle', true);
                    me.player.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(25);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(25);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.sword.setVisible(true);
                    me.sword.enableBody()
                    me.time.addEvent({ delay: 250, callback: function (){
                            me.sword.disableBody()
                            me.sword.setVisible(false);
                        }, callbackScope: me });
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    if(me.player.body.onFloor())
                    {
                        me.sautage = true;
                        me.player.setVelocityY(-850);

                        me.sword.setVisible(true);
                        me.sword.enableBody()
                        me.time.addEvent({ delay: 250, callback: function (){
                                me.sword.disableBody()
                                me.sword.setVisible(false);
                                me.player.setVelocityY(0);
                            }, callbackScope: me });
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.player.play('idle', true);
                    me.player.setVelocityX(0);
                    break;
                default:
                    me.player.play('idle', true);
                    me.player.setVelocityX(0);
                    break;
            }
        });
    }


    update()
    {
        if (this.player.body.velocity.y > 0)
        {
            this.speciales.setCollisionByExclusion(-1, true);
        }
        else
        {
            this.speciales.setCollisionByExclusion(-1, false);
        }

        this.danseau = this.physics.overlap(this.player, this.eaus) ? true : false;
        this.danssurface = this.physics.overlap(this.player, this.eauss) ? true : false;
        console.log(this.player.gravityY);
        if (this.danssurface == true)
        {
            this.player.setGravityY(-100);
        }
        else
        {
            if (this.danseau == true)
            {
                this.player.setGravityY(-1000);
            }
            else
            {
                this.player.setGravityY(981);
            }
        }

        this.sword.y = this.player.y;
        if (this.player.body.velocity.x > 0)
        {
            this.sword.x = this.player.x+20;
            this.player.setFlipX(false);
        }
        else if (this.player.body.velocity.x < 0)
        {
            this.sword.x = this.player.x-20;
            this.player.setFlipX(true);
        }
    }
}
