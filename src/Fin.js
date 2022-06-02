class Fin extends Phaser.Scene {

    constructor() {
        super("Fin");
    }

    init(langue){
        this.enfrancais = langue.enfrancais;
    }

    preload()
    {
        this.load.image("nuages","assets/tiled/images/nuages.png")
        this.load.image("fond","assets/tiled/images/paysage.png")

        this.load.image("quitter","assets/tiled/images/BOUTONS!/QUITTER.png")
        this.load.image("quitter_pressé","assets/tiled/images/BOUTONS!/QUITTER_pressé.png")

        this.load.image("quit","assets/tiled/images/BOUTONS!/QUIT.png")
        this.load.image("quit_pressé","assets/tiled/images/BOUTONS!/QUIT_pressé.png")
    }

    create()
    {
        this.fond = this.add.image(0,0,"fond").setOrigin(0,0)
        this.nuages = this.add.tileSprite(0,0,1280,720,"nuages").setOrigin(0,0);

        this.quitter = this.add.sprite(384,144,this.enfrancais == true?"quitter":"quit").setOrigin(0,0);

        this.quitter.setInteractive();
        this.quitter.on("pointerup",()=>{
            if (this.enfrancais == true)
            {
                this.quitter.setTexture('quitter');
            }
            else
            {
                this.quitter.setTexture('quit');
            }
            window.close();
        })
        this.quitter.on("pointerdown",()=>{
            if (this.enfrancais == true)
            {
                this.quitter.setTexture('quitter_pressé');
            }
            else
            {
                this.quitter.setTexture('quit_pressé');
            }
        })
    }

    update()
    {
        this.nuages.tilePositionX += 0.22;
    }
}