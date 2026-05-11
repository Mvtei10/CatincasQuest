class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    init() {
        // Variabile pentru controlul animației de încărcare
        this.visualProgress = 0;
        this.realProgress = 0;
        this.isReady = false;
    }

    preload() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // --- FUNDAL ȘI UI ---
        this.add.rectangle(w / 2, h / 2, w, h, 0xfff0f5);
        
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();
        
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRoundedRect(w / 2 - 160, h / 2 - 25, 320, 50, 10);

        this.loadingText = this.add.text(w / 2, h / 2 - 60, 'Se pregătește surpriza...', { 
            fontSize: '24px', 
            fill: '#ff1493', 
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.percentText = this.add.text(w / 2, h / 2, '0%', { 
            fontSize: '20px', 
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // --- LOGICA DE ÎNCĂRCARE REALĂ ---
        this.load.on('progress', (value) => {
            this.realProgress = value;
        });

        this.load.on('complete', () => {
            this.isReady = true;
        });

        // ---------------------------------------------------------
        // ASSETS - IMAGINI
        // ---------------------------------------------------------
        this.load.image('blush', 'assets/blush.png');
        this.load.image('concealer', 'assets/concealer.png');
        this.load.image('lipstick', 'assets/lipstick.png');
        this.load.image('pudra', 'assets/pudra.png');
        this.load.image('rimel', 'assets/rimel.png');
        this.load.image('fata', 'assets/fata.png');
        this.load.image('fata_simpla', 'assets/fata_simpla.png');
        this.load.image('fata_blush', 'assets/fata_blush.png');
        this.load.image('fata_concealer', 'assets/fata_concealer.png');
        this.load.image('fata_pudra', 'assets/fata_pudra.png');
        this.load.image('fata_rimel', 'assets/fata_rimel.png');
        this.load.image('fata_ruj', 'assets/fata_ruj.png');
        this.load.image('dressup_costum', 'assets/dressup_costum.png');
        this.load.image('fundal_dressup', 'assets/fundal_dressup.png');
        this.load.image('matei.png', 'assets/matei.png');

        const styles = ['casual', 'cyber', 'funny', 'gipsy', 'pijamale', 'printesa', 'rochie', 'sport', 'streetwear'];
        styles.forEach(style => {
            for (let i = 1; i <= 3; i++) {
                this.load.image(`${style}${i}`, `assets/${style}${i}.png`);
            }
        });

        // ---------------------------------------------------------
        // ASSETS - AUDIO
        // ---------------------------------------------------------
        this.load.audio('backround1', 'assets/backround1.mp3');
        this.load.audio('backround2', 'assets/backround2.mp3');
        this.load.audio('coins', 'assets/coins.mp3');
        this.load.audio('condu', 'assets/condu.mp3');
        this.load.audio('dressup_song', 'assets/dressup_song.mp3');
        this.load.audio('fail', 'assets/fail.mp3');
        this.load.audio('fart', 'assets/fart.mp3');
        this.load.audio('hbd', 'assets/hbd.mp3');
        this.load.audio('hooray', 'assets/hooray.mp3');
        this.load.audio('music', 'assets/music.mp3');
        this.load.audio('type', 'assets/type.mp3');
        this.load.audio('wrong', 'assets/wrong.mp3');
        
        for (let i = 1; i <= 3; i++) {
            this.load.audio(`hurt_${i}`, `assets/hurt_${i}.mp3`);
        }
    }

    update() {
        // --- EFECTUL DE LOADING PROGRESIV ---
        // Chiar dacă se încarcă instant, visualProgress va crește lin
        if (this.visualProgress < this.realProgress) {
            this.visualProgress += 0.005; // Viteza de creștere (micșorează pentru mai lent)
        }

        // Limităm să nu depășească progresul real
        if (this.visualProgress > this.realProgress) {
            this.visualProgress = this.realProgress;
        }

        // Update bară și text
        this.percentText.setText(Math.floor(this.visualProgress * 100) + '%');
        this.progressBar.clear();
        this.progressBar.fillStyle(0xff1493, 1);
        this.progressBar.fillRoundedRect(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2 - 15, 300 * this.visualProgress, 30, 5);

        // Trecem la scena următoare doar când încărcarea e gata ȘI bara vizuală a ajuns la 100%
        if (this.isReady && this.visualProgress >= 1) {
            this.isReady = false; // Prevenim dubla execuție
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene'); 
            });
        }
    }
}