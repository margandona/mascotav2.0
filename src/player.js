// Player.js

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
        if (this.ghostPetz.length < 100) {
            this.ghostPetz.push(ghostPet);
            this.updatePetButtons();
            this.showMsg(`Has añadido un nuevo ${ghostPet.type} a tu colección.`, 'info');
            this.saveProgress();
        } else {
            this.showMsg('Ya tienes el máximo de GhostPetz.', 'warning');
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
