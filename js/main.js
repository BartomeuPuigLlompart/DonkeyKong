var platformer = platformer || {};

var gameOptions={
    gameWidth:224,
    gameHeight:256,
    level1Width:224,
    level1Height:256,
    heroGravity:200,
    heroSpeed:30,
    heroJump:70,
    bulletSpeed:300
}

platformer.game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,null,this,false,false);

platformer.game.state.add('level_1',platformer.level1);

platformer.game.state.start('level_1');






