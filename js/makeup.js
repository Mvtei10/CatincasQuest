class MakeupScene extends Phaser.Scene {
    constructor() { super('MakeupScene'); }

    preload() {
        this.load.image('fata_0', 'assets/fata_simpla.png');
        this.load.image('fata_1', 'assets/fata_concealer.png');
        this.load.image('fata_2', 'assets/fata_pudra.png');
        this.load.image('fata_3', 'assets/fata_blush.png');
        this.load.image('fata_4', 'assets/fata_rimel.png');
        this.load.image('fata_5', 'assets/fata_ruj.png');

        this.load.image('item_concealer', 'assets/concealer.png');
        this.load.image('item_pudra', 'assets/pudra.png');
        this.load.image('item_blush', 'assets/blush.png');
        this.load.image('item_rimel', 'assets/rimel.png');
        this.load.image('item_lipstick', 'assets/lipstick.png');

        this.load.audio('makeup_bg', 'assets/backround2.mp3');
        this.load.audio('wrong_snd', 'assets/wrong.mp3');
    }

    create() {
        this.cameras.main.resetFX();
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;

        this.timeLeft = 150;
        this.currentStep = 0;
        this.isGameOver = false;

        this.steps = [
            { id: 'item_concealer', nextFace: 'fata_1' },
            { id: 'item_pudra',     nextFace: 'fata_2' },
            { id: 'item_blush',     nextFace: 'fata_3' },
            { id: 'item_rimel',     nextFace: 'fata_4' },
            { id: 'item_lipstick',  nextFace: 'fata_5' }
        ];

        const midX = this.cameras.main.width / 2;
        const midY = this.cameras.main.height / 2;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(midX, midY, w, h, 0xffffff);
        
        // --- FAȚA MAI MICĂ (0.25) ---
        this.mainFace = this.add.image(midX, midY, 'fata_0').setScale(0.25);

        this.timerText = this.add.text(40, 40, "Timp: 02:30", { 
            fontSize: '30px', fill: '#000', fontWeight: 'bold' 
        });
        
        this.instrText = this.add.text(w -10, h - 40, "Aplică machiajul!✨", { 
            fontSize: '30px', fill: '#ff1493', fontWeight: 'bold' 
        }).setOrigin(1, 1);

        const positions = [
            { x: w * 0.15, y: h * 0.35 }, 
            { x: w * 0.15, y: h * 0.75 }, 
            { x: w * 0.85, y: h * 0.25 }, 
            { x: w * 0.85, y: h * 0.5 },  
            { x: w * 0.85, y: h * 0.75 }  
        ];
       
        Phaser.Utils.Array.Shuffle(positions);

        this.steps.forEach((step, index) => {
            this.createDraggableProduct(positions[index].x, positions[index].y, step.id);
        });

        this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });

        if (!this.sound.get('makeup_bg')) {
            this.sound.play('makeup_bg', { loop: true, volume: 0.4 });
        }
    }

    createDraggableProduct(x, y, key) {
        // --- TOATE MACHIAJELE SUNT UN PIC MAI MICI ACUM ---
        let scaleSize = (key === 'item_lipstick') ? 0.08 : 0.12;
        
        let img = this.add.image(x, y, key).setScale(scaleSize).setInteractive();
        this.input.setDraggable(img);
        img.setData('startX', x);
        img.setData('startY', y);

        img.on('drag', (pointer, dragX, dragY) => {
            img.x = dragX;
            img.y = dragY;
            img.setDepth(100);
        });

        img.on('dragend', () => {
            this.checkStep(img);
        });
    }

    checkStep(img) {
        let currentReq = this.steps[this.currentStep];
        let dist = Phaser.Math.Distance.Between(img.x, img.y, this.mainFace.x, this.mainFace.y);

        if (img.texture.key === currentReq.id && dist < 200) { // Distanță ajustată pentru față mai mică
            this.currentStep++;
            this.mainFace.setTexture(currentReq.nextFace);
            img.destroy();
            this.instrText.setText("Bravo! ✅").setFill('#2ecc71');
            
            if (this.currentStep >= this.steps.length) {
                this.finishGame();
            } else {
                this.time.delayedCall(1000, () => {
                    if(!this.isGameOver) this.instrText.setText("Continuă... ✨").setFill('#ff1493');
                });
            }
        } else {
            this.sound.play('wrong_snd');
            this.instrText.setText("Mai încearcă! ❌").setFill('#e74c3c');
            this.tweens.add({
                targets: img,
                x: img.getData('startX'),
                y: img.getData('startY'),
                duration: 300,
                ease: 'Power2'
            });
        }
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            let mins = Math.floor(this.timeLeft / 60);
            let secs = this.timeLeft % 60;
            this.timerText.setText(`Timp: ${mins}:${secs < 10 ? '0' + secs : secs}`);
            if (this.timeLeft === 0) location.reload();
        }
    }

    finishGame() {
        this.isGameOver = true;
        this.time.delayedCall(1000, () => {
            this.mainFace.setVisible(false);
            this.timerText.setVisible(false);
            this.instrText.setVisible(false);

            const midX = this.cameras.main.width / 2;
            const midY = this.cameras.main.height / 2;

            let win = this.add.container(0, 0).setDepth(1000);
            win.add(this.add.rectangle(midX, midY, this.cameras.main.width, this.cameras.main.height, 0xffffff, 1));
            
            win.add(this.add.text(midX, midY - 100, "Machiaj terminat!", { 
                fontSize: '80px', fill: '#000', fontWeight: 'bold' 
            }).setOrigin(0.5));

            let timeLeftVal = 5;
            let timerDisplay = this.add.text(midX, midY + 50, `Trecem la dress-up în: ${timeLeftVal}`, { 
                fontSize: '40px', fill: '#ff1493', fontWeight: 'bold' 
            }).setOrigin(0.5);
            win.add(timerDisplay);
           
            let btn = this.add.rectangle(midX, midY + 200, 400, 100, 0x000000).setInteractive();
            let btnText = this.add.text(midX, midY + 200, "Dress-up time!", { 
                fontSize: '35px', fill: '#fff' 
            }).setOrigin(0.5);
            win.add([btn, btnText]);

            const goToDressup = () => {
                this.sound.stopAll();
                this.scene.start('DressupScene');
            };

            this.time.addEvent({
                delay: 1000,
                repeat: 4,
                callback: () => {
                    timeLeftVal--;
                    timerDisplay.setText(`Trecem la dress-up în: ${timeLeftVal}`);
                    if (timeLeftVal <= 0) goToDressup();
                }
            });
            btn.on('pointerdown', () => goToDressup());
        });
    }
}