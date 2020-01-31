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
    if(this.initial == 'fall')this.body.bounce.set(0.4);
    this.collided = 0;
    this.sumVal = 0;
    this.jumped = false;
};


platformer.barrel.prototype = Object.create(Phaser.Sprite.prototype);
platformer.barrel.prototype.constructor = platformer.barrel;

platformer.barrel.prototype.update = function(){
    if(this.level.game.physics.arcade.overlap(this,this.level.mario) && !this.level.poweredUp) this.level.mario.animations.play('death');
    if(this.animations.currentAnim.name == 'roll')
        {
            if(!this.jumped && this.level.mario.position.y < this.position.y && Math.abs(this.level.mario.position.y - this.position.y) < 30 && Math.abs(this.level.mario.position.x - this.position.x) < 5 && !this.level.poweredUp && this.level.mario.frame != 3)
                {
                    this.jumped = true;
                    new platformer.scoreText(this.level.game, this.position.x, this.position.y, 0, this.level);
                }
            else if(this.level.game.physics.arcade.overlap(this,this.level.mario) && this.level.poweredUp && this.level.mario.scale.x != this.scale.x)
        {
            var frame = 0;
            if(this.blue) frame = 4;
            else frame = 2;
            new platformer.bubbleEffect(this.level.game, this.position.x, this.position.y, frame, this.level);
            this.kill();
        }
            if(this.position.y < 88 || (this.position.y < 154 && this.position.y > 128) || (this.position.y < 220 && this.position.y > 194))
                this.directionX = 1;
            else this.directionX = -1;
            this.scale.x = this.directionX*-1;
            if(this.level.map.getTileWorldXY(this.position.x, this.position.y+this.height, 8, 1, 'Steps') != null && this.game.rnd.integerInRange(1, 20) == 3)
                this.animations.play('fall');
            else
            {
                this.body.velocity.x = this.speed*this.directionX;
                this.level.game.physics.arcade.collide(this,this.level.walls);
                if(this.blue && this.level.game.physics.arcade.collide(this,this.level.oilBarrel)) 
                {
                    this.level.oilBarrel.animations.play('fullFire');
                    this.kill();
                }
            }
        }
    else
    {
        if(this.level.game.physics.arcade.overlap(this,this.level.mario) && this.level.poweredUp)
        {
            var frame = 0;
            if(this.blue) frame = 4;
            else frame = 2;
            new platformer.bubbleEffect(this.level.game, this.position.x, this.position.y, frame, this.level);
            this.kill();
        }
        if(this.initial == 'fall')
            {
                switch(this.collided)
                    {
                        case 0:
                            if(this.position.y > 102 && this.level.game.physics.arcade.collide(this,this.level.walls))
                                this.collided++;
                            break;
                        case 1:
                            if(this.position.y > 135 && this.level.game.physics.arcade.collide(this,this.level.walls))
                                this.collided++;
                            break;
                        case 2:
                            if(this.position.y > 168 && this.level.game.physics.arcade.collide(this,this.level.walls))
                                this.collided++;
                            break;
                        case 3:
                            if(this.position.y > 201 && this.level.game.physics.arcade.collide(this,this.level.walls))
                                this.collided++;
                            break;
                        case 4:
                            if(this.position.y > 234 && this.level.game.physics.arcade.collide(this,this.level.walls))
                                {
                                  this.animations.play('roll');
                                    this.initial = 'roll';
                                }
                            break;
                    }
                if(this.body.velocity.y < 0)this.sumVal = (this.level.mario.position.x - this.position.x) * 0.033;
                if(this.sumVal > 0.5) this.sumVal = 0.5;
                this.body.position.x += this.sumVal;
            }
        else if(this.level.map.getTileWorldXY(this.position.x, this.position.y+this.height, 8, 1, 'Steps') == null)
            this.animations.play('roll');
        this.directionX = 0;
        this.scale.x = 1;
        this.body.velocity.y -=10;
        this.body.velocity.x = 0;
    }
};