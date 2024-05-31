document.addEventListener("DOMContentLoaded", function() {
    window.player = new Player(); // Esto automáticamente carga el progreso.

    // Evento para cerrar el modal y otorgar recompensas
    $('#closeMissionModal').on('click', function() {
        player.ghostPetz[player.currentPetIndex].completeMission();
        $('#minigameModal').modal('hide');
    });
});

function selectPet(type) {
    const ghostPet = new GhostPet(type);
    player.addGhostPet(ghostPet);
    player.switchPet(player.ghostPetz.length - 1);
    $('#main-image').attr('src', ghostPet.getImagePath());
    $('#pet-status-card, #activities-card, #missions-card, #inventory-card, #coins-card, #explore-card, #switch-pet-card, #buy-pet-card, #missions-history-card, #options-card').show();
}

function performActivity(activity) {
    player.ghostPetz[player.currentPetIndex].performActivity(activity);
}

function startMission(mission) {
    player.ghostPetz[player.currentPetIndex].startMission(mission);
}

function exploreArea(area) {
    const randomEvent = Math.random();
    if (randomEvent < 0.4) {
        player.ghostPetz[player.currentPetIndex].gainXP(15);
        player.showMsg(`Tu GhostPet ha ganado 15 XP explorando ${area}.`, 'info');
    } else if (randomEvent < 0.7) {
        const item = player.ghostPetz[player.currentPetIndex].findRandomItem();
        player.addItemToInventory(item);
    } else {
        startMission('exploracion');
    }
}

function buyPet(type) {
    player.buyPet(type);
}

function resetGame() {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
        player.resetGame();
    }
}
