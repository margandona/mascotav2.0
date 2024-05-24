class Player {
    constructor() {
        this.ghostPetz = [];
        this.currentPetIndex = 0;
        this.inventory = [];
        this.coins = 0;
        this.missionHistory = [];
        this.loadProgress();
    }

    addGhostPet(ghostPet) {
        if (this.ghostPetz.length < 50) {
            this.ghostPetz.push(ghostPet);
            this.updatePetButtons();
            this.showMsg(`Has añadido un nuevo ${ghostPet.type} a tu colección.`, 'info');
            this.saveProgress();
        } else {
            this.showMsg('Ya tienes el máximo de 6 GhostPetz.', 'warning');
        }
    }

    switchPet(index) {
        if (index >= 0 && index < this.ghostPetz.length) {
            this.currentPetIndex = index;
            this.ghostPetz[this.currentPetIndex].updateStats();
            $('#main-image').attr('src', this.ghostPetz[this.currentPetIndex].getImagePath());
        }
    }

    updatePetButtons() {
        $('#pet-buttons').empty();
        this.ghostPetz.forEach((pet, index) => {
            $('#pet-buttons').append(`<button class="btn btn-secondary mx-2 mb-2" onclick="player.switchPet(${index})"><i class="fas fa-paw"></i> ${pet.type} ${index + 1}</button>`);
        });
    }

    updateInventory() {
        $('#inventory-items').empty();
        this.inventory.forEach((item, index) => {
            $('#inventory-items').append(
                `<div class="inventory-item">
                    ${item.name} - ${item.type} 
                    <button class="btn btn-success btn-sm" onclick="player.useItem(${index})"><i class="fas fa-check"></i> Usar</button>
                    <button class="btn btn-danger btn-sm" onclick="player.sellItem(${index})"><i class="fas fa-trash-alt"></i> Vender</button>
                </div>`
            );
        });
    }

    addItemToInventory(item) {
        this.inventory.push(item);
        this.updateInventory();
        this.showMsg(`¡Has encontrado un objeto: ${item.name}!`, 'success');
        this.saveProgress();
    }

    useItem(index) {
        const item = this.inventory[index];
        this.ghostPetz[this.currentPetIndex].applyItem(item);
        this.inventory.splice(index, 1);
        this.updateInventory();
        this.showMsg(`Has usado ${item.name} en tu GhostPet.`, 'info');
        this.saveProgress();
    }

    sellItem(index) {
        const item = this.inventory[index];
        this.coins += item.value;
        this.inventory.splice(index, 1);
        this.updateInventory();
        this.updateCoins();
        this.showMsg(`Has vendido ${item.name} por ${item.value} monedas.`, 'info');
        this.saveProgress();
    }

    updateCoins() {
        $('#coins').text('Monedas: ' + this.coins);
    }

    showMsg(message, type) {
        $('#messages').append(`<p>${type.toUpperCase()}: ${message}</p>`).hide().fadeIn(1000);
    }

    buyPet(type) {
        const costs = { fantasma: 100, espectro: 200, wraith: 300, poltergeist: 400, banshee: 500 };
        const cost = costs[type] || 100;
        if (this.coins >= cost) {
            this.coins -= cost;
            const ghostPet = new GhostPet(type);
            this.addGhostPet(ghostPet);
            this.updateCoins();
            this.showMsg(`Has comprado un ${type} por ${cost} monedas.`, 'success');
            this.saveProgress();
        } else {
            this.showMsg('No tienes suficientes monedas para comprar este GhostPet.', 'danger');
        }
    }

    addMissionToHistory(mission) {
        this.missionHistory.push(mission);
        this.updateMissionHistory();
        this.saveProgress();
    }

    updateMissionHistory() {
        $('#mission-history-items').empty();
        this.missionHistory.forEach((mission) => {
            $('#mission-history-items').append(`<div class="mission-history-item">${mission.description} - Recompensas: ${mission.rewards.join(', ')}</div>`);
        });
    }

    saveProgress(slot = 1) {
        const progress = {
            ghostPetz: this.ghostPetz.map(pet => pet.serialize()),
            currentPetIndex: this.currentPetIndex,
            inventory: this.inventory,
            coins: this.coins,
            missionHistory: this.missionHistory
        };
        localStorage.setItem(`ghostPetzProgress_${slot}`, JSON.stringify(progress));
    }

    loadProgress(slot = 1) {
        const progress = JSON.parse(localStorage.getItem(`ghostPetzProgress_${slot}`));
        if (progress) {
            this.coins = progress.coins;
            this.inventory = progress.inventory;
            this.missionHistory = progress.missionHistory;
            this.currentPetIndex = progress.currentPetIndex;
            progress.ghostPetz.forEach(petData => {
                const pet = new GhostPet(petData.type);
                pet.deserialize(petData);
                this.ghostPetz.push(pet);
            });
            this.updateCoins();
            this.updateInventory();
            this.updateMissionHistory();
            this.updatePetButtons();
            if (this.ghostPetz.length > 0) {
                this.ghostPetz[this.currentPetIndex].updateStats();
                $('#main-image').attr('src', this.ghostPetz[this.currentPetIndex].getImagePath());
            }
        }
    }
}

class GhostPet {
    constructor(type) {
        this.type = type;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.health = 100;class Player {
            constructor() {
                this.ghostPetz = [];
                this.currentPetIndex = 0;
                this.inventory = [];
                this.coins = 0;
                this.missionHistory = [];
                this.loadProgress();
            }
        
            addGhostPet(ghostPet) {
                if (this.ghostPetz.length < 6) {
                    this.ghostPetz.push(ghostPet);
                    this.updatePetButtons();
                    this.showMsg(`Has añadido un nuevo ${ghostPet.type} a tu colección.`, 'info');
                    this.saveProgress();
                } else {
                    this.showMsg('Ya tienes el máximo de 6 GhostPetz.', 'warning');
                }
            }
        
            switchPet(index) {
                if (index >= 0 && index < this.ghostPetz.length) {
                    this.currentPetIndex = index;
                    this.ghostPetz[this.currentPetIndex].updateStats();
                    $('#main-image').attr('src', this.ghostPetz[this.currentPetIndex].getImagePath());
                }
            }
        
            updatePetButtons() {
                $('#pet-buttons').empty();
                this.ghostPetz.forEach((pet, index) => {
                    $('#pet-buttons').append(`<button class="btn btn-secondary mx-2 mb-2" onclick="player.switchPet(${index})"><i class="fas fa-paw"></i> ${pet.type} ${index + 1}</button>`);
                });
            }
        
            updateInventory() {
                $('#inventory-items').empty();
                this.inventory.forEach((item, index) => {
                    $('#inventory-items').append(
                        `<div class="inventory-item">
                            ${item.name} - ${item.type} 
                            <button class="btn btn-success btn-sm" onclick="player.useItem(${index})"><i class="fas fa-check"></i> Usar</button>
                            <button class="btn btn-danger btn-sm" onclick="player.sellItem(${index})"><i class="fas fa-trash-alt"></i> Vender</button>
                        </div>`
                    );
                });
            }
        
            addItemToInventory(item) {
                this.inventory.push(item);
                this.updateInventory();
                this.showMsg(`¡Has encontrado un objeto: ${item.name}!`, 'success');
                this.saveProgress();
            }
        
            useItem(index) {
                const item = this.inventory[index];
                this.ghostPetz[this.currentPetIndex].applyItem(item);
                this.inventory.splice(index, 1);
                this.updateInventory();
                this.showMsg(`Has usado ${item.name} en tu GhostPet.`, 'info');
                this.saveProgress();
            }
        
            sellItem(index) {
                const item = this.inventory[index];
                this.coins += item.value;
                this.inventory.splice(index, 1);
                this.updateInventory();
                this.updateCoins();
                this.showMsg(`Has vendido ${item.name} por ${item.value} monedas.`, 'info');
                this.saveProgress();
            }
        
            updateCoins() {
                $('#coins').text('Monedas: ' + this.coins);
            }
        
            showMsg(message, type) {
                $('#messages').append(`<p>${type.toUpperCase()}: ${message}</p>`).hide().fadeIn(1000);
            }
        
            buyPet(type) {
                const costs = { fantasma: 100, espectro: 200, wraith: 300, poltergeist: 400, banshee: 500 };
                const cost = costs[type] || 100;
                if (this.coins >= cost) {
                    this.coins -= cost;
                    const ghostPet = new GhostPet(type);
                    this.addGhostPet(ghostPet);
                    this.updateCoins();
                    this.showMsg(`Has comprado un ${type} por ${cost} monedas.`, 'success');
                    this.saveProgress();
                } else {
                    this.showMsg('No tienes suficientes monedas para comprar este GhostPet.', 'danger');
                }
            }
        
            addMissionToHistory(mission) {
                this.missionHistory.push(mission);
                this.updateMissionHistory();
                this.saveProgress();
            }
        
            updateMissionHistory() {
                $('#mission-history-items').empty();
                this.missionHistory.forEach((mission) => {
                    $('#mission-history-items').append(`<div class="mission-history-item">${mission.description} - Recompensas: ${mission.rewards.join(', ')}</div>`);
                });
            }
        
            saveProgress(slot = 1) {
                const progress = {
                    ghostPetz: this.ghostPetz.map(pet => pet.serialize()),
                    currentPetIndex: this.currentPetIndex,
                    inventory: this.inventory,
                    coins: this.coins,
                    missionHistory: this.missionHistory
                };
                localStorage.setItem(`ghostPetzProgress_${slot}`, JSON.stringify(progress));
            }
        
            loadProgress(slot = 1) {
                const progress = JSON.parse(localStorage.getItem(`ghostPetzProgress_${slot}`));
                if (progress) {
                    this.coins = progress.coins;
                    this.inventory = progress.inventory;
                    this.missionHistory = progress.missionHistory;
                    this.currentPetIndex = progress.currentPetIndex;
                    progress.ghostPetz.forEach(petData => {
                        const pet = new GhostPet(petData.type);
                        pet.deserialize(petData);
                        this.ghostPetz.push(pet);
                    });
                    this.updateCoins();
                    this.updateInventory();
                    this.updateMissionHistory();
                    this.updatePetButtons();
                    if (this.ghostPetz.length > 0) {
                        this.ghostPetz[this.currentPetIndex].updateStats();
                        $('#main-image').attr('src', this.ghostPetz[this.currentPetIndex].getImagePath());
                    }
                }
            }
        }
        
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
                let imagePath = `img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.png`;
                $('#pet-image').attr('src', imagePath).hide().fadeIn(1000);
            }
        
            getImagePath() {
                const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
                return `img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.png`;
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
        
        document.addEventListener("DOMContentLoaded", function() {
            window.player = new Player(); // Esto automáticamente carga el progreso.
        });
        
        function selectPet(type) {
            const ghostPet = new GhostPet(type);
            player.addGhostPet(ghostPet);
            player.switchPet(player.ghostPetz.length - 1);
            $('#main-image').attr('src', ghostPet.getImagePath());
            $('#pet-selection').hide();
            $('#pet-status-card').show();
            $('#activities-card').show();
            $('#missions-card').show();
            $('#inventory-card').show();
            $('#coins-card').show();
            $('#explore-card').show();
            $('#switch-pet-card').show();
            $('#buy-pet-card').show();
            $('#missions-history-card').show();
            $('#messages-container-card').show();
        }
        
        function performActivity(activity) {
            player.ghostPetz[player.currentPetIndex].performActivity(activity);
        }
        
        function startMission(mission) {
            player.ghostPetz[player.currentPetIndex].startMission(mission);
        }
        
        function exploreArea(area) {
            player.showMsg(`Explorando ${area}`, 'info');
            player.ghostPetz[player.currentPetIndex].gainXP(15);
        }
        
        function buyPet(type) {
            player.buyPet(type);
        }
        
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
        let imagePath = `img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.png`;
        $('#pet-image').attr('src', imagePath).hide().fadeIn(1000);
    }

    getImagePath() {
        const levels = { fantasma: 3, espectro: 3, wraith: 3, poltergeist: 3, banshee: 3 };
        return `img/${this.type}${Math.min(this.level, levels[this.type] || 1)}.png`;
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

document.addEventListener("DOMContentLoaded", function() {
    window.player = new Player(); // Esto automáticamente carga el progreso.
});

function selectPet(type) {
    const ghostPet = new GhostPet(type);
    player.addGhostPet(ghostPet);
    player.switchPet(player.ghostPetz.length - 1);
    $('#main-image').attr('src', ghostPet.getImagePath());
    $('#pet-selection').hide();
    $('#pet-status-card').show();
    $('#activities-card').show();
    $('#missions-card').show();
    $('#inventory-card').show();
    $('#coins-card').show();
    $('#explore-card').show();
    $('#switch-pet-card').show();
    $('#buy-pet-card').show();
    $('#missions-history-card').show();
    $('#messages-container-card').show();
}

function performActivity(activity) {
    player.ghostPetz[player.currentPetIndex].performActivity(activity);
}

function startMission(mission) {
    player.ghostPetz[player.currentPetIndex].startMission(mission);
}

function exploreArea(area) {
    player.showMsg(`Explorando ${area}`, 'info');
    player.ghostPetz[player.currentPetIndex].gainXP(15);
}

function buyPet(type) {
    player.buyPet(type);
}
