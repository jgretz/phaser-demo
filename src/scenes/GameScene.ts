/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';

enum Keys {
  Ground = 'ground',
  Sky = 'sky',
  Star = 'star',
  Bomb = 'bomb',

  Dude = 'Dude',
}

export default class GameScene extends Phaser.Scene {
  player?: Phaser.Physics.Arcade.Sprite;

  platforms?: Phaser.Physics.Arcade.StaticGroup;

  stars?: Phaser.Physics.Arcade.Group;

  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  scoreLabel?: ScoreLabel;

  constructor() {
    super('game-scene');
  }

  // Preload
  preload() {
    this.load.image(Keys.Sky, 'assets/sky.png');
    this.load.image(Keys.Ground, 'assets/platform.png');
    this.load.image(Keys.Star, 'assets/star.png');
    this.load.image(Keys.Bomb, 'assets/bomb.png');

    this.load.spritesheet(Keys.Dude, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  // Create
  create() {
    this.add.image(400, 300, Keys.Sky);

    this.createPlatforms();
    this.createPlayer();
    this.createStars();
    this.createScoreLabel(16, 16, 0);

    if (this.player && this.platforms && this.stars) {
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.stars, this.platforms);

      this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, Keys.Ground).setScale(2).refreshBody();

    this.platforms.create(600, 400, Keys.Ground);
    this.platforms.create(50, 250, Keys.Ground);
    this.platforms.create(750, 220, Keys.Ground);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, Keys.Dude);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(Keys.Dude, {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: Keys.Dude, frame: 4}],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(Keys.Dude, {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
  }

  createStars() {
    this.stars = this.physics.add.group({
      key: Keys.Star,
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70},
    });

    const setBehavior = (child: Phaser.Physics.Arcade.Sprite) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setCollideWorldBounds(true);
    };

    this.stars.children.iterate(setBehavior);
  }

  createScoreLabel(x: number, y: number, score: number) {
    const style = {fontSize: '32px', fill: '#000'};

    this.scoreLabel = new ScoreLabel(this, x, y, score, style);
    if (this.scoreLabel) {
      this.add.existing(this.scoreLabel);
    }
  }

  // Update
  update() {
    if (!this.cursors || !this.player) {
      return;
    }

    if (this.cursors?.left?.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (this.cursors?.right?.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors?.up?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
    star.disableBody(true, true);

    if (this.scoreLabel) {
      this.scoreLabel.add(10);
    }
  }
}
