class PartyScene extends Phaser.Scene {
    constructor() {
        super('PartyScene');
    }

    init() {
        this.dialogIndex = 0;
        this.isTyping = false;
        this.attempts = 0;
        this.pinCode = "";
        this.isGameOver = false;
        this.pinScreenActive = false;
        this.currentTargetText = "";

        this.catincaTexture = this.registry.get('selectedDress') || 'dressup_costum_base';

        this.dialogs = [
            { name: "Matei", color: "#3498db", text: "La mulți ani iubita mea frumoasă! Arăți senzațional, ești cea mai frumoasă femeie din lume!" },
            { name: "Catinca", color: "#ff1493", text: "Mulțumesc iubitule, și tu arăți foarte bine!" },
            { name: "Matei", color: "#3498db", text: "Mulțumesc, Catincutz! Vreau să știi că te iubesc cel mai cel mai mult, mai mult decât de 5 ori până la Lună și de 10 ori până la Pluto! Mă bucur că sărbătorim această zi specială împreună" },
            { name: "Catinca", color: "#ff1493", text: "Eu te iubesc mai mult decât mă iubești tu pe mine.." },
            { name: "Matei", color: "#3498db", text: "Am un cadou special pentru tine, dar e blocat de un cod PIN din 6 cifre, iar tu trebuie să-l deschizi." },
            { name: "Catinca", color: "#ff1493", text: "Dă-l încoace, îl voi deschide din prima" }
        ];
    }

    preload() {
        this.load.image('matei_img', 'assets/matei.png');
        this.load.audio('type_sound', 'assets/type.mp3');
        this.load.audio('hooray_sound', 'assets/hooray.mp3');
        this.load.audio('wrong_sound', 'assets/wrong.mp3');
        this.load.audio('hbd_sound', 'assets/hbd.mp3');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w / 2, h / 2, w, h, 0xfff0f5).setDepth(0);

        this.mateiPortrait = this.add.image(w * 0.22, h, 'matei_img').setScale(0.35).setOrigin(0.5, 1).setDepth(1).setAlpha(0.6);
        this.catincaPortrait = this.add.image(w * 0.78, h, this.catincaTexture).setScale(0.35).setOrigin(0.5, 1).setDepth(1).setAlpha(0.6);

        this.chatUI = this.add.container(0, h - 220).setDepth(10);
        let box = this.add.rectangle(w / 2, 110, w - 40, 200, 0xffffff, 0.95).setStrokeStyle(5, 0xff1493);
        this.messageText = this.add.text(60, 45, "", { fontSize: '24px', fill: '#222', wordWrap: { width: w - 240 }, lineSpacing: 10 });

        this.nextBtn = this.add.container(w - 110, 160).setDepth(20);
        let btnBg = this.add.rectangle(0, 0, 130, 60, 0xff1493, 1).setInteractive({ useHandCursor: true });
        let btnTxt = this.add.text(0, 0, "NEXT ➜", { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.nextBtn.add([btnBg, btnTxt]);
        this.chatUI.add([box, this.messageText, this.nextBtn]);

        btnBg.on('pointerdown', () => this.handleAdvance());
        this.input.keyboard.on('keydown-ENTER', () => this.handleAdvance());

        this.showNextDialog();
    }

    handleAdvance() {
        if (this.isTyping) this.completeMessageInstantly();
        else { this.dialogIndex++; this.showNextDialog(); }
    }

    showNextDialog() {
        if (this.dialogIndex < this.dialogs.length) {
            let d = this.dialogs[this.dialogIndex];
            if (d.name === "Matei") this.highlightCharacter(this.mateiPortrait, this.catincaPortrait);
            else this.highlightCharacter(this.catincaPortrait, this.mateiPortrait);
            this.typeWrite(d.text);
        } else {
            this.showPinScreen();
        }
    }

    highlightCharacter(active, inactive) {
        this.tweens.add({ targets: active, scale: 0.4, alpha: 1, duration: 300 });
        this.tweens.add({ targets: inactive, scale: 0.35, alpha: 0.5, duration: 300 });
    }

    typeWrite(text) {
        this.isTyping = true;
        this.currentTargetText = text;
        this.messageText.setText("");
        let charIndex = 0;
        if (this.cache.audio.exists('type_sound')) this.sound.play('type_sound', { volume: 0.6 });
        
        if (this.typeEvent) this.typeEvent.remove();
        this.typeEvent = this.time.addEvent({
            delay: 40, repeat: text.length - 1,
            callback: () => {
                charIndex++;
                this.messageText.setText(text.substr(0, charIndex));
                if (charIndex === text.length) this.isTyping = false;
            }
        });
    }

    completeMessageInstantly() {
        if (this.typeEvent) this.typeEvent.remove();
        this.messageText.setText(this.currentTargetText);
        this.isTyping = false;
    }

    showPinScreen() {
        if (this.pinScreenActive) return;
        this.pinScreenActive = true;

        this.chatUI.setVisible(false);
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.pinContainer = this.add.container(0, 0).setDepth(100);
        let overlay = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.95).setInteractive();
        this.pinContainer.add(overlay);
        
        this.pinContainer.add(this.add.text(w/2, h/2 - 150, "INTRODU CODUL PIN", { 
            fontSize: '38px', fill: '#fff', fontStyle: 'bold' 
        }).setOrigin(0.5));

        // Textul care afișează PIN-ul (fără bare jos)
        this.pinDisplay = this.add.text(w/2, h/2, "", { 
            fontSize: '100px', fill: '#2ecc71', fontStyle: 'bold', letterSpacing: 20
        }).setOrigin(0.5);

        this.hintText = this.add.text(w/2, h/2 + 130, "Atinge ecranul pentru a tasta", { 
            fontSize: '24px', fill: '#bdc3c7' 
        }).setOrigin(0.5);

        this.pinContainer.add([this.pinDisplay, this.hintText]);

        // --- LOGICA PENTRU TASTATURĂ TABLETĂ/MOBIL ---
        // Creăm un element HTML invizibil
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'number'; // Deschide tastatura numerică
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.top = '0px';
        this.hiddenInput.style.left = '0px';
        this.hiddenInput.style.width = '100%';
        this.hiddenInput.style.height = '100%';
        this.hiddenInput.style.opacity = '0'; // Invizibil dar funcțional
        this.hiddenInput.style.zIndex = '-1';
        document.body.appendChild(this.hiddenInput);

        // Focus automat pentru a deschide tastatura
        this.hiddenInput.focus();

        // Dacă utilizatorul închide tastatura, o poate deschide atingând ecranul
        overlay.on('pointerdown', () => {
            this.hiddenInput.focus();
        });

        // Ascultăm ce se scrie în input-ul ascuns
        this.hiddenInput.addEventListener('input', (e) => {
            let val = e.target.value;
            if (val.length > 6) val = val.slice(0, 6);
            this.pinCode = val;
            this.hiddenInput.value = this.pinCode; // Menținem sincronizarea
            
            this.pinDisplay.setText(this.pinCode);

            if (this.pinCode.length === 6) {
                this.checkPin();
            }
        });
    }

    checkPin() {
        if (this.pinCode === "160225") {
            this.cleanupInput();
            this.pinContainer.destroy();
            let hooray = this.sound.add('hooray_sound');
            hooray.play();
            
            const w = this.cameras.main.width;
            const h = this.cameras.main.height;
            this.add.rectangle(w/2, h/2, w, h, 0xff1493).setDepth(200);
            this.add.text(w/2, h/2 - 230, "Cadoul tău se ascunde în spatele acestei ghicitori", {
                fontSize: '28px', fill: '#ffff00', fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(201);

            hooray.on('complete', () => {
                this.showFinalRiddle();
                if (this.cache.audio.exists('hbd_sound')) {
                    this.sound.play('hbd_sound', { loop: true, volume: 0.5 });
                }
            });
        } else {
            this.attempts++;
            this.pinCode = "";
            this.hiddenInput.value = "";
            this.pinDisplay.setText("");
            if (this.cache.audio.exists('wrong_sound')) this.sound.play('wrong_sound');
            this.cameras.main.shake(200, 0.01);
            if (this.attempts >= 2) {
                this.hintText.setText("HINT: DATA CÂND NE-AM ÎNTÂLNIT").setFill('#f1c40f').setFontStyle('bold');
            }
        }
    }

    cleanupInput() {
        if (this.hiddenInput) {
            this.hiddenInput.blur(); // Închide tastatura
            document.body.removeChild(this.hiddenInput);
            this.hiddenInput = null;
        }
    }

    showFinalRiddle() {
        this.isGameOver = true;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        let riddle = "Nu sunt pernă, dar o țin.\nNu sunt pătură, dar dormim împreună.\nStau ascuns în pat mereu,\nȘi fără mine ar fi greu.\n\nCe sunt?";
        this.add.text(w/2, h/2, riddle, { fontSize: '36px', fill: '#fff', align: 'center', fontStyle: 'bold', lineSpacing: 20 }).setOrigin(0.5).setDepth(201);

        this.time.addEvent({
            delay: 200, loop: true,
            callback: () => {
                let x = Phaser.Math.Between(0, w);
                let emoji = Phaser.Math.RND.pick(["🎉", "🎂", "❤️", "🍰", "✨"]);
                let c = this.add.text(x, -50, emoji, { fontSize: '32px' }).setDepth(202);
                this.tweens.add({ targets: c, y: h + 100, x: x + Phaser.Math.Between(-100, 100), angle: 360, duration: 4000 });
            }
        });
    }
}