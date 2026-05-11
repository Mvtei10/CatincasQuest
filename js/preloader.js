preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // --- UI INCĂRCARE ---
    this.add.rectangle(w/2, h/2, w, h, 0xfff0f5);
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(w/2 - 160, h/2 - 25, 320, 50);

    let loadingText = this.add.text(w/2, h/2 - 50, 'Se încarcă surpriza...', { fontSize: '22px', fill: '#ff1493', fontStyle: 'bold' }).setOrigin(0.5);
    let percentText = this.add.text(w/2, h/2, '0%', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);

    this.load.on('progress', (value) => {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xff1493, 1);
        progressBar.fillRect(w/2 - 150, h/2 - 15, 300 * value, 30);
    });

    // ---------------------------------------------------------
    // LISTA COMPLETĂ DIN ASSETS (CONFORM POZELOR TALE)
    // ---------------------------------------------------------

    // --- IMAGINI MAKEUP & FATA ---
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

    // --- HAINE & COSTUME (TOATE CELE 3 VARIANTE) ---
    const styles = ['casual', 'cyber', 'funny', 'gipsy', 'pijamale', 'printesa', 'rochie', 'sport', 'streetwear'];
    styles.forEach(style => {
        for(let i=1; i<=3; i++) {
            this.load.image(`${style}${i}`, `assets/${style}${i}.png`);
        }
    });

    // --- DRESSUP UI ---
    this.load.image('dressup_costum', 'assets/dressup_costum.png');
    this.load.image('fundal_dressup', 'assets/fundal_dressup.png');
    this.load.image('matei.png', 'assets/matei.png');

    // --- SUNETE (AUDIO) ---
    this.load.audio('backround1', 'assets/backround1.mp3'); // Atenție: e scris "backround" în poze
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
    
    // Sunetele de lovitură (Hurt)
    for(let i=1; i<=3; i++) {
        this.load.audio(`hurt_${i}`, `assets/hurt_${i}.mp3`);
    }
}