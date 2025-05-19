const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player, cursors, helpers = [], enemies = [], helperButton;
let nextEnemyTime = 0;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('helper', 'assets/helper.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('background', 'assets/tileset.png');
}

function create() {
  this.add.image(400, 300, 'background');
  player = this.physics.add.sprite(400, 300, 'player');
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  helperButton = this.add.text(650, 560, 'Criar Ajudante', { fill: '#0f0', fontSize: '20px' })
    .setInteractive()
    .on('pointerdown', () => {
      const helper = this.physics.add.sprite(player.x + 20, player.y, 'helper');
      helpers.push(helper);
    });

  this.time.addEvent({
    delay: 3000,
    loop: true,
    callback: () => {
      const enemy = this.physics.add.sprite(Math.random() * 800, Math.random() * 600, 'enemy');
      enemies.push(enemy);
    }
  });
}

function update() {
  player.setVelocity(0);
  if (cursors.left.isDown) player.setVelocityX(-200);
  if (cursors.right.isDown) player.setVelocityX(200);
  if (cursors.up.isDown) player.setVelocityY(-200);
  if (cursors.down.isDown) player.setVelocityY(200);

  helpers.forEach(helper => {
    const dx = player.x - helper.x;
    const dy = player.y - helper.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 30) {
      helper.setVelocity(dx, dy);
    } else {
      helper.setVelocity(0);
    }

    enemies.forEach(enemy => {
      const ex = enemy.x - helper.x;
      const ey = enemy.y - helper.y;
      const edist = Math.sqrt(ex * ex + ey * ey);
      if (edist < 40) {
        enemy.destroy();
      }
    });
  });

  enemies.forEach(enemy => {
    const dx = Math.random() * 2 - 1;
    const dy = Math.random() * 2 - 1;
    enemy.setVelocity(dx * 50, dy * 50);
  });
}
