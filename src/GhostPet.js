// GhostPet.js

class GhostPet {
    constructor(type) {
        this.type = type;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.health = 100;
        this.energy = 100;
        this.happiness = 100;
        this.age = 0;
        this.illness = false;
        this.emotions = 'neutral';
        this.knowledge = 0;
        this.skills = 0;
        this.bathing = false;

        this.increaseAge();
        this.updateImage();
    }

    updateStats() {
        $('#pet-type').text('Tipo: ' + this.type);
        $('#pet-level').text('Nivel: ' + this.level);
        $('#pet-xp').text('XP: ' + this.xp + '/' + this.xpToNextLevel);
        $('#pet-health').text('Salud: ' + this.health);
        $('#pet-energy').text('Energía: ' + this.energy);
        $('#pet-happiness').text('Felicidad: ' + this.happiness);
        $('#pet-age').text('Edad: ' + this.age);
        $('#pet-illness').text('Enfermedad: ' + (this.illness ? 'Sí' : 'No'));
        $('#pet-emotions').text('Emociones: ' + this.emotions);

        $('#progress-health').css('width', this.health + '%').hide().fadeIn(1000);
        $('#progress-energy').css('width', this.energy + '%').hide().fadeIn(1000);
        $('#progress-happiness').css('width', this.happiness + '%').hide().fadeIn(1000);

        this.updateImage();
    }

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
        this.updateStats();
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.5);
        this.health += 20;
        this.energy += 20;
        this.happiness += 10;
        player.showMsg(`¡Tu GhostPet ha subido al nivel ${this.level}!`, 'success');
        this.updateStats();
        player.saveProgress();
    }

    updateImage() {
        const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
        let imagePath = `assets/img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.webp`;
        $('#pet-image').attr('src', imagePath).hide().fadeIn(1000);
    }

    getImagePath() {
        const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
        return `assets/img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.webp`;
    }

    performActivity(activity) {
        if (this.illness && (activity === 'jugar' || activity === 'estudiar')) {
            player.showMsg('Tu GhostPet está enfermo y no puede realizar esta actividad.', 'warning');
            return;
        }

        if (this.energy <= 0 && activity !== 'descansar') {
            player.showMsg('Tu GhostPet está cansado y necesita descansar.', 'warning');
            return;
        }

        const activityEffects = {
            alimentar: { energy: 10, happiness: 5, xp: 10 },
            estudiar: { energy: -10, happiness: 10, knowledge: 5, xp: 15 },
            trabajar: { energy: -20, happiness: -5, health: 10, xp: 20 },
            ejercicio: { health: 15, energy: -10, happiness: 5, xp: 10 },
            meditar: { energy: 10, happiness: 10, xp: 5 },
            socializar: { happiness: 15, energy: -5, xp: 10 },
            entrenamiento: { skills: 10, energy: -15, happiness: -5, xp: 20 },
            baño: { health: 10, happiness: 10, xp: 5 },
            descansar: { energy: 20, happiness: 5 }
        };

        const effects = activityEffects[activity];
        if (effects) {
            this.applyEffects(effects);
            if (activity === 'baño') {
                this.bathing = true;
                setTimeout(() => { this.bathing = false; }, 5000); // 5 seconds bath time
            }
        }
        this.updateStats();
        this.checkRandomEvent();
        player.saveProgress();
    }

    applyEffects(effects) {
        Object.keys(effects).forEach(key => {
            this[key] = Math.min(this[key] + effects[key], 100);
        });
        if (effects.xp) {
            this.gainXP(effects.xp);
        }
    }

    startMission(mission) {
        const missionEffects = {
            vencerCriaturas: { health: -10, skills: 15, happiness: 10, xp: 30, coins: 50, rewards: ['50 monedas'] },
            resolverPuzles: { knowledge: 20, energy: -10, happiness: 5, xp: 25, coins: 30, rewards: ['30 monedas'] },
            desafiosConocimiento: { knowledge: 25, energy: -15, xp: 35, coins: 40, rewards: ['40 monedas'] },
            busquedaTesoros: { happiness: 20, energy: -10, skills: 10, xp: 20, coins: 20, rewards: ['20 monedas'] }
        };

        const effects = missionEffects[mission];
        if (effects) {
            this.applyEffects(effects);
            player.coins += effects.coins || 0;
            player.updateCoins();
            player.addMissionToHistory({ description: `Misión: ${mission}`, rewards: effects.rewards });
            player.showMsg(`Tu GhostPet ha completado la misión: ${mission}`, 'info');
        } else {
            player.showMsg('Tu GhostPet no tiene suficiente energía para realizar esta misión.', 'warning');
        }
        this.updateStats();
        this.checkRandomEvent();
        player.saveProgress();
    }

    checkRandomEvent() {
        const randomEvent = Math.random();
        if (randomEvent < 0.1) {
            this.illness = true;
            this.health -= 20;
            player.showMsg('Tu GhostPet se ha enfermado.', 'warning');
        } else if (randomEvent < 0.2) {
            const item = this.findRandomItem();
            player.addItemToInventory(item);
        }
    }

    findRandomItem() {
        const items = [
            { name: 'Comida', type: 'comida', value: 10, effect: { health: 10, energy: 10, happiness: 10 } },
            { name: 'Medicina', type: 'medicina', value: 20, effect: { health: 20 } },
            { name: 'Juguete', type: 'juguete', value: 15, effect: { happiness: 20 } },
            { name: 'Arma', type: 'arma', value: 30, effect: { skills: 10 } },
            { name: 'Herramienta', type: 'herramienta', value: 25, effect: { knowledge: 10 } }
        ];
        return items[Math.floor(Math.random() * items.length)];
    }

    applyItem(item) {
        this.applyEffects(item.effect);
        player.showMsg(`Has usado ${item.name} en tu GhostPet.`, 'info');
        player.saveProgress();
    }

    increaseAge() {
        setInterval(() => {
            this.age++;
            player.showMsg(`¡Tu GhostPet ha cumplido ${this.age} años!`, 'info');
            this.updateStats();
            player.saveProgress();
        }, 60000); // Cada 60 segundos
    }

    serialize() {
        return {
            type: this.type,
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            health: this.health,
            energy: this.energy,
            happiness: this.happiness,
            age: this.age,
            illness: this.illness,
            emotions: this.emotions,
            knowledge: this.knowledge,
            skills: this.skills,
            bathing: this.bathing
        };
    }

    deserialize(data) {
        Object.assign(this, data);
        this.updateImage();
        this.updateStats();
    }
}
