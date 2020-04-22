import Phaser from 'phaser';

const formatScore = (score: number) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private score: number,
    style: Phaser.GameObjects.TextStyle,
  ) {
    super(scene, x, y, formatScore(score), style);

    this.score = score;
  }

  setScore(score: number) {
    this.score = score;
    this.updateScoreText();
  }

  add(points: number) {
    this.setScore(this.score + points);
  }

  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}
