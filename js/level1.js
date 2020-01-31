var platformer = platformer || {};

platformer.level1 ={
    init:function(_score, _highScore, _lives, _bonus){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setGameSize(gameOptions.gameWidth,gameOptions.gameHeight);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = gameOptions.heroGravity;
        
        if(_highScore != null) this.highScore = _highScore;
        else this.highScore = 0.000001;
        if(_lives != null) this.lives = _lives;
        else this.lives = 5;
        this.score = 0.000001;
        if(_score != null)this.score = _score;
        else this.bonus = 0.5001;
        this.bonus = 0.000001;
        if(_bonus != null)this.bonus = _bonus;
        else this.bonus = 0.5001;
    },
    
    preload:function(){
        var ruta = 'assets/sprites/';
        this.load.image('bg',ruta+'stage_1.png');
        this.load.image('patron',ruta+'Tile.png');
        this.load.image('hammer', ruta+'hammer.png');
        
        this.load.spritesheet('Mario', ruta+'Mario.png', 56, 26);
        this.load.image('Lives', ruta+'lives.png');
        this.load.image('barrelSource', ruta+'barrel_source.png');
        this.load.spritesheet('oilBarrel', ruta+'oil_barrel.png', 24, 32);
        this.load.spritesheet('normalBarrel', ruta+'normal_barrel.png', 24, 10);
        this.load.spritesheet('blueBarrel', ruta+'blue_barrel.png', 24, 10);
        this.load.spritesheet('flameEnemy', ruta+'enemy_flame.png', 16, 16);
        this.load.spritesheet('bubbleEffect', ruta+'bubble_effect.png', 16, 14);
        this.load.spritesheet('Donkey', ruta+'donkey_anims.png', 56, 40);
        this.load.spritesheet('Princess', ruta+'princess.png', 16, 25);
        this.load.spritesheet('HelpMsg', ruta+'help.png', 25, 8);
        this.load.spritesheet('Numbers', ruta+'game_numbers.png', 8, 8);
        this.load.spritesheet('scoreText', ruta+'gained_score.png', 15, 7);
        
        this.load.tilemap('Stage_1','assets/levels/Stage_1.json',null,Phaser.Tilemap.TILED_JSON);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        var ruta = 'assets/sounds/';
        this.load.audio('walking',ruta+'walking.wav');
        this.load.audio('backMusic',ruta+'bacmusic.wav');
        this.load.audio('hammer',ruta+'07 Hammer.mp3');
        this.load.audio('bonus',ruta+'bonus.mp3');
        this.load.audio('kill',ruta+'kill.wav');
        
    },
    create:function(){
        this.poweredUp = false;
        this.powerCounter = 0;
        
        this.bg = this.game.add.tileSprite(0,0,gameOptions.gameWidth,gameOptions.gameHeight,'bg');
        this.map = this.game.add.tilemap('Stage_1');
        this.map.addTilesetImage('patron');
        this.walls = this.map.createLayer('Walls');
        this.steps = this.map.createLayer('Steps');
        this.broken = this.map.createLayer('Broken');
        this.map.setCollisionBetween(1,1,true,'Walls');
        this.map.setCollisionBetween(1,1,true,'Steps');
        
            this.timer = this.game.time.create(false);
        this.timer.add(5000, this.hammerDown);
        
        this.hammer = this.game.add.sprite(21*8,190, 'hammer');
        this.game.physics.arcade.enable(this.hammer);
        this.hammer.body.allowGravity = false;
        this.hammer_2 = this.game.add.sprite(2*8,100, 'hammer');
        this.game.physics.arcade.enable(this.hammer_2);
        this.hammer_2.body.allowGravity = false;
        this.donkey = this.game.add.sprite(16,44, 'Donkey', 0);
        this.donkey.animations.add('Default', [0, 6, 7], 2, false);
        this.donkey.animations.add('Horizontal_Normal', [0, 1, 2, 5], 2, false);
        this.donkey.animations.add('Horizontal_Blue', [0, 1, 3, 5], 2, false);
        this.donkey.animations.add('Vertical', [0, 1, 4], 2, false);
        this.donkey.animations.play('Default');
        this.donkey.animations.currentAnim.enableUpdate = true;
        this.game.add.sprite(-1, 52, 'barrelSource');
        this.oilBarrel = this.game.add.sprite(12,216, 'oilBarrel', 4);
        this.oilBarrel.animations.add('halfFire', [0,1], 5, true);
        this.spawnFireAnim = this.oilBarrel.animations.add('fullFire', [2, 3, 2,3,2,3,2,3,2,3], 5, false);
        this.game.physics.arcade.enable(this.oilBarrel);
        this.oilBarrel.body.immovable = true;
        this.oilBarrel.body.allowGravity = false;
        this.princess = this.game.add.sprite(88, 32, 'Princess', 0);
        this.princess.animations.add('HELP',[1, 2, 3, 4],10,true);
        this.princess.animations.play('HELP');
        this.helpAnimCount = 0;
        this.helpMsg = this.game.add.sprite(this.princess.x+this.princess.width+1, this.princess.y+1, 'HelpMsg', 0);
        
        
        this.mario = this.game.add.sprite(50,230,'Mario',0)
        this.mario.anchor.setTo(.5);
        this.game.physics.arcade.enable(this.mario);
        this.mario.body.setSize(13,16, 20,10);
        this.mario.body.allowGravity = true; 
        this.mario.body.gravity.y = -600;
        this.mario.animations.add('run',[1,2],15,true);
        this.mario.animations.add('hammerIdle', [16,17], 10, true);
        this.mario.animations.add('hammerRun', [18,19], 10, true);
        this.death = this.mario.animations.add('death', [13,14, 15], 5, false);
        
        this.enemyCounter = 0;
        
        //this.lives = 5;
        this.livesSprite = [];
        this.livesSprite[0] = this.game.add.sprite(8, 24, 'Lives');
        this.livesSprite[1] = this.game.add.sprite(8+8, 24, 'Lives');
        this.livesSprite[2] = this.game.add.sprite(8+16, 24, 'Lives');
        this.livesSprite[3] = this.game.add.sprite(8+24, 24, 'Lives');
        this.livesSprite[4] = this.game.add.sprite(8+32, 24, 'Lives');
        this.livesSprite[5] = this.game.add.sprite(8+40, 24, 'Lives');
        
        //music
        this.walking_a = this.game.add.audio('walking');
        this.hammer_a = this.game.add.audio('hammer', 1, true);
        this.backMusic = this.game.add.audio('backMusic', 1, true);
        if(!this.backMusic.isPlaying)this.backMusic.play();
        
        
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.game.world.setBounds(0,0,gameOptions.gameWidth,gameOptions.gameHeight);
        
        
        //Score
        
        this.bonusRef = 0;
        this.bonusSprite = [];
        this.bonusSprite[0] = this.game.add.sprite(176,48,'Numbers',parseInt(this.bonus.toString().charAt(2+0))-1+10*2);
        this.bonusSprite[1] = this.game.add.sprite(176+8,48,'Numbers',parseInt(this.bonus.toString().charAt(2+1))+10*2);
        this.bonusSprite[2] = this.game.add.sprite(176+16,48,'Numbers',parseInt(this.bonus.toString().charAt(2+2))+10*2);
        this.bonusSprite[3] = this.game.add.sprite(176+24,48,'Numbers',parseInt(this.bonus.toString().charAt(2+3))+10*2);
        //this.score = 0.000001;
        this.scoreSprite = [];
        this.scoreSprite[0] = this.game.add.sprite(8,8,'Numbers',parseInt(this.score.toString().charAt(2+0))-1);
        this.scoreSprite[1] = this.game.add.sprite(8+8,8,'Numbers',parseInt(this.score.toString().charAt(2+1)));
        this.scoreSprite[2] = this.game.add.sprite(8+16,8,'Numbers',parseInt(this.score.toString().charAt(2+2)));
        this.scoreSprite[3] = this.game.add.sprite(8+24,8,'Numbers',parseInt(this.score.toString().charAt(2+3)));
        this.scoreSprite[4] = this.game.add.sprite(8+32,8,'Numbers',parseInt(this.score.toString().charAt(2+4)));
        this.scoreSprite[5] = this.game.add.sprite(8+40,8,'Numbers',parseInt(this.score.toString().charAt(2+5)));
        this.highScoreSprite = [];
        this.highScoreSprite[0] = this.game.add.sprite(88,8,'Numbers',parseInt(this.highScore.toString().charAt(2+0))-1);
        this.highScoreSprite[1] = this.game.add.sprite(88+8,8,'Numbers',parseInt(this.highScore.toString().charAt(2+1)));
        this.highScoreSprite[2] = this.game.add.sprite(88+16,8,'Numbers',parseInt(this.highScore.toString().charAt(2+2)));
        this.highScoreSprite[3] = this.game.add.sprite(88+24,8,'Numbers',parseInt(this.highScore.toString().charAt(2+3)));
        this.highScoreSprite[4] = this.game.add.sprite(88+32,8,'Numbers',parseInt(this.highScore.toString().charAt(2+4)));
        this.highScoreSprite[5] = this.game.add.sprite(88+40,8,'Numbers',parseInt(this.highScore.toString().charAt(2+5)));
        
        //Hardcoded stuff
        //this.mario.position.setTo(0,0);
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
            if(!this.walking_a.isPlaying)this.walking_a.play();
                this.mario.body.velocity.x = -gameOptions.heroSpeed;
                this.mario.scale.x = 1;
            if(this.mario.body.blocked.left) this.mario.position.y -= 0.5;
            if(!this.poweredUp)this.mario.animations.play('run');
            else this.mario.animations.play('hammerRun');
            //  if(!this.steps.isPlaying){
                //    this.steps.play();
                //}
            }else
            if(this.cursors.right.isDown){
                if(!this.walking_a.isPlaying)this.walking_a.play();
                this.mario.body.velocity.x = gameOptions.heroSpeed;
                this.mario.scale.x = -1;
                if(this.mario.body.blocked.right) this.mario.position.y -= 0.5;
            if(!this.poweredUp)this.mario.animations.play('run');
            else this.mario.animations.play('hammerRun');

            }else{
                if(this.walking_a.isPlaying)this.walking_a.stop();
                this.mario.body.velocity.x = 0;
                if(this.poweredUp) this.mario.animations.play('hammerIdle');
                else this.mario.frame = 0;
                
              //  this.steps.stop();
            }
            if(this.mario.position.y < 60){
                if(!isNaN(this.score + this.bonus / 100))this.score += this.bonus / 100;
                this.game.state.start('level_2', true, false, this.score, this.highScore, this.lives, 0.5001);
            }
        }
        if(this.cursors.up.isDown && (this.mario.body.touching.down||this.mario.body.blocked.down)&& (this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y, 8, 1, 'Steps') == null || this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y, 8, 1, 'Broken') != null) &&this.cursors.up.downDuration(1)){
            this.mario.body.allowGravity = true;
                this.mario.body.velocity.y = -gameOptions.heroJump;
            }
        else if(this.cursors.up.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps') != null && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Broken') == null && !this.poweredUp)
            {
                if(!this.walking_a.isPlaying)this.walking_a.play();
                this.mario.animations.stop();
                this.mario.frame = 3;
                if(Math.floor(this.mario.position.y) % 4 == 0)this.mario.scale.x = -1;
                else if(Math.floor(this.mario.position.y) % 2 == 0) this.mario.scale.x = 1
                this.mario.body.velocity.y = 0;
                this.mario.body.velocity.x = 0;
                this.mario.body.allowGravity = false;
                this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps').worldX + 4;
                if(this.cursors.up.isDown) this.mario.position.y -=0.5;
            }
        else if(this.cursors.down.isDown && (this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +20, 8, 1, 'Steps') != null || this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') != null) && (this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +20, 8, 1, 'Broken') == null || this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Broken') == null) && (!this.mario.body.touching.down||!this.mario.body.blocked.down) && !this.poweredUp)
            {
                if(!this.walking_a.isPlaying)this.walking_a.play();
                this.mario.animations.stop();
                this.mario.frame = 3;
                if(Math.floor(this.mario.position.y) % 4 == 0)this.mario.scale.x = 1;
                else if(Math.floor(this.mario.position.y) % 2 == 0) this.mario.scale.x = -1
                this.mario.body.velocity.y = 0;
                this.mario.body.velocity.x = 0;
                this.mario.body.allowGravity = false;
                if(this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y + 20, 8, 1, 'Steps') != null)this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +20, 8, 1, 'Steps').worldX + 4;
                else if(this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') != null) this.mario.position.x = this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y+14, 8, 1, 'Steps').worldX + 4;
                if(this.cursors.down.isDown) this.mario.position.y +=0.5;
            }
        else if((this.cursors.up.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +10, 8, 1, 'Steps') == null) || (this.cursors.down.isDown && this.map.getTileWorldXY(this.mario.position.x, this.mario.position.y +14, 8, 1, 'Steps') == null)) this.mario.body.allowGravity = true;
        else if(!this.cursors.up.isDown && !this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) {
            if(this.walking_a.isPlaying)this.walking_a.stop();
        }
        
        if(this.poweredUp) this.powerCounter++;
        if(this.powerCounter > 700){
            this.poweredUp = false;
            this.powerCounter = 0;
            this.hammer_a.stop();
        } 
        
         this.spawnFireAnim.onComplete.add(this.updateOilBarrel, this);
        
        this.bodySize();
        this.updateScore();
        this.updateLives();
        this.updatePrincess();
        this.updateDonkey();
        //this.mario.frame = 18;
        this.death.onComplete.add(this.resetMario, this);
    },
    
    updateOilBarrel:function()
    {
        this.oilBarrel.animations.play('halfFire');
        new platformer.fireEnemy(this.game,this.oilBarrel.position.x+this.oilBarrel.width, this.oilBarrel.position.y+this.oilBarrel.height, 0, this);
    },
    
    updateDonkey:function()
    {
        this.donkey.animations.currentAnim.speed = 7-this.bonusSprite[0].frame;
        this.donkey.animations.currentAnim.onUpdate.add(this.checkDonkeyAction, this);
        this.donkey.animations.currentAnim.onComplete.add(this.getDonkeyAnim, this);
    },
    
    checkDonkeyAction:function()
    {
        if(this.donkey.animations.currentAnim.frame == 5)
            {
                if(this.donkey.animations.currentAnim.name == 'Horizontal_Normal') new platformer.barrel(this.game,this.donkey.position.x + this.donkey.width, 83, 'normalBarrel', 'roll', this);
                else new platformer.barrel(this.game,this.donkey.position.x + this.donkey.width, 83, 'blueBarrel', 'roll', this);
            }
        if(this.donkey.animations.currentAnim.frame == 4)
            {
                var randVal = this.game.rnd.integerInRange(1, 10);
                if(randVal >  3) new platformer.barrel(this.game,this.donkey.position.x + this.donkey.width / 2, 83, 'normalBarrel', 'fall', this);
                else new platformer.barrel(this.game,this.donkey.position.x + this.donkey.width / 2, 83, 'blueBarrel', 'fall', this);
            }
    },
           
    getDonkeyAnim:function()
    {
        var randVal = this.game.rnd.integerInRange(1, 100);
        if(randVal > 0 && randVal <= 15) this.donkey.animations.play('Default');
        else if(randVal > 15 && randVal <= 40) this.donkey.animations.play('Vertical');
        else if(randVal > 40 && randVal <= 90) this.donkey.animations.play('Horizontal_Normal');
        else this.donkey.animations.play('Horizontal_Blue');
        this.donkey.animations.currentAnim.enableUpdate = true;this.donkey.animations.currentAnim.enableUpdate = true;
    },
    
    updatePrincess:function()
    {
        this.helpAnimCount++;
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
        this.bonusSprite[this.bonusSprite.length-1].frame = parseInt(this.bonus.toString().charAt(2+this.bonusSprite.length-1))-1+10*2;
        for(var i = 0; i < this.bonusSprite.length-1; i++){
        this.bonusSprite[i].frame = parseInt(this.bonus.toString().charAt(2+i))+10*2;
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
        //this.game.debug.body(this.mario);
        //if(this.flame != null)this.game.debug.body(this.flame);
        //this.game.debug.body(this.propTops[0]);
        //this.game.debug.body(this.silverWatchers[0]);
    },
    
    hammerPowerUp:function()
    {
        this.poweredUp = true;
        this.hammer_a.play();
        
    },
    bodySize:function()
    {
      if(this.mario.frame == 17 && this.mario.body.blocked.down)this.mario.body.setSize(28,16, 3,10);
      else if(this.mario.frame == 18 && this.mario.body.blocked.down)this.mario.body.setSize(28,16, 5,10);
      else this.mario.body.setSize(8,14, 23,11);
    },
    resetMario:function()
    {
        this.backMusic.stop();
        this.lives--;
        console.log(this.lives);
        if(this.lives > 0)
        this.game.state.start('level_1', true, false, this.score, this.highScore, this.lives, this.bonus);
        else this.game.state.start('level_1', true, false, 0.000001, this.highScore, 5, 0.5001);
        
    },
}

