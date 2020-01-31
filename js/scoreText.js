var platformer = platformer || {};

platformer.scoreText = function(_game,_x,_y, _frame, _level){
    Phaser.Sprite.call(this,_game,_x,_y,'scoreText');
    _game.add.existing(this);
    this.frame = _frame;
    this.counter = 0;
    this.anchor.setTo(.5);
    
    switch(this.frame){
        case 0:
            _level.score += 0.000100;
            break;
        case 1:
            _level.score += 0.000200;
            break;
        case 2:
            _level.score += 0.000300;
            break;
        case 3:
            _level.score += 0.000500;
            break;
        case 4:
            _level.score += 0.000800;
            break;
    }
    
    this.game.add.audio('bonus').play();
    
};


platformer.scoreText.prototype = Object.create(Phaser.Sprite.prototype);
platformer.scoreText.prototype.constructor = platformer.scoreText;

platformer.scoreText.prototype.update = function(){
    this.counter++;
    if(this.counter >= 60) this.kill();
};