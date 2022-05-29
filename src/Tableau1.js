class Tableau1 extends Phaser.Scene{

    preload()
    {
        //images
        this.load.image('castor', 'assets/tiled/images/marchestatic.png');

        for (var i = 0; i < 3;i++)
        {
            this.load.image('glouton'+i, 'assets/tiled/images/petit glouton/glouton ptit'+(i+2)+'.png');
        }

        this.load.image('glaise', 'assets/tiled/images/glaise.png');
        this.load.image('baton', 'assets/tiled/images/baton.png');

        this.load.image('branche', 'assets/tiled/images/branche.png');

        this.load.image('vide', 'assets/tiled/images/vide.png');
        this.load.image('ciel', 'assets/tiled/images/ciel.png');

        //tiled json map
        this.load.tilemapTiledJSON('map', 'assets/tiled/tilemaps/level1.json');

        //tileset png
        this.load.image('tileset','assets/tiled/tilesets/tileset_foret.png');
    }

    create()
    {
        let me = this;

        this.sautage = false;
        this.danseau = false;
        this.danssurface = false;

        this.checkpointY = 100;
        this.checkpointX = 100;

        this.baton = 0;
        this.glaise = 0;

        this.anims.create({
            key: 'glouton',
            frames: [
                {key:'glouton0'},
                {key:'glouton1'},
                {key:'glouton2'},
            ],
            frameRate: 8,
            repeat: -1
        });
        // this.bganimation.play('bg-animation');

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset_foret', 'tileset');

        const fond = map.createLayer('fond', tileset, 0, 0);
        const nuage = map.createLayer('nuage', tileset, 0, 0);
        const foret_fond = map.createLayer('foret_fond', tileset, 0, 0);
        const foret_clair = map.createLayer('foret_clair', tileset, 0, 0);
        const foret_foncee = map.createLayer('foret_foncee', tileset, 0, 0);
        const arbre = map.createLayer('arbre', tileset, 0, 0);

        this.player = this.physics.add.sprite(6671, 685, 'castor');

        this.collision_sol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('collision_sol').objects.forEach((sol) => {
            this.collision_sol_boup = this.collision_sol.create(sol.x, sol.y,"vide").setOrigin(0).setDisplaySize(sol.width,sol.height);
        });

        map.getObjectLayer('glouton').objects.forEach((mechant) => {
            this.glouton = this.physics.add.sprite(mechant.x, mechant.y, 'glouton0');
            this.glouton.play('glouton');
            this.direction = false;
            this.physics.add.collider(this.glouton, this.collision_sol);
            this.physics.add.collider(this.glouton, this.player,function ()
            {
                me.respawn();
            });
            this.physics.add.collider(this.crocs, this.glouton,function (crocs , glouton)
            {
                glouton.destroy();
                if (Phaser.Math.Between(0, 1))
                {
                    me.objet_bois = me.physics.add.sprite(glouton.x, glouton.y-glouton.height,"baton").setOrigin(0);
                    me.physics.add.collider(me.collision_sol,me.objet_bois);
                    me.physics.add.collider(me.player, me.objet_bois,function (player,baton)
                    {
                        if (baton.body.onFloor())
                        {
                            me.baton += 1;
                            baton.destroy();
                        }
                    });
                }
                else
                {
                    me.objet_glaise = me.physics.add.sprite(glouton.x, glouton.y-glouton.height,"glaise").setOrigin(0);
                    me.physics.add.collider(me.collision_sol,me.objet_glaise);
                    me.physics.add.collider(me.player, me.objet_glaise,function (player,glaise)
                    {
                        if (glaise.body.onFloor())
                        {
                            me.glaise += 1;
                            glaise.destroy();
                        }
                    });
                }
            });

            this.tweens.add({
                targets: this.glouton,
                duration: 2000,
                x: this.glouton.x - 130,
                delay: 550,
                ease: 'Power1',
                repeat: -1,
                yoyo: true,
                onYoyo: function () { me.glouton.setFlipX(me.direction); me.direction === true ? me.direction = false : me.direction = true; },
                onRepeat: function () { me.glouton.setFlipX(me.direction); me.direction === true ? me.direction = false : me.direction = true; }
            });
        });

        this.collision_arbre = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('collision_arbre').objects.forEach((arbre) => {
            this.collision_arbre_boup = this.collision_arbre.create(arbre.x, arbre.y,"vide").setOrigin(0).setDisplaySize(arbre.width,arbre.height);
        });

        this.overlap_eau = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('overlap_eau').objects.forEach((eau) => {
            this.overlap_eau_boup = this.overlap_eau.create(eau.x, eau.y,"vide").setOrigin(0).setDisplaySize(eau.width,eau.height);
        });

        this.overlap_eau_surface = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('overlap_eau_surface').objects.forEach((eau) => {
            this.overlap_eau_surface_boup = this.overlap_eau_surface.create(eau.x, eau.y,"vide").setOrigin(0).setDisplaySize(eau.width,eau.height);
        });

        this.checkpoint = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('checkpoint').objects.forEach((point) => {
            this.checkpoint_boup = this.checkpoint.create(point.x, point.y,"vide").setOrigin(0).setDisplaySize(point.width,point.height);
        });

        this.branche = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('branche').objects.forEach((baton) => {
            this.branche_boup = this.branche.create(baton.x, baton.y-baton.height,"branche").setOrigin(0).setDisplaySize(baton.width,baton.height);
        });

        this.pique = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('pique').objects.forEach((aie) => {
            this.pique_boup = this.pique.create(aie.x, aie.y,"vide").setOrigin(0).setDisplaySize(aie.width,aie.height);
        });

        this.objet_glaise = this.physics.add.group({
            allowGravity: true,
            immovable: false
        });
        map.getObjectLayer('glaise').objects.forEach((glaise) => {
            this.glaise_boup = this.objet_glaise.create(glaise.x, glaise.y,"glaise").setOrigin(0);
        });
        this.physics.add.collider(this.collision_sol,this.objet_glaise);

        this.physics.add.overlap(this.player, this.checkpoint,function ()
        {
            me.checkpointX = me.player.x;
            me.checkpointY = me.player.y;
        });

        this.physics.add.collider(this.player, this.collision_sol);
        this.physics.add.collider(this.player, this.collision_arbre);
        this.physics.add.collider(this.player, this.pique,function ()
        {
            me.respawn();
        });
        this.physics.add.collider(this.player, this.objet_glaise,function (player,glaise)
        {
            me.glaise += 1;
            glaise.destroy();
        });

        this.crocs = this.physics.add.sprite(100, 100, "aze");
        this.crocs.body.setAllowGravity(false);
        this.crocs.setDepth(1);
        this.crocs.setVisible(false);
        this.crocs.attack = 100;
        this.crocs.disableBody();
        this.physics.add.collider(this.crocs, this.branche,function (crocs , branche)
        {
            branche.destroy();
            me.objet_bois = me.physics.add.sprite(branche.x, branche.y-branche.height,"baton").setOrigin(0);
            me.physics.add.collider(me.collision_sol,me.objet_bois);
            me.physics.add.collider(me.player, me.objet_bois,function (player,baton)
            {
                if (baton.body.onFloor())
                {
                    me.baton += 1;
                    baton.destroy();
                }
            });
        });

        const sol = map.createLayer('sol', tileset, 0, 0);
        const eau = map.createLayer('eau', tileset, 0, 0);

        // sol.scrollFactorX = 1;
        // eau.scrollFactorX = 1;
        // arbre.scrollFactorX = 0.99;
        // foret_foncee.scrollFactorX = 0.89;;
        // foret_clair.scrollFactorX = 0.79;
        // foret_fond.scrollFactorX = 1;
        //
        // nuage.scrollFactorX = 0.29;
        // nuage.scrollFactorY = 0.29;
        // fond.scrollFactorX = 0.4;
        // fond.scrollFactorY = 0.4;

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);
        this.cameras.main.setRoundPixels(false);
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
                        if (me.player.body.onFloor())
                        {
                        }
                    }
                    else
                    {
                        me.player.setVelocityX(160);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    if (me.danseau == false)
                    {
                        me.player.setVelocityX(-200);
                        if (me.player.body.onFloor()) {
                        }
                    }
                    else
                    {
                        me.player.setVelocityX(-160);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(-160);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(160);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    if (me.player.body.onFloor() || me.sautage == true || me.danssurface == true) {
                        me.sautage = false;
                        me.player.setVelocityY(-400);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    if(me.player.body.onFloor())
                    {
                        me.crocs.setVisible(true);
                        me.crocs.enableBody()
                        me.time.addEvent({
                            delay: 250, callback: function () {
                                me.crocs.disableBody()
                                me.crocs.setVisible(false);
                            }, callbackScope: me
                        });
                        break;
                    }
                default:
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
                    me.player.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
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
                case Phaser.Input.Keyboard.KeyCodes.X:
                    if(me.player.body.onFloor())
                    {
                        me.sautage = true;
                        me.player.setVelocityY(-350);

                        me.crocs.setVisible(true);
                        me.crocs.enableBody()
                        me.time.addEvent({ delay: 250, callback: function (){
                                me.crocs.disableBody()
                                me.crocs.setVisible(false);
                                me.player.setVelocityY(0);
                            }, callbackScope: me });
                    }
                    break;
                default:
                    break;
            }
        });
    }


    update()
    {
        for (var i = 0; i < this.collision_arbre.getChildren().length;i++)
        {
            if (this.collision_arbre.getChildren()[i].y > this.player.y)
            {
                this.collision_arbre.getChildren()[i].body.enable = true;
            }
            else
            {
                this.collision_arbre.getChildren()[i].body.enable = false;
            }
        }

        this.danseau = this.physics.overlap(this.player, this.overlap_eau) ? true : false;
        this.danssurface = this.physics.overlap(this.player, this.overlap_eau_surface) ? true : false;
        if (this.danssurface == true)
        {
             this.player.setGravityY(-100);
        }
        else
        {
            if (this.danseau == true)
            {
                this.player.setGravityY(-550);
            }
            else
            {
                this.player.setGravityY(981);
            }
        }

        this.crocs.y = this.player.y;
        if (this.player.body.velocity.x > 0)
        {
            this.crocs.x = this.player.x+20;
            this.player.setFlipX(false);
        }
        else if (this.player.body.velocity.x < 0)
        {
            this.crocs.x = this.player.x-20;
            this.player.setFlipX(true);
        }
    }
}
