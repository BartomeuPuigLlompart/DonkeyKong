var platformer = platformer || {};

platformer.bubbleEffect = function(_game,_x,_y, _frameScore, _level){
    Phaser.Sprite.call(this,_game,_x,_y,'bubbleEffect');
    _game.add.existing(this);
    this.anchor.setTo(.5);
    this.score = _frameScore;
    this.level = _level;
    _level.game.add.audio('kill').play();
    this.animations.add('effect', [0,1,2,3,4,5],5, false);
    this.animations.play('effect');
    this.animations.currentAnim.onComplete.add(this.setScore, _level, _frameScore,  this, this.level);
};


platformer.bubbleEffect.prototype = Object.create(Phaser.Sprite.prototype);
platformer.bubbleEffect.prototype.constructor = platformer.bubbleEffect;
platformer.bubbleEffect.prototype.setScore = function(_level, _frameScore, _instance){
 new platformer.scoreText(_instance.level.game, _instance.position.x, _instance.position.y, _instance.score, _instance.level);
    _instance.kill();
};
