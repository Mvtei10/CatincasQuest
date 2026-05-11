// --- GENERATORI TEXTURI ---
function generateTrumpetCanvas() {
    let canvas = document.createElement('canvas'); canvas.width = 100; canvas.height = 60;
    let ctx = canvas.getContext('2d'); ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 25, 70, 10); ctx.beginPath(); ctx.moveTo(70, 30); ctx.lineTo(100, 10); ctx.lineTo(100, 50); ctx.fill(); return canvas;
}
function generateHeartCanvas(c) {
    let canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
    let ctx = canvas.getContext('2d'); ctx.fillStyle = c;
    ctx.beginPath(); ctx.moveTo(16, 28); ctx.bezierCurveTo(16, 25, 2, 18, 2, 10);
    ctx.bezierCurveTo(2, 2, 14, 2, 16, 8); ctx.bezierCurveTo(18, 2, 30, 2, 30, 10); ctx.fill(); return canvas;
}
function generateCatincaBodyCanvas() {
    let canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 48;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080'; ctx.fillRect(8, 16, 16, 14); 
    ctx.fillStyle = '#4682B4'; ctx.fillRect(10, 30, 12, 14);
    ctx.fillStyle = '#ffdbac'; ctx.fillRect(5, 16, 3, 12); ctx.fillRect(24, 16, 3, 12); 
    ctx.fillStyle = '#ffffff'; ctx.fillRect(10, 44, 4, 4); ctx.fillRect(18, 44, 4, 4);
    return canvas;
}
function generateConeCanvas() {
    let canvas = document.createElement('canvas'); canvas.width = 40; canvas.height = 60;
    let ctx = canvas.getContext('2d'); ctx.fillStyle = '#ff4d00';
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(40, 60); ctx.lineTo(0, 60); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(10, 25, 20, 10); return canvas;
}
function generateRealisticCloud(w, a) {
    let canvas = document.createElement('canvas'); canvas.width = w; canvas.height = 60;
    let ctx = canvas.getContext('2d'); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(w/2, 30, w/2, 25, 0, 0, Math.PI*2); ctx.fill(); return canvas;
}
function generateConfettiCanvas() {
    let canvas = document.createElement('canvas'); canvas.width = 10; canvas.height = 10;
    let ctx = canvas.getContext('2d'); ctx.fillStyle = '#ff69b4'; ctx.fillRect(0, 0, 10, 10); return canvas;
}

// --- SCENA 1: MENIUL PRINCIPAL ---
class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    preload() {
        this.textures.addCanvas('heart_white', generateHeartCanvas('#ffffff'));
        this.textures.addCanvas('trumpet_gold', generateTrumpetCanvas());
        this.textures.addCanvas('confetti', generateConfettiCanvas());
        this.load.audio('menu_music', 'assets/backround1.mp3');
        this.load.audio('play_music', 'assets/music.mp3');
    }
    create() {
        this.add.rectangle(533, 300, 1067, 600, 0xffb6c1);
        if (!this.menuMusic) this.menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
        for(let i=0; i<40; i++) {
            let conf = this.add.image(Phaser.Math.Between(0, 1067), Phaser.Math.Between(-600, 0), 'confetti');
            this.tweens.add({ targets: conf, y: 650, x: '+=50', angle: 360, duration: Phaser.Math.Between(3000, 6000), loop: -1 });
            let heart = this.add.image(Phaser.Math.Between(0, 1067), Phaser.Math.Between(600, 1000), 'heart_white').setAlpha(0.5);
            this.tweens.add({ targets: heart, y: -100, x: '+=50', duration: Phaser.Math.Between(4000, 8000), loop: -1, delay: Phaser.Math.Between(0, 5000) });
        }
        this.title = this.add.text(533, 160, "Catinca's Quest", { fontSize: '95px', fill: '#fff', fontWeight: 'bold' }).setOrigin(0.5);
        this.tweens.add({ targets: this.title, y: 180, angle: { from: -3, to: 3 }, scale: { from: 1, to: 1.1 }, duration: 2000, yoyo: true, loop: -1, ease: 'Sine.easeInOut' });
        const trumpetPos = [{x:100, y:480, a:-20}, {x:250, y:520, a:-10}, {x:967, y:480, a:20, f:true}, {x:817, y:520, a:10, f:true}];
        trumpetPos.forEach(p => {
            let t = this.add.image(p.x, p.y, 'trumpet_gold').setAngle(p.a).setFlipX(p.f || false);
            this.tweens.add({ targets: t, scale: 1.2, duration: 500, yoyo: true, loop: -1 });
        });
        let startBtn = this.add.rectangle(533, 360, 320, 85, 0x2ecc71).setInteractive();
        this.add.text(533, 360, "START ", { fontSize: '42px', fill: '#fff' }).setOrigin(0.5);
        let optBtn = this.add.rectangle(533, 475, 320, 85, 0x7f8c8d).setInteractive();
        this.add.text(533, 475, "Poveste ", { fontSize: '42px', fill: '#fff' }).setOrigin(0.5);
        this.input.once('pointerdown', () => { if (!this.menuMusic.isPlaying) this.menuMusic.play(); });
        startBtn.on('pointerdown', () => { this.sound.stopAll(); this.scene.start('PlayScene'); });
        optBtn.on('pointerdown', () => this.showOptions());
    }
    showOptions() {
        let p = this.add.container(0, 0).setDepth(2000);
        p.add(this.add.rectangle(533, 300, 1067, 600, 0x000000, 0.9));
        let msg = "La multi ani Catincutz! ❤️\n\nTrebuie sa ajungi cat mai repede acasa ca sa te pregatesti pentru petrecerea de ziua ta. Ai grija drumul este plin de obstacole. Acasa te asteapta cateva probe.\n\n🎉 Mult succes! 🎂";
        p.add(this.add.text(533, 300, msg, { fontSize: '26px', align: 'center', fill: '#fff', wordWrap: { width: 800 }, fontStyle: 'bold' }).setOrigin(0.5));
        let b = this.add.rectangle(533, 500, 200, 60, 0xff1493).setInteractive();
        p.add(b); p.add(this.add.text(533, 500, "ÎNAPOI", { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));
        b.on('pointerdown', () => p.destroy());
    }
}

// --- SCENA 2: NIVELUL CU CASTELUL ---
class PlayScene extends Phaser.Scene {
    constructor() { super('PlayScene'); }
    preload() {
        this.load.image('fata_catinca', 'assets/fata.png'); 
        this.textures.addCanvas('catinca_body', generateCatincaBodyCanvas());
        this.textures.addCanvas('heart_img', generateHeartCanvas('#ff69b4'));
        this.textures.addCanvas('cone_img', generateConeCanvas());
        this.textures.addCanvas('cloud_decor', generateRealisticCloud(100, 1));
        this.textures.addCanvas('cloud_jump', generateRealisticCloud(160, 0.5));
        this.load.image('ground_tile', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.audio('hurt_1', 'assets/hurt_1.mp3');
        this.load.audio('hurt_2', 'assets/hurt_2.mp3');
        this.load.audio('hurt_3', 'assets/hurt_3.mp3');
    }
    create() {
        const worldWidth = 12000;
        this.physics.world.setBounds(0, 0, worldWidth, 600);
        this.isGameOver = false; 
        this.isHurt = false;
        this.hitCount = 0; 
        this.lives = 3;
        this.playMusic = this.sound.add('play_music', { loop: true, volume: 0.5 });
        this.playMusic.play();

        this.add.graphics().fillGradientStyle(0xffc0cb, 0xffc0cb, 0xFFA07A, 0xFFA07A, 1).fillRect(0, 0, worldWidth, 480);
        for (let i = 0; i < 50; i++) {
            this.add.image(i * 350 + Phaser.Math.Between(0, 100), Phaser.Math.Between(50, 200), 'cloud_decor').setScrollFactor(0.2).setAlpha(0.6);
        }
        let platforms = this.physics.add.staticGroup();
        for (let i = 0; i < worldWidth / 400; i++) {
            platforms.create(i * 400, 480, 'ground_tile').setOrigin(0,0).setScale(1.1, 1).setTint(0x2d5a27).refreshBody();
        }
        const emojis = ["🏠", "🌳", "🏢", "🌲", "🏘️", "🌳"];
        for (let i = 0; i < 40; i++) {
            let xPos = 800 + (i * 300);
            if (xPos < worldWidth - 1500) {
                this.add.text(xPos, 490, emojis[i % emojis.length], { fontSize: '200px' }).setOrigin(0.5, 1);
            }
        }
        this.castle = this.add.text(worldWidth - 600, 505, "🏰", { fontSize: '500px' }).setOrigin(0.5, 1);
        this.physics.add.existing(this.castle, true);

        this.playerContainer = this.add.container(200, 300);
        this.bodySprite = this.add.sprite(0, 20, 'catinca_body').setScale(2);
        this.headImage = this.add.image(0, -10, 'fata_catinca').setScale(0.06); 
        this.playerContainer.add([this.bodySprite, this.headImage]);
        this.physics.add.existing(this.playerContainer);
        this.playerContainer.body.setCollideWorldBounds(true).setDragX(1000); 
        this.physics.add.collider(this.playerContainer, platforms);

        this.obstacles = this.physics.add.staticGroup();
        this.jumpClouds = this.physics.add.staticGroup();
        for (let i = 1; i < 22; i++) {
            let x = 1500 + (i * 600);
            if (i % 7 === 0) {
                this.jumpClouds.create(x + 100, 300, 'cloud_jump').refreshBody();
                for(let j=0; j<5; j++) this.obstacles.create(x + (j*40), 480, 'cone_img').setOrigin(0.5, 1).refreshBody();
            } else {
                let num = Phaser.Math.Between(1, 3);
                for(let j=0; j<num; j++) this.obstacles.create(x + (j*45), 480, 'cone_img').setOrigin(0.5, 1).refreshBody();
            }
        }
        this.physics.add.collider(this.playerContainer, this.jumpClouds);
        this.physics.add.overlap(this.playerContainer, this.obstacles, (p, o) => handleDamage(this, p, o));

        this.physics.add.overlap(this.playerContainer, this.castle, () => {
            if (this.playerContainer.x > worldWidth - 650 && !this.isGameOver) {
                this.isGameOver = true; this.physics.pause();
                this.tweens.add({
                    targets: this.playerContainer, alpha: 0, scale: 0.1, x: worldWidth - 600, duration: 1000,
                    onComplete: () => { this.showWinPopup(); }
                });
            }
        });
        this.cameras.main.startFollow(this.playerContainer, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, worldWidth, 600);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.hearts = [];
        for (let i = 0; i < 3; i++) this.hearts[i] = this.add.image(60 + (i * 45), 60, 'heart_img').setScrollFactor(0).setDepth(10);
        setupControls(this);
    }
    showWinPopup() {
        let popup = this.add.container(0, 0).setDepth(5000).setScrollFactor(0);
        popup.add(this.add.rectangle(533, 300, 1067, 600, 0x000000, 0.85));
        let winText = "Felicitari!\n\nAcum ca ai ajuns acasa, este timpul sa te pregatesti. Vei incepe cu machiajul.";
        popup.add(this.add.text(533, 300, winText, { fontSize: '32px', align: 'center', fill: '#ff1493', fontWeight: 'bold', wordWrap: { width: 700 } }).setOrigin(0.5));
        this.time.delayedCall(4000, () => { this.sound.stopAll(); this.scene.start('MakeupScene'); });
    }
    update() {
        if (this.isGameOver || this.isHurt) return;
        const playerSpeed = 350;
        if (this.cursors.left.isDown || this.isMovingLeft) { 
            this.playerContainer.body.setVelocityX(-playerSpeed); 
            this.bodySprite.flipX = true; this.headImage.flipX = true;
        }
        else if (this.cursors.right.isDown || this.isMovingRight) { 
            this.playerContainer.body.setVelocityX(playerSpeed); 
            this.bodySprite.flipX = false; this.headImage.flipX = false;
        }
        else { this.playerContainer.body.setAccelerationX(0); }
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.playerContainer.body.touching.down) this.playerContainer.body.setVelocityY(-850);
    }
}

// CONFIGURAȚIE GLOBALĂ
const config = {
    type: Phaser.AUTO,
    width: 1067,   // Lățimea de bază
    height: 600,   // Înălțimea de bază
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1600 },
            debug: false
        }
    },
    // --- ACEASTA ESTE SECȚIUNEA PENTRU FULLSCREEN ȘI LANDSCAPE ---
    scale: {
        mode: Phaser.Scale.FIT,           // Face jocul să ocupe tot ecranul disponibil păstrând proporțiile
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centrează jocul pe ecran
        orientation: Phaser.Scale.Orientation.LANDSCAPE // Forțează modul landscape pe mobil
    },
    scene: [PreloaderScene, MenuScene, PlayScene, MakeupScene, DressupScene, SubwaySurferScene, PartyScene]
};

const game = new Phaser.Game(config);

function handleDamage(scene, p, o) {
    if (scene.isHurt || scene.isGameOver) return;
    scene.isHurt = true;
    
    let soundIndex = (scene.hitCount % 3) + 1;
    let soundKey = `hurt_${soundIndex}`;
    
    if (scene.sound.get(soundKey) || scene.load.cacheManager.audio.exists(soundKey)) {
        scene.sound.play(soundKey);
    }
    
    scene.lives--; 
    if (scene.hearts[scene.lives]) scene.hearts[scene.lives].setVisible(false);
    
    scene.cameras.main.shake(200, 0.02);
    
    // Knockback
    scene.playerContainer.body.setVelocityX(scene.bodySprite.flipX ? 400 : -400); 
    scene.playerContainer.body.setVelocityY(-300);
    
    scene.hitCount++;
    
    if (scene.lives <= 0) { 
        scene.isGameOver = true;
        scene.physics.pause();
        showGameOverPopup(scene);
    } else { 
        scene.playerContainer.setAlpha(0.5); 
        scene.time.delayedCall(1000, () => { 
            scene.playerContainer.setAlpha(1); 
            scene.isHurt = false; 
        }); 
    }
}

function showGameOverPopup(scene) {
    let popup = scene.add.container(0, 0).setDepth(10000).setScrollFactor(0);
    popup.add(scene.add.rectangle(533, 300, 1067, 600, 0x000000, 0.9));
    
    let gameOverText = scene.add.text(533, 250, "Aoleu! Te-ai lovit foarte grav! 🤕🚑\n\nJocul se va reseta in:", { 
        fontSize: '32px', fill: '#ff0000', fontWeight: 'bold', align: 'center' 
    }).setOrigin(0.5);
    
    let timerValue = 5;
    let timerText = scene.add.text(533, 380, timerValue.toString(), { 
        fontSize: '64px', fill: '#ffffff', fontWeight: 'bold' 
    }).setOrigin(0.5);
    
    popup.add([gameOverText, timerText]);

    scene.time.addEvent({
        delay: 1000,
        repeat: 4,
        callback: () => {
            timerValue--;
            timerText.setText(timerValue.toString());
            if (timerValue === 0) {
                scene.sound.stopAll();
                scene.scene.restart();
            }
        }
    });
}

function setupControls(scene) {
    let s = { fontSize: '70px' };
    let l = scene.add.text(80, 530, "⬅️", s).setInteractive().setScrollFactor(0).setDepth(100);
    let r = scene.add.text(220, 530, "➡️", s).setInteractive().setScrollFactor(0).setDepth(100);
    let j = scene.add.circle(950, 530, 50, 0xff69b4).setInteractive().setScrollFactor(0).setDepth(100);
    l.on('pointerdown', () => scene.isMovingLeft = true); l.on('pointerup', () => scene.isMovingLeft = false);
    r.on('pointerdown', () => scene.isMovingRight = true); r.on('pointerup', () => scene.isMovingRight = false);
    j.on('pointerdown', () => { if (scene.playerContainer.body.touching.down) scene.playerContainer.body.setVelocityY(-850); });
}
