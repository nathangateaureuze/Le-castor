class Tableau1 extends Phaser.Scene{

    constructor() {
        super("Tableau1");
    }

    preload()
    {
        //images
        for (var i = 0; i < 3;i++)
        {
            this.load.image('glouton'+i, 'assets/tiled/images/petit glouton/glouton ptit'+(i+2)+'.png');
        }

        for (var i = 0; i < 5;i++)
        {
            this.load.image('ponton'+i, 'assets/tiled/images/petit barrage/ponton'+i+'.png');
        }

        for (var i = 0; i < 4;i++)
        {
            this.load.image('barrage_destruction'+i, 'assets/tiled/images/grand barrage/destruction/destruction barrage'+(i+1)+'.png');
        }

        for (var i = 0; i < 4;i++)
        {
            this.load.image('barrage'+i, 'assets/tiled/images/grand barrage/detruit/grand barrage'+(i+1)+'.png');
        }

        for (var i = 1; i <= 6;i++)
        {
            this.load.image('castor_idle'+i, 'assets/tiled/images/castor/idle/idle'+i+'.png');
        }
        for (var i = 1; i <= 5;i++)
        {
            this.load.image('castor_marche'+i, 'assets/tiled/images/castor/marche/marche'+i+'.png');
        }
        for (var i = 1; i <= 6;i++)
        {
            this.load.image('castor_nage'+i, 'assets/tiled/images/castor/nage/nage'+i+'.png');
        }
        for (var i = 1; i <= 3;i++)
        {
            this.load.image('castor_crocs'+i, 'assets/tiled/images/castor/crocs/crocation'+i+'.png');
        }
        this.load.image('saut_bas', 'assets/tiled/images/castor/saut bas.png');
        this.load.image('saut_haut', 'assets/tiled/images/castor/saut haut.png');

        this.load.image('glaise', 'assets/tiled/images/glaise.png');
        this.load.image('baton', 'assets/tiled/images/baton.png');

        this.load.image('branche', 'assets/tiled/images/branche.png');

        this.load.image('vide', 'assets/tiled/images/vide.png');
        this.load.image('ciel', 'assets/tiled/images/ciel.png');

        this.load.image('info_1', 'assets/tiled/images/infos/info_1.png');
        this.load.image('info_1_incomplete', 'assets/tiled/images/infos/info_1_incomplète.png');
        this.load.image('info_2', 'assets/tiled/images/infos/info_2.png');
        this.load.image('info_2_incomplete', 'assets/tiled/images/infos/info_2_incomplète.png');
        this.load.image('info_finale', 'assets/tiled/images/infos/info_finale.png');
        this.load.image('info_finale_incomplete', 'assets/tiled/images/infos/info_finale_incomplète.png');

        //tiled json map
        this.load.tilemapTiledJSON('map', 'assets/tiled/tilemaps/level1.json');

        //tileset png
        this.load.image('tileset','assets/tiled/tilesets/tileset_foret.png');
    }

    create()
    {
        let me = this;

        this.cinematique = false;
        this.fin = false;

        this.sautage = false;
        this.kangouroux = false;
        this.crocance = false;
        this.croquette = false;
        this.constructage = false;
        this.danseau = false;
        this.danssurface = false;

        this.overlap_info_1 = false;
        this.overlap_info_2 = false;
        this.overlap_info_finale = false;

        this.checkpointY = 100;
        this.checkpointX = 100;

        this.baton = 50;
        this.glaise = 50;

        this.anims.create({
            key: 'castor_idle',
            frames: [
                {key:'castor_idle1'},
                {key:'castor_idle2'},
                {key:'castor_idle3'},
                {key:'castor_idle4'},
                {key:'castor_idle5'},
                {key:'castor_idle6'}
            ],
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'castor_marche',
            frames: [
                {key:'castor_marche1'},
                {key:'castor_marche2'},
                {key:'castor_marche3'},
                {key:'castor_marche4'},
                {key:'castor_marche5'}
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'castor_nage',
            frames: [
                {key:'castor_nage1'},
                {key:'castor_nage2'},
                {key:'castor_nage3'},
                {key:'castor_nage4'},
                {key:'castor_nage5'},
                {key:'castor_nage6'}
            ],
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'castor_crocs',
            frames: [
                {key:'castor_crocs1'},
                {key:'castor_crocs2'},
                {key:'castor_crocs3'}
            ],
            frameRate: 6,
            repeat: 0,
        });

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

        this.anims.create({
            key: 'barrage',
            frames: [
                {key:'barrage0'},
                {key:'barrage1'},
                {key:'barrage2'},
                {key:'barrage3'}
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'barrage_destruction',
            frames: [
                {key:'barrage_destruction0'},
                {key:'barrage_destruction1'},
                {key:'barrage_destruction2'},
                {key:'barrage_destruction3'}
            ],
            frameRate: 4,
            repeat: 0
        });

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset_foret', 'tileset');

        const fond = map.createLayer('fond', tileset, 0, 0);
        const nuage = map.createLayer('nuage', tileset, 0, 0);

        map.getObjectLayer('barrage_final').objects.forEach((barrage) => {
            this.grand_barrage = this.add.sprite(barrage.x,barrage.y,'barrage_destruction0').setOrigin(0,0);
        });
        this.infos_barrage_final = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('info_barrage_final').objects.forEach((info) => {
            this.info_barrage_final = this.infos_barrage_final.create(info.x, info.y,"vide").setOrigin(0).setDisplaySize(info.width,info.height);
        });
        map.getObjectLayer('details_final').objects.forEach((details) => {
            this.details_barrage_final = this.add.sprite(details.x, details.y,"info_finale_incomplete").setOrigin(0);
            this.details_barrage_final.setVisible(false);
        });

        const foret_fond = map.createLayer('foret_fond', tileset, 0, 0);
        const foret_clair = map.createLayer('foret_clair', tileset, 0, 0);
        const foret_foncee = map.createLayer('foret_foncee', tileset, 0, 0);
        const arbre = map.createLayer('arbre', tileset, 0, 0);

        const sol = map.createLayer('sol', tileset, 0, 0);

        this.player = this.physics.add.sprite(10000, 300, 'castor_idle1').setOrigin(0);
        this.player.setSize(64,32);
        this.player.setOffset(0,32);

        this.collision_sol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('collision_sol').objects.forEach((sol) => {
            this.collision_sol_boup = this.collision_sol.create(sol.x, sol.y,"vide").setOrigin(0).setDisplaySize(sol.width,sol.height);
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

        this.crocs = this.physics.add.sprite(100, 100, "vide").setDisplaySize(32,32);
        this.crocs.body.setAllowGravity(false);
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


        this.gloutons = this.physics.add.group({
            allowGravity: true,
            immovable: false
        });
        map.getObjectLayer('glouton').objects.forEach((mechant) => {
            this.glouton = this.physics.add.sprite(mechant.x, mechant.y, 'glouton0');
            this.glouton.play('glouton');
            this.physics.add.collider(this.glouton, this.collision_sol);
            this.physics.add.collider(this.glouton, this.player,function ()
            {
                me.player.velocity = 0;
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
            this.gloutons.add(this.glouton);
            this.tweens.add({
                targets: this.glouton,
                duration: 3500,
                x: this.glouton.x - 200,
                delay: 550,
                ease: 'Power1',
                repeat: -1,
                yoyo: true,
                onYoyo: function () { me.glouton.setFlipX(false); },
                onRepeat: function () { me.glouton.setFlipX(true); }
            });
        });
        this.gloutons_top = this.physics.add.group({
        allowGravity: true,
        immovable: false
        });
        map.getObjectLayer('glouton_top').objects.forEach((mechant) => {
            this.glouton_top = this.physics.add.sprite(mechant.x, mechant.y,"glouton1").setOrigin(0);
            this.glouton_top.play('glouton');
            this.physics.add.collider(this.glouton_top, this.collision_sol);
            this.physics.add.collider(this.glouton_top, this.player,function ()
            {
                me.player.velocity = 0;
                me.respawn();
            });
            this.physics.add.collider(this.crocs, this.glouton_top,function (crocs , glouton)
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
            this.glouton_top.setFlipX(true);
            this.gloutons_top.add(this.glouton_top);
        });
        for (let i = 0; i < this.gloutons_top.getChildren().length;i++)
        {
            this.tweens.add({
                targets: this.gloutons_top.getChildren()[i],
                duration: 3500,
                x: this.gloutons_top.getChildren()[i].x - 200,
                delay: 550,
                ease: 'Power1',
                repeat: -1,
                yoyo: true,
                onYoyo: function () { if (me.physics.sprite(me.gloutons_top.getChildren()[i]).exists())
                {
                    me.gloutons_top.getChildren()[i].setFlipX(false);
                }},
                onRepeat: function () { if (me.physics.sprite(me.gloutons_top.getChildren()[i]).exists())
                {
                    me.gloutons_top.getChildren()[i].setFlipX(true);
                }}
            });
        }

        map.getObjectLayer('glaise').objects.forEach((glaise) => {
            this.glaise_boup = this.objet_glaise.create(glaise.x, glaise.y,"glaise").setOrigin(0);
        });

        const eau = map.createLayer('eau', tileset, 0, 0);

        map.getObjectLayer('barrage1').objects.forEach((passage) => {
            this.barrage1 = new Barrage(this,0,3,passage.x,passage.y);
        });

        this.infos_barrage_1 = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('info_barrage_1').objects.forEach((info) => {
            this.info_barrage_1 = this.infos_barrage_1.create(info.x, info.y,"vide").setOrigin(0).setDisplaySize(info.width,info.height);
        });
        map.getObjectLayer('details_1').objects.forEach((details) => {
            this.details_barrage_1 = this.add.sprite(details.x, details.y,"info_1_incomplete").setOrigin(0);
            this.details_barrage_1.setVisible(false);
        });
        
        map.getObjectLayer('barrage2').objects.forEach((passage) => {
            this.barrage2 = new Barrage(this,3,0,passage.x,passage.y);
        });
        this.infos_barrage_2 = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('info_barrage_2').objects.forEach((info) => {
            this.info_barrage_2 = this.infos_barrage_2.create(info.x, info.y,"vide").setOrigin(0).setDisplaySize(info.width,info.height);
        });
        map.getObjectLayer('details_2').objects.forEach((details) => {
            this.details_barrage_2 = this.add.sprite(details.x, details.y,"info_2_incomplete").setOrigin(0);
            this.details_barrage_2.setVisible(false);
        });

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

        this.cameras.main.setZoom(2);
        this.cameras.main.setRoundPixels(false);
        this.cameras.main.setBounds(0,0,10976,2368);


        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (animation) {
            if (animation.key === "castor_crocs")
            {
                me.croquette = false;
            };
        }, this);

        this.grand_barrage.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (animation) {
            if (animation.key === "barrage_destruction" && me.fin == false)
            {
                me.grand_barrage.play("barrage")
            };
        }, this);

        this.cameras.main.centerOn(10668,544);
        this.time.addEvent({
            delay: 2680,
            callback: ()=>{
                me.grand_barrage.play("barrage_destruction")
                me.time.addEvent({
                    delay: 3000,
                    callback: ()=>{
                        me.cameras.main.pan(me.player.x,me.player.y,2000,'Power2')
                        me.cinematique = true;
                    },
                    loop: false,
                })
            },
            loop: false,
        })
    }

    respawn()
    {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
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
                        me.player.setVelocityX(160);
                    }
                    else
                    {
                        me.player.setVelocityX(220);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    if (me.danseau == false)
                    {
                        me.player.setVelocityX(-160);
                    }
                    else
                    {
                        me.player.setVelocityX(-220);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(-220);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.danseau == true)
                    {
                        me.player.setVelocityY(220);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    if (me.kangouroux == false)
                    {
                        if (me.player.body.onFloor() || me.sautage == true || me.danssurface == true) {
                            me.sautage = false;
                            me.player.setVelocityY(-800);
                            me.kangouroux = true;
                        }
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    if(me.player.body.onFloor() && me.crocance == false)
                    {
                        me.crocance = true;
                        me.croquette = true
                        me.player.setVelocityX(0);
                        me.player.play('castor_crocs')
                        me.crocs.setVisible(true);
                        me.crocs.enableBody()
                        me.time.addEvent({
                            delay: 1000, callback: function () {
                                me.crocs.disableBody()
                                me.crocs.setVisible(false);
                            }, callbackScope: me
                        });
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.C:
                    if(me.constructage == false)
                    {
                        me.constructage = true;
                        if (me.overlap_info_1 && me.barrage1.baton <= me.baton && me.barrage1.glaise <= me.glaise)
                        {
                            me.barrage1.casse = false;
                            me.barrage1.barrage.disableBody();
                            me.barrage1.barrage.stop('ponton');
                            me.barrage1.barrage.setTexture('ponton4')
                            me.details_barrage_1.setVisible(false);
                            me.baton -= me.barrage1.baton;
                            me.glaise -= me.barrage1.glaise;
                        }
                        if (me.overlap_info_2 && me.barrage2.baton <= me.baton && me.barrage2.glaise <= me.glaise)
                        {
                            me.barrage2.casse = false;
                            me.barrage2.barrage.disableBody();
                            me.barrage2.barrage.stop('ponton');
                            me.barrage2.barrage.setTexture('ponton4')
                            me.details_barrage_2.setVisible(false);
                            me.baton -= me.barrage2.baton;
                            me.glaise -= me.barrage2.glaise;
                        }
                        if (me.overlap_info_finale && 3 <= me.baton && 3 <= me.glaise)
                        {
                            me.details_barrage_final.setVisible(false);
                            me.cinematique = false;
                            me.fin = true;
                            me.player.disableBody();
                            me.player.play("castor_idle");
                            me.cameras.main.pan(10668,544);
                            me.time.addEvent({
                                delay: 1300,
                                callback: ()=>{
                                    me.grand_barrage.playReverse("barrage_destruction")
                                    me.time.addEvent({
                                        delay: 3000,
                                        callback: ()=>{
                                            window.close();
                                        },
                                        loop: false,
                                    })
                                },
                                loop: false,
                            })
                        }
                    }
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
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.crocance = false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.C:
                    me.constructage = false;
                    break;
                // case Phaser.Input.Keyboard.KeyCodes.X:
                //     if(me.player.body.onFloor())
                //     {
                //         me.sautage = true;
                //         me.player.setVelocityY(-350);
                //
                //         me.crocs.setVisible(true);
                //         me.crocs.enableBody()
                //         me.time.addEvent({ delay: 250, callback: function (){
                //                 me.crocs.disableBody()
                //                 me.crocs.setVisible(false);
                //                 me.player.setVelocityY(0);
                //             }, callbackScope: me });
                //     }
                //     break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.kangouroux = false;
                    break;
            }
        });
    }


    update()
    {
        let me = this;

        if (this.cinematique == true)
        {
            if (this.danseau === false)
            {
                this.cameras.main.centerOn(this.player.x,this.player.y-64);
            }
            else
            {
                this.cameras.main.centerOn(this.player.x,this.player.y+64);
            }

            this.inputs();
            for (var i = 0; i < this.collision_arbre.getChildren().length;i++)
            {
                if (this.collision_arbre.getChildren()[i].y >= this.player.body.y + this.player.body.height)
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

            this.crocs.y = this.player.body.y + 16;
            if (this.player.body.velocity.x > 0)
            {
                this.crocs.x = this.player.x+76;
                this.player.setFlipX(false);
            }
            else if (this.player.body.velocity.x < 0)
            {
                this.crocs.x = this.player.x-12;
                this.player.setFlipX(true);
            }

            if (this.danseau == true || this.danssurface == true)
            {
                this.player.play('castor_nage',true);
            }
            else
            {
                if (this.croquette == false)
                {
                    if (this.player.body.velocity.y < 0)
                    {
                        this.player.setTexture('saut_haut');
                    }
                    if (this.player.body.velocity.y > 0)
                    {
                        this.player.setTexture('saut_bas');
                    }
                    if (this.player.body.velocity.x == 0 && this.player.body.onFloor())
                    {
                        this.player.play('castor_idle',true);
                    }
                    if (this.player.body.velocity.x != 0 && this.player.body.onFloor())
                    {
                        this.player.play('castor_marche',true);
                    }
                }
            }

            this.overlap_info_1 = this.physics.overlap(this.player, this.infos_barrage_1) ? true : false;
            this.overlap_info_2 = this.physics.overlap(this.player, this.infos_barrage_2) ? true : false;
            this.overlap_info_finale = this.physics.overlap(this.player, this.infos_barrage_final) ? true : false;
            if (this.overlap_info_1 == true)
            {
                if (this.barrage1.casse == true)
                {
                    if (this.barrage1.baton<=this.baton && this.barrage1.glaise<=this.glaise)
                    {
                        this.details_barrage_1.setTexture('info_1');
                    }
                    else
                    {
                        this.details_barrage_1.setTexture('info_1_incomplete')
                    }
                    this.details_barrage_1.setVisible(true);
                }
            }
            else
            {
                this.details_barrage_1.setVisible(false);
            }
            if (this.overlap_info_2 == true)
            {
                if (this.barrage2.casse == true)
                {
                    if (this.barrage2.baton<=this.baton && this.barrage2.glaise<=this.glaise)
                    {
                        this.details_barrage_2.setTexture('info_2');
                    }
                    else
                    {
                        this.details_barrage_2.setTexture('info_2_incomplete')
                    }
                    this.details_barrage_2.setVisible(true);
                }
            }
            else
            {
                this.details_barrage_2.setVisible(false);
            }
            if (this.overlap_info_finale == true)
            {
                if (3<=this.baton && 3<=this.glaise)
                {
                    this.details_barrage_final.setTexture('info_finale');
                }
                else
                {
                    this.details_barrage_final.setTexture('info_finale_incomplete')
                }
                this.details_barrage_final.setVisible(true);
            }
            else
            {
                this.details_barrage_final.setVisible(false);
            }

            if (this.gloutons_top.getChildren().length == 0)
            {
                this.glouton_top = this.physics.add.sprite(10976, 576,"glouton1").setOrigin(0);
                this.glouton_top.play('glouton');
                this.physics.add.collider(this.glouton_top, this.collision_sol);
                this.physics.add.collider(this.glouton_top, this.player,function ()
                {
                    me.player.velocity = 0;
                    me.respawn();
                });
                this.physics.add.collider(this.crocs, this.glouton_top,function (crocs , glouton)
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
                this.glouton_top.setFlipX(true);
                this.tweens.add({
                    targets: this.glouton_top,
                    duration: 5000,
                    x: this.glouton_top.x - 400,
                    delay: 550,
                    ease: 'Power1',
                    onComplete: function () {
                        me.glouton_top.setFlipX(true);
                        me.tweens.add({
                        targets: me.glouton_top,
                        duration: 3500,
                        x: me.glouton_top.x - 200,
                        delay: 550,
                        ease: 'Power1',
                        repeat: -1,
                        yoyo: true,
                        onYoyo: function () { me.glouton_top.setFlipX(false); },
                        onRepeat: function () { me.glouton_top.setFlipX(true); }
                    }); },
                });

                this.gloutons_top.add(this.glouton_top);
            }
            console.log(this.gloutons_top.getChildren().length);
        }
    }
}
