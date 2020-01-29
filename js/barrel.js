var platformer = platformer || {};

platformer.barrel = function(_game,_x,_y,_sprite, _anim, _level){
    Phaser.Sprite.call(this,_game,_x,_y,_sprite);
    this.anchor.setTo(.5);
    this.level = _level;
    this.speed = 75;
    this.health = 1;
    this.directionX = 1;
    if(_sprite == 'blueBarrel') this.blue = true;
    else this.blue = false;
    this.initial = _anim;
    _game.add.existing(this);
    this.animations.add('roll',[0, 1, 2, 3],10,true);
    this.animations.add('fall',[4,5],10,true);
    this.animations.play(_anim);
    _game.physics.arcade.enable(this);
    this.body.setSize(this.body.width - 12, this.body.height, this.body.offset.x+5, this.body.offset.y);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    if(this.initial == 'fall')this.body.bounce.set(0.8);
    this.collided = true;
    console.log(_sprite+' created');
};


platformer.barrel.prototype = Object.create(Phaser.Sprite.prototype);
platformer.barrel.prototype.constructor = platformer.barrel;

platformer.barrel.prototype.update = function(){
    if(this.animations.currentAnim.name == 'roll')
        {
            if(this.position.y < 88 || (this.position.y < 154 && this.position.y > 128) || (this.position.y < 220 && this.position.y > 194))
                this.directionX = 1;
            else this.directionX = -1;
            this.scale.x = this.directionX*-1;
        }
    else
    {
        console.log('blocked '+this.body.onFloor().toString());
        console.log('collided '+this.collided.toString());
        console.log('enabled '+this.body.onFloor().toString());
        this.directionX = 0;
        this.scale.x = 1;
        if(this.body.onFloor() == true && this.collided == false){
            this.body.position.x += this.level.mario.position.x * 0.033;
        }
        else if(this.body.onFloor() == false && this.collided == true) {
            this.body.enable = false;
            this.collided = false;
        }
        this.body.velocity.y -=10;
    }
    this.body.velocity.x = this.speed*this.directionX;
    if(this.collided == false || this.initial == 'roll'){
        if(this.level.game.physics.arcade.collide(this,this.level.walls))
        this.collided = true;
    }
};