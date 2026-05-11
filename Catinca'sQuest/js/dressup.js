class DressupScene extends Phaser.Scene {
    constructor() { super('DressupScene'); }

    init() {
        // Inițializăm salvarea globală cu costumul de bază, în caz că nu se alege nimic
        this.registry.set('selectedDress', 'dressup_costum_base');
    }

    preload() {
        this.load.image('fundal_dressup', 'assets/fundal_dressup.png');
        this.load.image('dressup_costum_base', 'assets/dressup_costum.png');
        this.load.audio('dressup_music', 'assets/dressup_song.mp3');

        this.categories = [
            { name: 'Casual', font: 'Courier New' },
            { name: 'Rochie', font: 'Georgia' },
            { name: 'Pijamale', font: 'Trebuchet MS' },
            { name: 'Sport', font: 'Impact' },
            { name: 'Funny', font: 'Comic Sans MS' },
            { name: 'Printesa', font: 'Palatino' },
            { name: 'Gipsy', font: 'Times New Roman' },
            { name: 'Streetwear', font: 'Verdana' },
            { name: 'Cyber', font: 'Lucida Console' }
        ];

        this.categories.forEach(cat => {
            for (let i = 1; i <= 3; i++) {
                let itemName = cat.name.toLowerCase() + i; 
                this.load.image(itemName, `assets/${itemName}.PNG`);
            }
        });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.image(w / 2, h / 2, 'fundal_dressup').setDisplaySize(w, h);
        
        const panelWidth = w * 0.35;
        this.add.rectangle(w - panelWidth / 2, h / 2, panelWidth, h, 0xfdf5e6, 1);
        
        this.mainCharacter = this.add.image(w - panelWidth / 2, h * 0.42, 'dressup_costum_base').setScale(0.35);

        if (!this.sound.get('dressup_music')) {
            this.music = this.sound.add('dressup_music', { loop: true, volume: 0.5 });
            this.music.play();
        }

        this.menuContainer = this.add.container(0, 0);
        this.itemsContainer = this.add.container(0, 0).setVisible(false);

        this.categoryTitle = this.add.text(w * 0.32, h * 0.1, "Alegeți tinuta ✨", { 
            fontSize: '55px', fill: '#000', fontWeight: 'bold' 
        }).setOrigin(0.5);

        this.createCategoryMenu(w, h);

        let saveX = w - panelWidth / 2;
        let saveY = h * 0.9;
        
        let saveBtnBg = this.add.graphics();
        saveBtnBg.fillStyle(0x2ecc71, 1);
        saveBtnBg.fillRoundedRect(saveX - 150, saveY - 40, 300, 80, 40);
        
        let saveBtnHit = this.add.rectangle(saveX, saveY, 300, 80, 0x000000, 0).setInteractive();
        this.add.text(saveX, saveY, "SAVE", { 
            fontSize: '35px', fill: '#fff', fontWeight: 'bold' 
        }).setOrigin(0.5);
        
        saveBtnHit.on('pointerdown', () => {
            this.sound.stopAll();
            
            let win = this.add.container(0, 0).setDepth(2000);
            win.add(this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.8));
            
            win.add(this.add.text(w / 2, h / 2 - 50, "EȘTI GATA DE PETRECERE! 🎉", {
                fontSize: '60px', fill: '#fff', fontWeight: 'bold'
            }).setOrigin(0.5));

            let timeLeftVal = 7; 
            let timerDisplay = this.add.text(w / 2, h / 2 + 50, `Matei vine spre tine cu surprizele! ⏱️🎁\n  ${timeLeftVal}`, { 
                fontSize: '30px', fill: '#b60f38', fontWeight: 'bold', align: 'center'
            }).setOrigin(0.5);
            win.add(timerDisplay);

            const startNextGame = () => {
                this.scene.start('SubwaySurferScene');
            };

            this.time.addEvent({
                delay: 1000,
                repeat: 6,
                callback: () => {
                    timeLeftVal--;
                    timerDisplay.setText(`Matei vine spre tine cu surprizele! ⏱️🎁\n  ${timeLeftVal}`);
                    if (timeLeftVal <= 0) startNextGame();
                }
            });
        });
    }

    createCategoryMenu(w, h) {
        const startX = w * 0.1;
        const startY = h * 0.25;
        const spacingX = w * 0.22;
        const spacingY = h * 0.2;

        this.categories.forEach((cat, index) => {
            let col = index % 3;
            let row = Math.floor(index / 3);
            let x = startX + col * spacingX;
            let y = startY + row * spacingY;

            let btn = this.add.rectangle(x, y, 200, 80, 0xffffff).setInteractive();
            btn.setStrokeStyle(3, 0x000000);
            
            let txt = this.add.text(x, y, cat.name, { 
                fontSize: '24px', 
                fill: '#000', 
                fontFamily: cat.font,
                fontStyle: 'italic'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => this.showCategoryItems(cat.name, w, h));
            this.menuContainer.add([btn, txt]);
        });
    }

    showCategoryItems(categoryName, w, h) {
        this.menuContainer.setVisible(false);
        this.itemsContainer.removeAll(true);
        this.itemsContainer.setVisible(true);

        this.categoryTitle.setText(categoryName).setPosition(w * 0.32, h * 0.9).setFontSize('45px');

        let backArrow = this.add.text(50, 50, "⬅ ÎNAPOI", { 
            fontSize: '25px', fill: '#000', backgroundColor: '#fff', padding: 8 
        }).setInteractive();
        
        backArrow.on('pointerdown', () => {
            this.itemsContainer.setVisible(false);
            this.menuContainer.setVisible(true);
            this.categoryTitle.setText("Alegeți tinuta ✨").setPosition(w * 0.32, h * 0.1).setFontSize('55px');
            backArrow.destroy();
        });
        this.itemsContainer.add(backArrow);

        for (let i = 1; i <= 3; i++) {
            let itemKey = categoryName.toLowerCase() + i;
            let xPos = (w * 0.1) + (i - 1) * (w * 0.22);
            
            let itemThumb = this.add.image(xPos, h * 0.52, itemKey).setScale(0.55).setInteractive();
            
            itemThumb.on('pointerdown', () => {
                this.mainCharacter.setTexture(itemKey).setScale(0.6);
                this.tweens.add({ targets: itemThumb, scale: 0.65, duration: 100, yoyo: true });
                
                // SALVARE GLOBALĂ: Salvăm numele texturii selectate în registry
                this.registry.set('selectedDress', itemKey);
            });

            this.itemsContainer.add(itemThumb);
        }
    }
}