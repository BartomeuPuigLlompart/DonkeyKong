var platformer = platformer || {};

platformer.level2 ={
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
        this.load.image('bg',ruta+'stage_2.png');
        this.load.image('patron',ruta+'Tile.png');
        
        this.load.spritesheet('Mario', ruta+'Mario.png', 31, 26);
        this.load.image('Lives', ruta+'lives.png');
        this.load.spritesheet('Donkey', ruta+'donkey_anims.png', 56, 40);
        this.load.spritesheet('Princess', ruta+'princess.png', 16, 25);
        this.load.spritesheet('HelpMsg', ruta+'help.png', 25, 8);
        this.load.spritesheet('Numbers', ruta+'game_numbers.png', 8, 8);
        
        this.load.tilemap('Stage_2','assets/levels/Stage_2.json',null,Phaser.Tilemap.TILED_JSON);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        var ruta = 'assets/sounds/';
        
    },
    create:function(){
        this.bg = this.game.add.tileSprite(0,0,gameOptions.gameWidth,gameOptions.gameHeight,'bg');
        this.map = this.game.add.tilemap('Stage_2');
        this.map.addTilesetImage('patron');
        this.walls = this.map.createLayer('Walls');
        this.steps = this.map.createLayer('Steps');
        this.map.setCollisionBetween(1,1,true,'Walls');
        this.map.setCollisionBetween(1,1,true,'Steps');
        
        
        this.mario = this.game.add.sprite(0,0,'Mario',0)
        this.mario.anchor.setTo(.5);
        this.game.physics.arcade.enable(this.mario);
        this.mario.body.setSize(13,16, 10,10);
        this.lives = 5;
        this.livesSprite = [];
        this.livesSprite[0] = this.game.add.sprite(8, 24, 'Lives');
        this.livesSprite[1] = this.game.add.sprite(8+8, 24, 'Lives');
        this.livesSprite[2] = this.game.add.sprite(8+16, 24, 'Lives');
        this.livesSprite[3] = this.game.add.sprite(8+24, 24, 'Lives');
        this.livesSprite[4] = this.game.add.sprite(8+32, 24, 'Lives');
        this.livesSprite[5] = this.game.add.sprite(8+40, 24, 'Lives');
        
        this.donkey = this.game.add.sprite(0,48, 'Donkey', 0);
        this.donkey.anchor.setTo(.5, 0);
        this.donkey.position.x = gameOptions.gameWidth / 2;
        this.princess = this.game.add.sprite(88, 32-8, 'Princess', 0);
        this.princess.anchor.setTo(.5, 0);
        this.princess.position.x = gameOptions.gameWidth / 2;
        this.princess.animations.add('HELP',[1, 2, 3, 4],10,true);
        this.princess.animations.play('HELP');
        this.helpAnimCount = 0;
        this.helpMsg = this.game.add.sprite(this.princess.x+this.princess.width+1, this.princess.y+1, 'HelpMsg', 2);
        
        //music
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.game.world.setBounds(0,0,gameOptions.gameWidth,gameOptions.gameHeight);
        
        this.loadStairs();
        
        //Score
        this.bonus = 0.5001;
        this.bonusRef = 0;
        this.bonusSprite = [];
        this.bonusSprite[0] = this.game.add.sprite(176,48,'Numbers',parseInt(this.bonus.toString().charAt(2+0))-1+10*3);
        this.bonusSprite[1] = this.game.add.sprite(176+8,48,'Numbers',parseInt(this.bonus.toString().charAt(2+1))+10*3);
        this.bonusSprite[2] = this.game.add.sprite(176+16,48,'Numbers',parseInt(this.bonus.toString().charAt(2+2))+10*3);
        this.bonusSprite[3] = this.game.add.sprite(176+24,48,'Numbers',parseInt(this.bonus.toString().charAt(2+3))+10*3);
        this.score = 0.000001;
        this.scoreSprite = [];
        this.scoreSprite[0] = this.game.add.sprite(8,8,'Numbers',parseInt(this.score.toString().charAt(2+0))-1);
        this.scoreSprite[1] = this.game.add.sprite(8+8,8,'Numbers',parseInt(this.score.toString().charAt(2+1)));
        this.scoreSprite[2] = this.game.add.sprite(8+16,8,'Numbers',parseInt(this.score.toString().charAt(2+2)));
        this.scoreSprite[3] = this.game.add.sprite(8+24,8,'Numbers',parseInt(this.score.toString().charAt(2+3)));
        this.scoreSprite[4] = this.game.add.sprite(8+32,8,'Numbers',parseInt(this.score.toString().charAt(2+4)));
        this.scoreSprite[5] = this.game.add.sprite(8+40,8,'Numbers',parseInt(this.score.toString().charAt(2+5)));
        this.highScore = 0.000001;
        this.highScoreSprite = [];
        this.highScoreSprite[0] = this.game.add.sprite(88,8,'Numbers',parseInt(this.highScore.toString().charAt(2+0))-1);
        this.highScoreSprite[1] = this.game.add.sprite(88+8,8,'Numbers',parseInt(this.highScore.toString().charAt(2+1)));
        this.highScoreSprite[2] = this.game.add.sprite(88+16,8,'Numbers',parseInt(this.highScore.toString().charAt(2+2)));
        this.highScoreSprite[3] = this.game.add.sprite(88+24,8,'Numbers',parseInt(this.highScore.toString().charAt(2+3)));
        this.highScoreSprite[4] = this.game.add.sprite(88+32,8,'Numbers',parseInt(this.highScore.toString().charAt(2+4)));
        this.highScoreSprite[5] = this.game.add.sprite(88+40,8,'Numbers',parseInt(this.highScore.toString().charAt(2+5)));
        
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
        
        this.updateScore();
        this.updateLives();
        this.updatePrincess();
    },
    
    updatePrincess:function()
    {
        this.helpAnimCount++;
        if(this.mario.position.x > this.princess.position.x)
        {
            this.princess.scale.x = 1;
            this.helpMsg.position.x = this.princess.x+this.princess.width - this.princess.offsetX+1;
            this.helpMsg.frame = 2;
        }
        else
        {
            this.princess.scale.x = -1;
            this.helpMsg.position.x = this.princess.x-this.helpMsg.width+this.princess.offsetX-1;
            this.helpMsg.frame = 1;
        }
        if(this.helpAnimCount > 60 && this.princess.frame != 0)
            {
                this.helpAnimCount = 0;
                this.princess.animations.stop();
                this.princess.frame = 0;
                this.helpMsg.visible = false;
            }
        else if(this.helpAnimCount > 240 && this.princess.frame == 0)
            {
                this.helpAnimCount = 0;
                this.princess.animations.play('HELP');
                this.helpMsg.visible = true;
            }
    },
    
    updateScore:function()
    {
        this.bonusRef ++;
        if(this.bonusRef >= 180 && this.bonus >= 0.0100)
            {
                this.bonusRef = 0;
                this.bonus -= 0.0100;
                this.bonus = this.bonus.toFixed(4);
            }
        console.log(this.bonus);
        this.bonusSprite[this.bonusSprite.length-1].frame = parseInt(this.bonus.toString().charAt(2+this.bonusSprite.length-1))-1+10*3;
        for(var i = 0; i < this.bonusSprite.length-1; i++){
        this.bonusSprite[i].frame = parseInt(this.bonus.toString().charAt(2+i))+10*3;
        }
        this.scoreSprite[this.scoreSprite.length-1].frame = parseInt(this.score.toString().charAt(2+this.scoreSprite.length-1))-1;
        this.highScoreSprite[this.scoreSprite.length-1].frame = parseInt(this.highScore.toString().charAt(2+this.scoreSprite.length-1))-1;
        for(i = 0; i < this.scoreSprite.length-1; i++){
        this.scoreSprite[i].frame = parseInt(this.score.toString().charAt(2+i));
        this.highScoreSprite[i].frame = parseInt(this.highScore.toString().charAt(2+i));
        }
    },
    
    updateLives:function()
    {
        for(var i = 0; i < this.livesSprite.length; i++)
            {
                if(this.lives < i+1) this.livesSprite[i].visible = false;
                else this.livesSprite[i].visible = true;
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

