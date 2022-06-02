class Menu extends Phaser.Scene {

    constructor() {
        super("Menu");
    }

    preload()
    {
        this.load.image("nuages","assets/tiled/images/nuages.png")
        this.load.image("fond","assets/tiled/images/paysage.png")

        this.load.image("jouer","assets/tiled/images/BOUTONS!/JOUER.png")
        this.load.image("jouer_pressé","assets/tiled/images/BOUTONS!/JOUER_pressé.png")

        this.load.image("play","assets/tiled/images/BOUTONS!/PLAY.png")
        this.load.image("play_pressé","assets/tiled/images/BOUTONS!/PLAY_pressé.png")

        this.load.image("français","assets/tiled/images/BOUTONS!/français.png")
        this.load.image("français_pas_pris","assets/tiled/images/BOUTONS!/français pas pris.png")

        this.load.image("anglais","assets/tiled/images/BOUTONS!/anglais.png")
        this.load.image("anglais_pas_pris","assets/tiled/images/BOUTONS!/anglais pas pris.png")
    }

    create()
    {
        this.fond = this.add.image(0,0,"fond").setOrigin(0,0)
        this.nuages = this.add.tileSprite(0,0,1280,720,"nuages").setOrigin(0,0);

        this.jouer = this.add.sprite(384,144,"jouer").setOrigin(0,0);
        this.francais = this.add.sprite(56,632,"français").setOrigin(0,0);
        this.anglais = this.add.sprite(872,632,"anglais_pas_pris").setOrigin(0,0);

        this.enfrancais = true;

        this.jouer.setInteractive();
        this.jouer.on("pointerup",()=>{
            if (this.enfrancais == true)
            {
                this.jouer.setTexture('jouer');
            }
            else
            {
                this.jouer.setTexture('play');
            }
            this.scene.start("Tableau1",{enfrancais: this.enfrancais});
        })
        this.jouer.on("pointerdown",()=>{
            if (this.enfrancais == true)
            {
                this.jouer.setTexture('jouer_pressé');
            }
            else
            {
                this.jouer.setTexture('play_pressé');
            }
        })

        this.francais.setInteractive();
        this.francais.on("pointerdown",()=>{
            this.enfrancais == true;
            this.francais.setTexture('français');
            this.anglais.setTexture('anglais_pas_pris');
            this.jouer.setTexture('jouer');
        })

        this.anglais.setInteractive();
        this.anglais.on("pointerdown",()=>{
            this.enfrancais == false;
            this.francais.setTexture('français_pas_pris');
            this.anglais.setTexture('anglais');
            this.jouer.setTexture('play');
        })


    }
    update()
    {
        this.nuages.tilePositionX += 0.22;
    }
}