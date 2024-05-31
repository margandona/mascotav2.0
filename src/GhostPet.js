class GhostPet {
    constructor(type) {
        this.type = type; // Tipo de la mascota
        this.level = 1; // Nivel inicial de la mascota
        this.xp = 0; // Experiencia inicial de la mascota
        this.xpToNextLevel = 100; // Experiencia necesaria para el siguiente nivel
        this.health = 100; // Salud inicial de la mascota
        this.energy = 100; // Energía inicial de la mascota
        this.happiness = 100; // Felicidad inicial de la mascota
        this.age = 0; // Edad inicial de la mascota
        this.illness = false; // Estado de enfermedad inicial de la mascota
        this.emotions = 'neutral'; // Estado emocional inicial de la mascota
        this.knowledge = 0; // Conocimiento inicial de la mascota
        this.skills = 0; // Habilidades iniciales de la mascota
        this.bathing = false; // Estado de baño inicial de la mascota

        this.increaseAge(); // Configurar el aumento de edad
        this.updateImage(); // Actualizar la imagen de la mascota según el tipo y nivel
    }

    // Actualiza las estadísticas mostradas de la mascota
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

        $('#progress-health').css('width', this.health + '%').text('Salud ' + this.health + '%').hide().fadeIn(1000);
        $('#progress-energy').css('width', this.energy + '%').text('Energía ' + this.energy + '%').hide().fadeIn(1000);
        $('#progress-happiness').css('width', this.happiness + '%').text('Felicidad ' + this.happiness + '%').hide().fadeIn(1000);

        this.updateImage();
    }

    // Incrementa la experiencia de la mascota y maneja el nivel
    gainXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
        this.updateStats();
    }

    // Sube el nivel de la mascota
    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.25); // Incremento de 25% en la experiencia necesaria para el siguiente nivel
        this.health = Math.min(this.health + 20, 100);
        this.energy = Math.min(this.energy + 20, 100);
        this.happiness = Math.min(this.happiness + 10, 100);
        player.showMsg(`¡Tu GhostPet ha subido al nivel ${this.level}!`, 'success');
        this.updateStats();
        player.saveProgress();
    }

    // Actualiza la imagen de la mascota según el tipo y nivel
    updateImage() {
        const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
        let imagePath = `assets/img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.webp`;
        $('#pet-image').attr('src', imagePath).hide().fadeIn(1000);
    }

    // Devuelve la ruta de la imagen de la mascota según el tipo y nivel
    getImagePath() {
        const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
        return `assets/img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.webp`;
    }

    // Realiza una actividad con la mascota
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
            player.showMsg(`Tu GhostPet ha realizado la actividad: ${activity}`, 'info');
        }
        this.updateStats();
        this.checkRandomEvent();
        player.saveProgress();
    }

    // Aplica los efectos de una actividad o un objeto a la mascota
    applyEffects(effects) {
        Object.keys(effects).forEach(key => {
            this[key] = Math.min(this[key] + effects[key], 100);
        });
        if (effects.xp) {
            this.gainXP(effects.xp);
        }
    }

    // Inicia una misión con la mascota
    startMission(mission) {
        $('#minigameModal').modal('show'); // Abre el modal de minijuego

        // Guardar la misión para otorgar premios al cerrar el modal
        this.currentMission = mission;
    }

    // Completa la misión y otorga las recompensas
    completeMission() {
        const missionEffects = {
            vencerCriaturas: { health: -10, skills: 15, happiness: 10, xp: 30, coins: 50, rewards: ['50 monedas'] },
            resolverPuzles: { knowledge: 20, energy: -10, happiness: 5, xp: 25, coins: 30, rewards: ['30 monedas'] },
            desafiosConocimiento: { knowledge: 25, energy: -15, xp: 35, coins: 40, rewards: ['40 monedas'] },
            busquedaTesoros: { happiness: 20, energy: -10, skills: 10, xp: 20, coins: 20, rewards: ['20 monedas'] }
        };

        const effects = missionEffects[this.currentMission];
        if (effects) {
            this.applyEffects(effects);
            player.coins += effects.coins || 0;
            player.updateCoins();
            player.addMissionToHistory({ description: `Misión: ${this.currentMission}`, rewards: effects.rewards });
            player.showMsg(`Tu GhostPet ha completado la misión: ${this.currentMission}`, 'info');
        } else {
            player.showMsg('Tu GhostPet no tiene suficiente energía para realizar esta misión.', 'warning');
        }
        this.updateStats();
        this.checkRandomEvent();
        player.saveProgress();
    }

    // Verifica si ocurre un evento aleatorio
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

    // Encuentra un objeto aleatorio
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

    // Aplica un objeto a la mascota
    applyItem(item) {
        this.applyEffects(item.effect);
        player.showMsg(`Has usado ${item.name} en tu GhostPet.`, 'info');
        player.saveProgress();
    }

    // Aumenta la edad de la mascota a intervalos regulares
    increaseAge() {
        setInterval(() => {
            if (this.level % 5 === 0 && this.level <= 20) {
                this.age++;
            } else if (this.level > 20 && this.level % 3 === 0) {
                this.age++;
            }
            player.showMsg(`¡Tu GhostPet ha cumplido ${this.age} años!`, 'info');
            this.updateStats();
            player.saveProgress();
        }, 300000); // Cada 5 minutos
    }

    // Serializa los datos de la mascota
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

    // Deserializa los datos de la mascota
    deserialize(data) {
        Object.assign(this, data);
        this.updateImage();
        this.updateStats();
    }
}
