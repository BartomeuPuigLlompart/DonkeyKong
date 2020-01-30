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
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.sumVal = 0;
    this.goUp = false;
    this.goDown = false;
};


platformer.fireEnemy.prototype = Object.create(Phaser.Sprite.prototype);
platformer.fireEnemy.prototype.constructor = platformer.fireEnemy;

platformer.fireEnemy.prototype.update = function(){
    if(!this.goUp && !this.goDown){
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
    if(Math.abs(this.position.x - this.level.mario.position.x) > this.width)
        {
    this.sumVal = (this.level.mario.position.x - this.position.x) * 0.033;
    this.sumVal = (this.sumVal / Math.abs(this.sumVal))*0.5;
    this.body.position.x += this.sumVal;
    this.scale.x = this.sumVal / Math.abs(this.sumVal);
        }
    }
    else if(this.goUp){
        this.position.y -=0.5;
        if(this.level.map.getTileWorldXY(this.position.x, this.position.y, 8, 1, 'Steps') == null){
            this.goUp = false;
            this.goDown = false;
            this.body.allowGravity = true;
        }
    }
    else if(this.goDown){
        this.position.y +=0.5;
        if(this.level.map.getTileWorldXY(this.position.x, this.position.y+this.height, 8, 1, 'Walls') != null){
            this.goUp = false;
            this.goDown = false;
            this.body.allowGravity = true;
        }
    }
};