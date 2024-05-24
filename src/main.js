// main.js

document.addEventListener("DOMContentLoaded", function() {
    window.player = new Player(); // Esto automáticamente carga el progreso.
});

function selectPet(type) {
    const ghostPet = new GhostPet(type);
    player.addGhostPet(ghostPet);
    player.switchPet(player.ghostPetz.length - 1);
    $('#main-image').attr('src', ghostPet.getImagePath());
    $('#headingSelection').hide();
    $('#pet-status-card, #activities-card, #missions-card, #inventory-card, #coins-card, #explore-card, #switch-pet-card, #buy-pet-card, #missions-history-card, #options-card').show();
}

function performActivity(activity) {
    player.ghostPetz[player.currentPetIndex].performActivity(activity);
}

function startMission(mission) {
    $('#minigameModal').modal('show');
}

function completeMinigame() {
    const missionEffects = player.ghostPetz[player.currentPetIndex].getMissionEffects('busquedaTesoros');
    player.ghostPetz[player.currentPetIndex].applyEffects(missionEffects);
    player.coins += missionEffects.coins || 0;
    player.updateCoins();
    player.addMissionToHistory({ description: `Misión: busquedaTesoros`, rewards: missionEffects.rewards });
    player.showMsg(`Tu GhostPet ha completado la misión: busquedaTesoros`, 'info');
    player.saveProgress();
}

function exploreArea(area) {
    player.showMsg(`Explorando ${area}`, 'info');
    player.ghostPetz[player.currentPetIndex].gainXP(15);
}

function buyPet(type) {
    player.buyPet(type);
}

function resetGame() {
    player.resetGame();
}
