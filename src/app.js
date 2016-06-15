import Phaser from 'phaser';

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update });

function preload() {
  console.log('loading assets...');
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
  console.log('assets loaded');
}

let score = 0;
let scoreText;

let platforms;
let player;
let cursors;
let stars;
let baddie;

function create() {
  console.log('create');

  // SETTING

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  var ledge = platforms.create(400, 400, 'ground');

  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');

  ledge.body.immovable = true;

  //  PLAYER
  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);


  // BADDIE
  baddie = game.add.sprite(32, game.world.height - 100, 'baddie');
  game.physics.arcade.enable(baddie);
  baddie.body.bounce.y = 0.9;
  baddie.body.gravity.y = 30;
  baddie.animations.add('left', [0, 1], 10, true);
  baddie.animations.add('right', [2, 3], 10, true);


  //STARS
  stars = game.add.group();

  stars.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'dude');

    //  Let gravity do its thing
    star.body.gravity.y = 6;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //CURSORS
  cursors = game.input.keyboard.createCursorKeys();

  //SCORE
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
  // console.log('update'); //lol

  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(baddie, platforms);

  // PLAYER

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  baddie.body.velocity.x = 0;

  if (cursors.left.isDown)
  {
    moveLeft(player, 150);
  }
  else if (cursors.right.isDown)
  {
    moveRight(player, 150);
  }
  else
  {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down)
  {
    player.body.velocity.y = -350;
  }


  // BADDIE

  // move randomly behaviour
  const direction = (Math.random() * 100) % 2;
  

  const velocity = Math.random() * 100;

  if (direction) {
    moveLeft(baddie, velocity);
  } else {
    moveRight(baddie, velocity);
  }



  game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

console.log('initialised');

document.write('initialised 2');

console.log(game);

function collectStar (player, star) {

  // Removes the star from the screen
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;
}

function killEnemy (player, enemy) {
  enemy.kill();

  score += 20;
  scoreText.text = 'Score: ' + score;
}

function moveRight (sprite, velocity) {
  sprite.body.velocity.x = velocity;
  sprite.animations.play('right');
}

function moveLeft (sprite, velocity) {
  sprite.body.velocity.x = -velocity;
  sprite.animations.play('left');
}