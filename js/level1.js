var platformer = platformer || {};

platformer.level1 ={
    init:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setGameSize(gameOptions.gameWidth,gameOptions.gameHeight);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = gameOptions.heroGravity;
        
    },
    preload:function(){
        var ruta = 'assets/sprites/';
        this.load.image('bg',ruta+'stage_1.png');
        this.load.image('patron',ruta+'patron.png');
        
        this.load.spritesheet('Mario', ruta+'Mario.png', 31, 26);
        
        this.load.tilemap('Stage_1','assets/levels/Stage_1.json',null,Phaser.Tilemap.TILED_JSON);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        var ruta = 'assets/sounds/';
        
    },
    create:function(){
        this.bg = this.game.add.tileSprite(0,0,gameOptions.gameWidth,gameOptions.gameHeight,'bg');
        this.map = this.game.add.tilemap('Stage_1');
        this.map.addTilesetImage('patron');
        this.walls = this.map.createLayer('Walls');
        this.steps = this.map.createLayer('Steps');
        this.map.setCollisionBetween(1,1,true,'Walls');
        this.map.setCollisionBetween(1,1,true,'Steps');
        
        
        this.mario = this.game.add.sprite(0,0,'Mario',0)
        this.mario.anchor.setTo(.5);
        this.game.physics.arcade.enable(this.mario);
        this.mario.body.setSize(13,16, 10,10);
        
        //music
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.game.world.setBounds(0,0,gameOptions.gameWidth,gameOptions.gameHeight);
        
        this.loadStairs();
        
    },
    update:function(){        
        this.game.physics.arcade.collide(this.mario,this.walls);
        
        if(this.cursors.left.isDown){
                this.mario.body.velocity.x = -gameOptions.heroSpeed;
                this.mario.scale.x = 1;
              //  if(!this.steps.isPlaying){
                //    this.steps.play();
                //}
            }else
            if(this.cursors.right.isDown){
                this.mario.body.velocity.x = gameOptions.heroSpeed;
                this.mario.scale.x = -1;

            }else{
                this.mario.body.velocity.x = 0;
              //  this.steps.stop();
            }
        
    },
    
    render:function()
    {
        this.game.debug.body(this.mario);
        //this.game.debug.body(this.boss);
        //this.game.debug.body(this.propTops[0]);
        //this.game.debug.body(this.silverWatchers[0]);
    },
    
    loadStairs:function()
    {
        /* var stair_one = new Phaser.Rectangle(this.map.getTile(125, 11, 'Steps').worldX, this.map.getTile(125, 11, 'Steps').worldY, this.map.getTile(125, 11, 'Steps').width, this.map.getTile(125, 11, 'Steps').height * 14);
        
        var stair_two = new Phaser.Rectangle(this.map.getTile(114, 18, 'Steps').worldX, this.map.getTile(114, 18, 'Steps').worldY, this.map.getTile(114, 18, 'Steps').width, this.map.getTile(114, 18, 'Steps').height * 14);
        
        var stair_three = new Phaser.Rectangle(this.map.getTile(285, 40, 'Steps').worldX, this.map.getTile(285, 40, 'Steps').worldY, this.map.getTile(285, 40, 'Steps').width, this.map.getTile(285, 40, 'Steps').height * 16);
        var stair_four = new Phaser.Rectangle(this.map.getTile(275, 54, 'Steps').worldX, this.map.getTile(275, 54, 'Steps').worldY, this.map.getTile(275, 54, 'Steps').width, this.map.getTile(275, 54, 'Steps').height * 9);
        
        this.stairs = [];
        this.stairs[0] = stair_one;
        this.stairs[1] = stair_two;
        this.stairs[2] = stair_three;
        this.stairs[3] = stair_four;*/
    },
    checkStairs:function()
    {
        /*this.stair = -1;
        
        for (var i=0;i < this.stairs.length;i++)
        {
            if(this.stairs[i].intersectsRaw(this.megaman.position.x, this.megaman.position.x, this.megaman.position.y, this.megaman.position.y))
            {
                this.stair = i;
            }
        }*/
        
    },
}

