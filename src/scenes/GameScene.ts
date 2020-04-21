import Phaser from 'phaser';

enum Keys {
  Ground = 'ground',
  Sky = 'sky',

  Dude = 'Dude',
}

export default class GameScene extends Phaser.Scene {
  player?: Phaser.Physics.Arcade.Sprite;

  platforms?: Phaser.Physics.Arcade.StaticGroup;

  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.spritesheet(Keys.Dude, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, Keys.Sky);

    this.createPlatforms();
    this.createPlayer();

    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
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
}
