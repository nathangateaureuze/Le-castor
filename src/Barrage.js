class Barrage{
  constructor(Tableau1,nbglaise,nbbaton,x,y)
  {
    let me = this;

    this.glaise = nbglaise;
    this.baton = nbbaton;

    this.casse = true;

    this.barrage = Tableau1.physics.add.sprite(x,y,'ponton4').setOrigin(0,0);

    Tableau1.anims.create({
      key: 'ponton',
      frames: [
        {key:'ponton0'},
        {key:'ponton1'},
        {key:'ponton2'},
        {key:'ponton3'},
      ],
      frameRate: 7,
      repeat: -1
    });
    this.barrage.play('ponton');

    Tableau1.physics.add.collider(this.barrage, Tableau1.collision_sol)

    Tableau1.physics.add.overlap(this.barrage, Tableau1.player,function ()
    {
      if (me.barrage.texture.key != 'ponton4')
      {
        Tableau1.respawn();
      }
    })
  }
}