class Player {
    constructor() {
        this.ghostPetz = []; // Lista de mascotas GhostPetz del jugador
        this.currentPetIndex = 0; // Índice de la mascota actual
        this.inventory = []; // Inventario de objetos del jugador
        this.coins = 0; // Monedas del jugador
        this.missionHistory = []; // Historial de misiones completadas
        this.loadProgress(); // Cargar progreso guardado al iniciar
        this.updateSelectionVisibility(); // Actualizar visibilidad de la selección de mascotas
    }

    // Agrega una nueva mascota GhostPet al jugador
    addGhostPet(ghostPet) {
        if (this.ghostPetz.length < 6) {
            this.ghostPetz.push(ghostPet);
            this.updatePetButtons();
            this.showMsg(`Has añadido un nuevo ${ghostPet.type} a tu colección.`, 'info');
            this.saveProgress();
            this.updateSelectionVisibility();
        } else {
            this.showMsg('Ya tienes el máximo de 6 GhostPetz.', 'warning');
        }
    }

    // Cambia a la mascota seleccionada por su índice
    switchPet(index) {
        if (index >= 0 && index < this.ghostPetz.length) {
            this.currentPetIndex = index;
            this.ghostPetz[this.currentPetIndex].updateStats();
            $('#main-image').attr('src', this.ghostPetz[this.currentPetIndex].getImagePath());
        }
    }

    // Actualiza los botones de selección de mascotas
    updatePetButtons() {
        $('#pet-buttons').empty();
        this.ghostPetz.forEach((pet, index) => {
            $('#pet-buttons').append(`<button class="btn btn-secondary mx-2 mb-2" onclick="player.switchPet(${index})"><i class="fas fa-paw"></i> ${pet.type} ${index + 1}</button>`);
        });
    }

    // Actualiza el inventario de objetos
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

    // Agrega un objeto al inventario
    addItemToInventory(item) {
        this.inventory.push(item);
        this.updateInventory();
        this.showMsg(`¡Has encontrado un objeto: ${item.name}!`, 'success');
        this.saveProgress();
    }

    // Usa un objeto del inventario en la mascota actual
    useItem(index) {
        const item = this.inventory[index];
        this.ghostPetz[this.currentPetIndex].applyItem(item);
        this.inventory.splice(index, 1);
        this.updateInventory();
        this.showMsg(`Has usado ${item.name} en tu GhostPet.`, 'info');
        this.saveProgress();
    }

    // Vende un objeto del inventario
    sellItem(index) {
        const item = this.inventory[index];
        this.coins += item.value;
        this.inventory.splice(index, 1);
        this.updateInventory();
        this.updateCoins();
        this.showMsg(`Has vendido ${item.name} por ${item.value} monedas.`, 'info');
        this.saveProgress();
    }

    // Actualiza la cantidad de monedas mostradas
    updateCoins() {
        $('#coins').text('Monedas: ' + this.coins);
    }

    // Muestra un mensaje en la interfaz
    showMsg(message, type) {
        $('#messages').prepend(`<p>${type.toUpperCase()}: ${message}</p>`).hide().fadeIn(1000);
    }

    // Compra una nueva mascota GhostPet
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

    // Agrega una misión al historial de misiones completadas
    addMissionToHistory(mission) {
        this.missionHistory.push(mission);
        this.updateMissionHistory();
        this.saveProgress();
    }

    // Actualiza el historial de misiones mostradas
    updateMissionHistory() {
        $('#mission-history-items').empty();
        this.missionHistory.forEach((mission) => {
            $('#mission-history-items').append(`<div class="mission-history-item">${mission.description} - Recompensas: ${mission.rewards.join(', ')}</div>`);
        });
    }

    // Guarda el progreso del jugador en localStorage
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

    // Carga el progreso del jugador desde localStorage
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
            this.updateSelectionVisibility();
        }
    }

    // Actualiza la visibilidad de la selección de mascotas
    updateSelectionVisibility() {
        if (this.ghostPetz.length === 0) {
            $('#collapseSelection').collapse('show');
        } else {
            $('#collapseSelection').collapse('hide');
        }
    }

    // Restablece el juego
    resetGame() {
        localStorage.removeItem('ghostPetzProgress');
        this.ghostPetz = [];
        this.currentPetIndex = 0;
        this.inventory = [];
        this.coins = 0;
        this.missionHistory = [];
        $('#main-image').attr('src', 'assets/img/principal.webp');
        $('#pet-status-card, #activities-card, #missions-card, #inventory-card, #coins-card, #explore-card, #switch-pet-card, #buy-pet-card, #missions-history-card, #options-card').hide();
        $('#collapseSelection').collapse('show');
        this.updateInventory();
        this.updateCoins();
        this.updateMissionHistory();
        this.updatePetButtons();
    }
}
