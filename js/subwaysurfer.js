class SubwaySurferScene extends Phaser.Scene {
    constructor() {
        super('SubwaySurferScene');
    }

    init() {
        this.sound.stopAll(); 
        this.isGameOver = false;
        this.gameStarted = false;
        this.gameSpeed = 1.5;     // START: 1.5
        this.maxSpeed = 3.5;      // MAXIM: 3.5
        this.cakesCollected = 0;
        this.targetCakes = 30;    // Obiectiv: 30 de torturi
        this.currentLane = 1;
        this.lanes = [];
    }

    preload() {
        this.generateTextures();
        this.load.audio('condu_bg', 'assets/condu.mp3');
        this.load.audio('coin_sound', 'assets/coins.mp3');
        this.load.audio('fart_sound', 'assets/fart.mp3'); 
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const roadWidth = w * 0.6;
        const roadStart = (w - roadWidth) / 2;
        this.lanes = [
            roadStart + (roadWidth * 0.15),
            roadStart + (roadWidth * 0.5),
            roadStart + (roadWidth * 0.85)
        ];

        this.add.rectangle(w / 2, h / 2, w, h, 0x222222).setDepth(0); 
        this.add.rectangle(w / 2, h / 2, roadWidth, h, 0x1a1a1a).setDepth(1); 

        this.roadLines = this.add.group();
        for (let i = 0; i < 15; i++) {
            let lineL = this.add.rectangle(roadStart + roadWidth * 0.33, i * 120, 8, 50, 0xffffff, 0.4).setDepth(2);
            let lineR = this.add.rectangle(roadStart + roadWidth * 0.66, i * 120, 8, 50, 0xffffff, 0.4).setDepth(2);
            this.roadLines.addMultiple([lineL, lineR]);
        }

        this.player = this.add.sprite(this.lanes[this.currentLane], h - 150, 'camaro_mov').setScale(0.6).setDepth(10);
        this.physics.add.existing(this.player);
        this.player.body.setAllowGravity(false);

        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        this.createUI(w, h);
        this.showIntro(w, h);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.createTouchControls(w, h);

        this.physics.add.overlap(this.player, this.obstacles, this.onCrash, null, this);
        this.physics.add.overlap(this.player, this.collectibles, this.onCollectCake, null, this);
    }

    update() {
        if (!this.gameStarted || this.isGameOver) return;
        const h = this.cameras.main.height;

        this.roadLines.getChildren().forEach(line => {
            line.y += this.gameSpeed;
            if (line.y > h + 100) line.y = -100;
        });

        if (this.gameSpeed < this.maxSpeed) { 
            this.gameSpeed += 0.0005; 
        }

        [this.obstacles, this.collectibles].forEach(group => {
            group.getChildren().forEach(obj => {
                obj.y += this.gameSpeed;
                if (obj.y > h + 150) obj.destroy();
            });
        });

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) this.changeLane(-1);
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.changeLane(1);
    }

    showIntro(w, h) {
        this.introContainer = this.add.container(0, 0).setDepth(2000);
        let overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 1);
        
        // Mesaj ajustat (fără referințe la timp)
        let msg = "Matei este în drum spre tine! 🚗\nAjută-l să strângă cele 30 de bucăți de tort 🍰\nși să le aducă întregi la petrecere. 🎂\n\n\n\nMult succes, Schumacher!";
        
        let introText = this.add.text(w / 2, h / 2 - 50, msg, { 
            fontSize: '28px', fill: '#ffffff', align: 'center', fontStyle: 'bold', lineSpacing: 10 
        }).setOrigin(0.5);

        let startBtn = this.add.rectangle(w / 2, h / 2 + 200, 250, 70, 0x2ecc71).setInteractive();
        let startTxt = this.add.text(w / 2, h / 2 + 200, "START JOC", { fontSize: '26px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        this.introContainer.add([overlay, introText, startBtn, startTxt]);
        startBtn.on('pointerdown', () => {
            this.introContainer.destroy();
            this.startGame();
        });
    }

    startGame() {
        this.gameStarted = true;
        if (this.cache.audio.exists('condu_bg')) {
            this.bgMusic = this.sound.add('condu_bg', { loop: true, volume: 0.4 });
            this.bgMusic.play();
        }
        this.spawnTimer = this.time.addEvent({ delay: 650, callback: this.spawnEverything, callbackScope: this, loop: true });
    }

    spawnEverything() {
        if (!this.gameStarted || this.isGameOver) return;
        let lane = Phaser.Math.Between(0, 2);
        let rand = Phaser.Math.Between(0, 100);
        
        if (rand < 40) { 
            this.obstacles.create(this.lanes[lane], -150, 'traffic_car').setScale(0.7).setDepth(5);
        } else { 
            this.collectibles.create(this.lanes[lane], -150, 'item_cake').setScale(1.0).setDepth(5);
        }
    }

    createTouchControls(w, h) {
        const btnY = h - 70;
        const createBtn = (x, icon, dir) => {
            let btnContainer = this.add.container(x, btnY).setDepth(1000);
            let bg = this.add.rectangle(0, 0, 110, 90, 0x34495e, 0.9).setOrigin(0.5).setInteractive();
            let txt = this.add.text(0, 0, icon, { fontSize: '45px' }).setOrigin(0.5);
            btnContainer.add([bg, txt]);

            bg.on('pointerdown', () => {
                this.changeLane(dir);
                bg.setFillStyle(0x1abc9c);
                btnContainer.setScale(0.9);
            });
            bg.on('pointerup', () => {
                bg.setFillStyle(0x34495e);
                btnContainer.setScale(1);
            });
        };
        createBtn(w * 0.15, "⬅️", -1);
        createBtn(w * 0.85, "➡️", 1);
    }

    changeLane(dir) {
        if (this.isGameOver) return;
        let newLane = this.currentLane + dir;
        if (newLane >= 0 && newLane <= 2) {
            this.currentLane = newLane;
            if (this.moveTween) this.moveTween.stop();
            this.moveTween = this.tweens.add({
                targets: this.player,
                x: this.lanes[this.currentLane],
                duration: 150,
                ease: 'Cubic.easeOut'
            });
        }
    }

    onCrash() {
        if (this.isGameOver) return;
        this.cameras.main.shake(200, 0.02);
        if (this.cache.audio.exists('fart_sound')) this.sound.play('fart_sound');
        
        this.cakesCollected = Math.max(0, this.cakesCollected - 1);
        this.cakeCountText.setText(`🍰: ${this.cakesCollected}/${this.targetCakes}`);
        
        this.player.setTint(0xff0000);
        this.time.delayedCall(300, () => { if(this.player) this.player.clearTint(); });
        this.obstacles.clear(true, true);
    }

    onCollectCake(p, cake) {
        if (this.isGameOver) return;
        cake.destroy();
        this.cakesCollected++;
        this.cakeCountText.setText(`🍰: ${this.cakesCollected}/${this.targetCakes}`);
        
        if (this.cache.audio.exists('coin_sound')) this.sound.play('coin_sound');

        if (this.cakesCollected >= this.targetCakes) this.winGame();
    }

    createUI(w, h) {
        // Afișăm doar scorul de torturi în dreapta sus
        this.cakeCountText = this.add.text(w - 20, 30, `🍰: 0/${this.targetCakes}`, { 
            fontSize: '28px', fill: '#fff', fontStyle: 'bold' 
        }).setOrigin(1, 0).setDepth(100);
    }

    winGame() {
        this.isGameOver = true;
        this.physics.pause();
        if (this.bgMusic) this.bgMusic.stop();
        
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w/2, h/2, w, h, 0xffffff, 0.95).setDepth(5000);
        
        this.add.text(w/2, h/2, "Matei a ajuns la petrecere, \n iar tortul este intreg! 🎂\nE timpul pentru cadou!", { 
            fontSize: '38px', fill: '#ff1493', align: 'center', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(5001);

        // Tranziție către PartyScene
        this.time.delayedCall(3000, () => {
            this.scene.start('PartyScene');
        });
    }

    generateTextures() {
        let p = this.textures.createCanvas('camaro_mov', 140, 220);
        let ctx = p.context;
        ctx.fillStyle = '#6a0dad'; ctx.fillRect(15, 30, 110, 160); 
        ctx.fillStyle = '#4b0082'; ctx.fillRect(25, 40, 90, 60); 
        ctx.fillStyle = '#111'; ctx.fillRect(10, 185, 120, 12); 
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(30, 110, 80, 40); 
        ctx.fillStyle = '#ffff00'; ctx.fillRect(25, 30, 25, 12); ctx.fillRect(90, 30, 25, 12); 
        ctx.fillStyle = '#fff'; ctx.fillRect(45, 175, 50, 15);
        ctx.fillStyle = '#000'; ctx.font = 'bold 12px Arial'; ctx.fillText('B10MVT', 48, 187);
        p.refresh();

        let c = this.textures.createCanvas('item_cake', 80, 80);
        c.context.font = '60px Arial'; c.context.fillText('🍰', 5, 65); c.refresh();
        
        let tr = this.textures.createCanvas('traffic_car', 100, 180);
        tr.context.fillStyle = '#444'; tr.context.fillRect(10, 20, 80, 140);
        tr.context.fillStyle = '#f00'; tr.context.fillRect(15, 20, 20, 10); tr.context.fillRect(65, 20, 20, 10);
        tr.refresh();
    }
}