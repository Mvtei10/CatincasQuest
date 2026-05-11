class DebugScene extends Phaser.Scene {
    constructor() { super('DebugScene'); }

    create() {
        // Resetăm camera pentru a fi siguri că totul e centrat
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const midX = w / 2;

        // Fundal închis
        this.add.rectangle(midX, h / 2, w, h, 0x2c3e50);

        // Titlu
        this.add.text(midX, h * 0.08, "MENIU DEBUG", { 
            fontSize: '60px', fill: '#ecf0f1', fontWeight: 'bold'
        }).setOrigin(0.5);

        // Stil comun pentru butoane
        const btnStyle = { 
            fontSize: '28px', 
            fill: '#fff', 
            backgroundColor: '#34495e', 
            padding: { x: 15, y: 12 }, 
            fixedWidth: w * 0.6, 
            align: 'center'
        };

        // --- CELE 5 NIVELE ---

        // 1. Subway Surfer
        let subBtn = this.add.text(midX, h * 0.20, "1. TEST CURSĂ (Subway Surfer) 🏎️", btnStyle)
            .setInteractive().setOrigin(0.5);
        subBtn.on('pointerdown', () => this.scene.start('SubwaySurferScene'));

        // 2. Makeup
        let makeBtn = this.add.text(midX, h * 0.33, "2. TEST MACHIAJ (Makeup) 💄", btnStyle)
            .setInteractive().setOrigin(0.5);
        makeBtn.on('pointerdown', () => this.scene.start('MakeupScene'));

        // 3. Dressup
        let dressBtn = this.add.text(midX, h * 0.46, "3. TEST DRESS-UP (Haine) 👗", btnStyle)
            .setInteractive().setOrigin(0.5);
        dressBtn.on('pointerdown', () => this.scene.start('DressupScene'));

        // 4. PlayScene (Alergare veche)
        let playBtn = this.add.text(midX, h * 0.59, "4. TEST ALERGARE (PlayScene) 🏃‍♀️", btnStyle)
            .setInteractive().setOrigin(0.5);
        playBtn.on('pointerdown', () => this.scene.start('PlayScene'));

        // 5. PartyScene (Scena Nouă)
        let partyBtn = this.add.text(midX, h * 0.72, "5. TEST PARTY (Final & Ghicitoare) 🥳", btnStyle)
            .setInteractive().setOrigin(0.5);
        partyBtn.on('pointerdown', () => this.scene.start('PartyScene'));

        // Buton BACK
        let backBtn = this.add.text(midX, h * 0.90, "🏠 Înapoi la Meniu", { 
            fontSize: '25px', fill: '#bdc3c7' 
        }).setInteractive().setOrigin(0.5);
        
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));

        // Efecte hover pentru toate butoanele de test
        const allButtons = [subBtn, makeBtn, dressBtn, playBtn, partyBtn];
        
        allButtons.forEach(btn => {
            btn.on('pointerover', () => btn.setBackgroundColor('#1abc9c'));
            btn.on('pointerout', () => btn.setBackgroundColor('#34495e'));
        });
    }
}