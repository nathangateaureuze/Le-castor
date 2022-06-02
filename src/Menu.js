class Menu extends Phaser.Scene {

    constructor() {
        super("Menu");
    }

    preload()
    {
        this.load.image("fond","assets/tiled/images/paysage.png")
    }

    create()
    {
        this.commencement = this.add.image(0,0,"fond").setOrigin(0,0);
        this.commencement.setInteractive();
        this.commencement.on("pointerover",()=>{
            console.log("over")
        })
        this.commencement.on("pointerout",()=>{
            console.log("out")
            // this.commencement.setTexture('bouton1')
        })
        this.commencement.on("pointerup",()=>{
            console.log("up")
            // this.commencement.setTexture('bouton2')
            this.scene.start("Tableau1")
        })
    }

    update()
    {

    }
}