var platformer = platformer || {};

platformer.scoreText = function(_game,_x,_y, _frame, _level){
    Phaser.Sprite.call(this,_game,_x,_y,'scoreText');
    _game.add.existing(this);
    this.frame = _frame;
    this.counter = 0;
};


platformer.scoreText.prototype = Object.create(Phaser.Sprite.prototype);
platformer.scoreText.prototype.constructor = platformer.scoreText;

platformer.scoreText.prototype.update = function(){
    this.counter++;
    if(this.counter >= 60) this.kill();
};