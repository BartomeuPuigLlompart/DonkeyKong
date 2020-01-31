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
        this.load.image('hammer', ruta+'hammer.png');
        
        this.load.spritesheet('Mario', ruta+'Mario.png', 56, 26);
        this.load.image('Lives', ruta+'lives.png');
        this.load.image('button', ruta+'button.png');
        this.load.spritesheet('flameEnemy', ruta+'enemy_flame.png', 16, 16);
        this.load.spritesheet('bubbleEffect', ruta+'bubble_effect.png', 16, 14);
        this.load.spritesheet('Donkey', ruta+'donkey_anims.png', 56, 40);
        this.load.spritesheet('Princess', ruta+'princess.png', 16, 25);
        this.load.spritesheet('HelpMsg', ruta+'help.png', 25, 8);
        this.load.spritesheet('Numbers', ruta+'game_numbers.png', 8, 8);
        this.load.spritesheet('scoreText', ruta+'gained_score.png', 15, 7);
        
        this.load.tilemap('Stage_2','assets/levels/Stage_2.json',null,Phaser.Tilemap.TILED_JSON);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        var ruta = 'assets/sounds/';
        
    },
    create:function(){
        this.poweredUp = false;
        this.powerCounter = 0;
        
        this.bg = this.game.add.tileSprite(0,0,gameOptions.gameWidth,gameOptions.gameHeight,'bg');
        this.map = this.game.add.tilemap('Stage_2');
        this.map.addTilesetImage('patron');
        this.walls = this.map.createLayer('Walls');
        this.steps = this.map.createLayer('Steps');
        this.map.setCollisionBetween(1,1,true,'Walls');
        this.map.setCollisionBetween(1,1,true,'Steps');
        
          this.timer = this.game.time.create(false);
        this.timer.add(5000, this.hammerDown);
        
        this.hammer = this.game.add.sprite(13*8,98, 'hammer');
        this.game.physics.arcade.enable(this.hammer);
        this.hammer.body.allowGravity = false;
        this.hammer_2 = this.game.add.sprite(1*8,150-12, 'hammer');
        this.game.physics.arcade.enable(this.hammer_2);
        this.hammer_2.body.allowGravity = false;
        
        this.donkey = this.game.add.sprite(0,48, 'Donkey', 0);
        this.donkey.animations.add('Default', [0, 6, 7], 2, true);
        this.donkey.animations.play('Default');
        this.donkey.anchor.setTo(.5, 0);
        this.donkey.position.x = gameOptions.gameWidth / 2;
        this.princess = this.game.add.sprite(88, 32-8, 'Princess', 0);
        this.princess.anchor.setTo(.5, 0);
        this.princess.position.x = gameOptions.gameWidth / 2;
        this.princess.animations.add('HELP',[1, 2, 3, 4],10,true);
        this.princess.animations.play('HELP');
        this.helpAnimCount = 0;
        this.helpMsg = this.game.add.sprite(this.princess.x+this.princess.width+1, this.princess.y+1, 'HelpMsg', 2);
        this.mario = this.game.add.sprite(50,230,'Mario',0)
        this.mario.anchor.setTo(.5);
        this.game.physics.arcade.enable(this.mario);
        this.mario.body.setSize(13,16, 20,10);
        this.mario.body.allowGravity = true; 
        this.mario.body.gravity.y = -600;
        this.mario.animations.add('run',[1,2],15,true);
        this.mario.animations.add('hammerIdle', [16,17], 10, true);
        this.mario.animations.add('hammerRun', [18,19], 10, true);
        this.mario.animations.add('death', [13,14, 15], 5, false);
        this.lives = 5;
        this.livesSprite = [];
        this.livesSprite[0] = this.game.add.sprite(8, 24, 'Lives');
        this.livesSprite[1] = this.game.add.sprite(8+8, 24, 'Lives');
        this.livesSprite[2] = this.game.add.sprite(8+16, 24, 'Lives');
        this.livesSprite[3] = this.game.add.sprite(8+24, 24, 'Lives');
        this.livesSprite[4] = this.game.add.sprite(8+32, 24, 'Lives');
        this.livesSprite[5] = this.game.add.sprite(8+40, 24, 'Lives');
        
        //Buttons
        this.buttons = [];
        this.buttons[0] = this.game.add.sprite(7*8, 95-8, 'button');
        this.buttons[1] = this.game.add.sprite(20*8, 95-8, 'button');
        
        this.buttons[2] = this.game.add.sprite(7*8, 135-8, 'button');
        this.buttons[3] = this.game.add.sprite(20*8, 135-8, 'button');
        
        this.buttons[4] = this.game.add.sprite(7*8, 175-8, 'button');
        this.buttons[5] = this.game.add.sprite(20*8, 175-8, 'button');
        
        this.buttons[6] = this.game.add.sprite(7*8, 215-8, 'button');
        this.buttons[7] = this.game.add.sprite(20*8, 215-8, 'button');
        
        for(var i = 0; i < this.buttons.length; i++)
            {
                this.game.physics.arcade.enable(this.buttons[i]);
                this.buttons[i].body.immovable = true;
                this.buttons[i].body.allowGravity = false;
            }
        
        //music
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.game.world.setBounds(0,0,gameOptions.gameWidth,gameOptions.gameHeight);
        
        
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
        
        //Enemies
        this.enemyCounter = 0;
        this.enemySpawns = [];
        this.enemySpawns[0] = new Phaser.Point(0*8, 255-4);
        this.enemySpawns[1] = new Phaser.Point(27*8, 255-4);
        
        this.enemySpawns[2] = new Phaser.Point(1*8, 215-4);
        this.enemySpawns[3] = new Phaser.Point(26*8, 215-4);
        
        this.enemySpawns[4] = new Phaser.Point(2*8, 175-4);
        this.enemySpawns[5] = new Phaser.Point(25*8, 175-4);
        
        //Hardcoded stuff
       // this.mario.position.setTo(40,0);
    },
    update:function(){        
        this.game.physics.arcade.collide(this.mario,this.walls);
        if(this.game.physics.arcade.overlap(this.mario,this.hammer))
        {
            this.hammer.body.position.x = 10000;
            this.hammerPowerUp();
        }
        else if(this.game.physics.arcade.overlap(this.mario,this.hammer_2))
        {
            this.hammer_2.body.position.x = 10000;
            this.hammerPowerUp();
        }
        
        if(this.mario.body.allowGravity){
        if(this.cursors.left.isDown){
                this.mario.body.velocity.x = -gameOptions.heroSpeed;
                this.mario.scale.x = 1;
            if(!this.poweredUp)this.mario.animations.play('run');
            else this.mario.animations.play('hammerRun');
            //  if(!this.steps.isPlaying){
                //    this.steps.play();
                //}
            }else
            if(this.cursors.right.isDown){
                this.mario.body.velocity.x = gameOptions.heroSpeed;
                this.mario.scale.x = -1;
            if(!this.poweredUp)this.mario.animations.play('run');
            else this.mario.animations.play('hammerRun');

            }else{
                this.mario.body.velocity.x = 0;
                if(this.poweredUp) this.mario.animations.play('hammerIdle');
                else this.mario.frame = 0;
                
              //  this.steps.stop();
            }
        }
        if(this.cursors.up.isDown && (this.mario.body.touching.down||this.mario.body.blocked.down)&& this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y, 8, 1, 'Steps') == null &&this.cursors.up.downDuration(1)){
            this.mario.body.allowGravity = true;
                this.mario.body.velocity.y = -gameOptions.heroJump;
            }
        else if(this.cursors.up.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps') != null && !this.poweredUp)
            {
                this.mario.body.velocity.y = 0;
                this.mario.body.velocity.x = 0;
                this.mario.body.allowGravity = false;
                this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps').worldX + 4;
                if(this.cursors.up.isDown) this.mario.position.y -=0.5;
            }
        else if(this.cursors.down.isDown && (this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +20, 8, 1, 'Steps') != null || this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') != null) && (!this.mario.body.touching.down||!this.mario.body.blocked.down) && !this.poweredUp)
            {
                this.mario.body.velocity.y = 0;
                this.mario.body.velocity.x = 0;
                this.mario.body.allowGravity = false;
                if(this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y + 20, 8, 1, 'Steps') != null)this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +20, 8, 1, 'Steps').worldX + 4;
                else if(this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') != null) this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y+14, 8, 1, 'Steps').worldX + 4;
                if(this.cursors.down.isDown) this.mario.position.y +=0.5;
            }
        else if((this.cursors.up.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps') == null) || (this.cursors.down.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') == null)) this.mario.body.allowGravity = true;
        
        if(this.poweredUp) this.powerCounter++;
        if(this.powerCounter > 700){
            this.poweredUp = false;
            this.powerCounter = 0;
        } 
        this.bodySize();
        this.updateSpawns();
        this.updateButtons();
        this.updateScore();
        this.updateLives();
        this.updatePrincess();
    },
    
    updateSpawns:function()
    {
        var randVal = this.game.rnd.integerInRange(0, 1500);
        if(randVal < this.enemySpawns.length && this.enemyCounter < this.enemySpawns.length){
            new platformer.fireEnemy(this.game,this.enemySpawns[randVal].x, this.enemySpawns[randVal].y, 4, this);
            this.enemyCounter++;
        }
    },
    
    updateButtons:function()
    {
        for(var i = 0; i < this.buttons.length; i++)
            {
                if(this.game.physics.arcade.collide(this.mario,this.buttons[i])) {
                    new platformer.scoreText(this.game, this.buttons[i].position.x, this.buttons[i].position.y+5+this.buttons[i].height, 0, this);
                    this.buttons[i].kill();
                }
            }
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
    hammerPowerUp:function()
    {
                this.poweredUp = true;
        
    },
    bodySize:function()
    {
      if(this.mario.frame == 17 && this.mario.body.blocked.down)this.mario.body.setSize(28,16, 3,10);
      else if(this.mario.frame == 18 && this.mario.body.blocked.down)this.mario.body.setSize(28,16, 5,10);
      else this.mario.body.setSize(8,14, 23,12);
    },
}

