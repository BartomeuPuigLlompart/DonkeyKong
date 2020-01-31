var platformer = platformer || {};

platformer.fireEnemy = function(_game,_x,_y,_sumAnimVal, _level){
    Phaser.Sprite.call(this,_game,_x,_y,'flameEnemy');
    this.anchor.setTo(.5);
    this.level = _level;
    this.health = 1;
    _game.add.existing(this);
    this.animations.add('Normal',[0+_sumAnimVal, 1+_sumAnimVal],5,true);
    this.animations.add('Blue',[2+_sumAnimVal,3+_sumAnimVal],5,true);
    this.animations.play('Normal');
    _game.physics.arcade.enable(this);
    this.body.setSize(this.body.width - 6, this.body.height-6, this.body.offset.x+5, this.body.offset.y+3);
   
    this.sumVal = 0;
    this.goUp = false;
    this.goDown = false;
    
    this.immovable = true;
    
    this.randomMoveCounter = 0;
    this.randomMoveRef = 300;
    this.randomMove = false;
    this.randomTarget = this.position.x;
};


platformer.fireEnemy.prototype = Object.create(Phaser.Sprite.prototype);
platformer.fireEnemy.prototype.constructor = platformer.fireEnemy;

platformer.fireEnemy.prototype.update = function(){
    this.randomMoveCounter++;
    if(this.randomMoveCounter > this.randomMoveRef)
        {
            this.randomMove = !this.randomMove;
            this.randomMoveCounter = 0;
            this.randomMoveRef = this.level.game.rnd.integerInRange(100, 300);
            this.randomTarget = gameOptions.level1Width - this.position.x;
        }
        if(this.position.x > this.previousPosition.x)
        {
            this.scale.x = 1;
        }
        else
        {
            this.scale.x = -1;
        }
    if(!this.goUp && !this.goDown){
        if(this.level.game.physics.arcade.overlap(this,this.level.mario) && this.level.poweredUp)
        {
            new platformer.bubbleEffect(this.level.game, this.position.x, this.position.y, this.level.game.rnd.integerInRange(2, 4), this.level);
            this.level.enemyCounter--;
            this.kill();
        }
    this.level.game.physics.arcade.collide(this,this.level.walls);
    if(this.level.map.getTileWorldXY(this.position.x, this.position.y, 8, 1, 'Steps') != null && this.level.mario.position.y + (this.level.mario.height / 2) < this.position.y && this.game.rnd.integerInRange(1, 40) == 3)
        {
            this.body.allowGravity = false;
            this.goUp = true;
            this.goDown = false;
        }
    else if(this.level.map.getTileWorldXY(this.position.x, this.position.y+this.height, 8, 1, 'Steps') != null && this.level.mario.position.y + (this.level.mario.height / 2) > this.position.y && this.game.rnd.integerInRange(1, 40) == 3)
        {
            this.body.allowGravity = false;
            this.goUp = false;
            this.goDown = true;
        }
    else if(!this.randomMove && Math.abs(this.position.x - this.level.mario.position.x) > 5)
        {
    this.sumVal = (this.level.mario.position.x - this.position.x) * 0.033;
    this.sumVal = (this.sumVal / Math.abs(this.sumVal))*0.5;
    if(!isNaN(this.body.position.x + this.sumVal))this.body.position.x += this.sumVal;
        }
    else if(this.randomMove)
        {
            this.sumVal = (this.randomTarget - this.position.x) * 0.033;
            this.sumVal = (this.sumVal / Math.abs(this.sumVal))*0.5;
            if(!isNaN(this.body.position.x + this.sumVal))this.body.position.x += this.sumVal;
        }
    }
    else if(this.goUp){
        if(this.level.game.physics.arcade.overlap(this,this.level.mario) && this.level.poweredUp)
        {
            new platformer.bubbleEffect(this.level.game, this.position.x, this.position.y, this.level.game.rnd.integerInRange(2, 4), this.level);
            this.level.enemyCounter--;
            this.kill();
        }
        this.position.y -=0.5;
        if(this.level.map.getTileWorldXY(this.position.x, this.position.y, 8, 1, 'Steps') == null){
            this.goUp = false;
            this.goDown = false;
            this.body.allowGravity = true;
        }
    }
    else if(this.goDown){
        if(this.level.game.physics.arcade.overlap(this,this.level.mario) && this.level.poweredUp)
        {
            new platformer.bubbleEffect(this.level.game, this.position.x, this.position.y, this.level.game.rnd.integerInRange(2, 4), this.level);
            this.level.enemyCounter--;
            this.kill();
        }
        this.position.y +=0.5;
        if(this.level.map.getTileWorldXY(this.position.x, this.position.y+this.height, 8, 1, 'Walls') != null){
            this.goUp = false;
            this.goDown = false;
            this.body.allowGravity = true;
        }
    }
    if(this.level.poweredUp) this.animations.play('Blue');
    else this.animations.play('Normal');
};