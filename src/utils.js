// utils.js

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
