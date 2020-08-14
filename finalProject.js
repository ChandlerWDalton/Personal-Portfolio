var battleTop = document.querySelector('#battle-top');
var battleBottom = document.querySelector('#battle-bottom');
var actions = document.querySelector('#actions');
var displayJournal = document.querySelector('#directory');
var rivalScreen = document.querySelector('#rival-screen');

let userPokemon = [];
let activePokemon = {};
let activePokemonMoves = [];
let rivalsUsedPokemon = 0;
let rivalPokemon;
let rivalPokemonMoves = [];
let userTurn = true;
let battleStarted = false;
let canSetActive = true;

let rivalTrainer = document.createElement('img');
rivalTrainer.src = 'images/bluesprite.png';
rivalTrainer.classList.add('trainer-sprite');
battleTop.append(rivalTrainer);

let trainer = document.createElement('img');
trainer.src = 'images/redsprite.png'
trainer.classList.add('sprite');
battleBottom.append(trainer);

let journal = document.createElement('h6');
journal.append('Welcome to your Pokemon Battle! Start by selecting your team and hit that battle button when your team is ready!');
displayJournal.append(journal);

let intro = document.createElement('div');
intro.classList.add('intro');
let battle = document.createElement('button');
battle.append('Battle');
battle.classList.add('battleButton');

let pSelect = document.createElement('div');
pSelect.classList.add('pSelect');
let info = document.createElement('h5');
info.append("Please select you're team of three.");

let pTeam = document.createElement('div');
let moves = document.createElement('div');
moves.classList.add('moves');
pTeam.classList.add('pokemon-team');
fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
    .then(response => response.json())
    .then(data => {
        let pDropdown = document.createElement('select');
        pDropdown.classList.add('dropdown')
        for (const pokemon of data.results){
            let option = document.createElement('option');
            option.append(pokemon.name);
            pDropdown.append(option);
        }
        intro.append(pDropdown);
    })
    pSelect.addEventListener('change', async (event) => {
        fetch('https://pokeapi.co/api/v2/pokemon/' + event.target.value)
        .then(response => response.json())
        .then(data => {
            let name = data.name;
            let img = data.sprites.front_default;

            let pokemon = {
                name,
                img
            }
            userPokemon.push(pokemon);
            mapTeam();
            if (userPokemon.length === 3){
                intro.style.display = "none";
                battle.style.display = "block";
            }
        });
        
    });

    async function mapTeam(){
        while (pTeam.firstChild){
            pTeam.removeChild(pTeam.firstChild);
        }
        userPokemon.map(pokemon => {
            
            let teamPlayer = document.createElement('div');
            teamPlayer.classList.add('team-player')
            let pokemonImage = document.createElement('img');
            let pokemonName = document.createElement('h5');

            pokemonImage.src = pokemon.img;
            pokemonName.append(pokemon.name);

            teamPlayer.append(pokemonImage);
            teamPlayer.append(pokemonName);

            teamPlayer.addEventListener('click', function() {
                if(battleStarted === true && userTurn === true && canSetActive === true){
                    fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon.name)
                        .then(response => response.json())
                        .then( async data => {
                            activePokemon = await data;
                            displayActivePokemon(data);
                            canSetActive = false;
                        });
                }
            })

            pTeam.append(teamPlayer);
    });
}

async function displayActivePokemon(activePokemon){
    while (battleBottom.firstChild){
        battleBottom.removeChild(battleBottom.firstChild);
    }
    let activePokemonImg = document.createElement('img');
    let activeDetails = document.createElement('div');
    let activePokemonName = document.createElement('h5');
    let activePokemonHp = document.createElement('h6');
    if (activePokemon.sprites.back_default !== null){
        activePokemonImg.src = activePokemon.sprites.back_default;
    } else {
        activePokemonImg.src = activePokemon.sprites.front_default;
    }
    activePokemonName.append(activePokemon.name);
    activePokemonHp.append('HP: ')
    activePokemonHp.append(activePokemon.stats[0].base_stat);
    battleBottom.append(activePokemonImg);
    activeDetails.append(activePokemonName);
    activeDetails.append(activePokemonHp);
    battleBottom.append(activeDetails);
    let moveNames = [];
    for (let i = 0; i < 4; i++) {
        moveNames.push(activePokemon.moves[Math.floor(Math.random() * activePokemon.moves.length)].move.name);
    }
    getMoves(moveNames);
}

async function getMoves(moveNames){
    let moves = []
    moveNames.map(move => {
        fetch('https://pokeapi.co/api/v2/move/' + move)
            .then(response => response.json())
            .then(data => {
                moves.push(data);
                activePokemonMoves = moves;
                mapMoves();
            })
    });
}

async function mapMoves(){
    while (moves.firstChild){
        moves.removeChild(moves.firstChild);
    }
    activePokemonMoves.map(move => {
        
        let moveCard = document.createElement('div');
        let moveName = document.createElement('h5');
        let movePower = document.createElement('h6');

        moveName.append(move.name);
        movePower.append(move.power);
        moveCard.append(moveName);
        if (move.power !== null){
            moveCard.append(movePower);
        } else {
            moveCard.append('-');
        }
        moveCard.addEventListener('click', function() {
            if (userTurn === true){
                battleSequence(move.power, move.name);
            } else {
                console.log('Its not your turn!');
            }
        })
        moves.append(moveCard);
});

}

battle.addEventListener('click', function(){
    battleStarted = true;
    generateRivalPokemon();
    battle.style.display = "none";
    updateJournal('Choose your active Pokemon and then your attack!')
});

async function generateRivalPokemon(){
    rivalPokemon = {};
    let random = Math.floor(Math.random() * 807) + 1;
    await fetch('https://pokeapi.co/api/v2/pokemon/'+random)
            .then(response => response.json())
            .then(data => {
                rivalPokemon = data;
                displayRivalPokemon(data);
            })
    if (userTurn === false){
        getRivalPokemonMove();
    }
}

async function displayRivalPokemon(rivalPokemon){
    while (battleTop.firstChild){
        battleTop.removeChild(battleTop.firstChild);
    }
    let rivalPokemonDisplay = document.createElement('div');
    let rivalPokemonImg = document.createElement('img');
    let rivalDetails = document.createElement('div');
    rivalDetails.classList.add('pokemon-details');
    let rivalPokemonName = document.createElement('h5');
    let rivalPokemonHp = document.createElement('h6');

    rivalPokemonImg.src = rivalPokemon.sprites.front_default;
    rivalPokemonImg.classList.add('pokemon-sprite');
    rivalPokemonName.append(rivalPokemon.name);
    rivalPokemonHp.append('HP: ')
    rivalPokemonHp.append(rivalPokemon.stats[0].base_stat);
    rivalDetails.append(rivalPokemonName);
    rivalDetails.append(rivalPokemonHp);
    rivalPokemonDisplay.append(rivalPokemonImg);
    battleTop.append(rivalDetails);
    battleTop.append(rivalPokemonDisplay);

        for (let i = 0; i < 3 - rivalsUsedPokemon; i++) {
        let pokeball = document.createElement('img')
        pokeball.src = 'images/pokeball.png';
        pokeball.classList.add('pokeball');
        rivalPokemonDisplay.append(pokeball);
    }
}

async function getRivalPokemonMove(){
    updateJournal(rivalPokemon.name + ' is thinking...', false);
        try {
            fetch('https://pokeapi.co/api/v2/move/'+ rivalPokemon.moves[Math.floor(Math.random() * activePokemon.moves.length)].move.name)
            .then(response => response.json())
            .then(data => {
                battleSequence(data.power, data.name);
            })
        } catch {
           getRivalPokemonMove();
        }
    
}

async function battleSequence(movePower, moveName){
    if (userTurn === true){
        rivalPokemon.stats[0].base_stat = await rivalPokemon.stats[0].base_stat - movePower;
        if (rivalPokemon.stats[0].base_stat <= 0){
            rivalsUsedPokemon = rivalsUsedPokemon + 1;
            if (rivalsUsedPokemon < 3){
                await updateJournal(activePokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!  ' + rivalPokemon.name + ' fainted!', true);
                await generateRivalPokemon();
            } else {
                while (battleTop.firstChild){
                    battleTop.removeChild(battleTop.firstChild);
                }
                updateJournal(activePokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!  ' + rivalPokemon.name + ' fainted!', false)
                finishBattle('You Win!');
            }
        } else {
            if (movePower!== null){
                updateJournal(activePokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!', true);
            } else {
                updateJournal(activePokemon.name + ' used ' + moveName + "! It doesn't seem like anything happened...", true);
            }
            displayRivalPokemon(rivalPokemon);
        }
        userTurn = false;
    } else {
        activePokemon.stats[0].base_stat = await activePokemon.stats[0].base_stat - movePower;
        if (activePokemon.stats[0].base_stat <= 0){
            canSetActive = true;
            let pos = userPokemon.map(function(data) {
                return data.name; 
            }).indexOf(activePokemon.name);
            userPokemon.splice(pos, 1);
            mapTeam();
            displayActivePokemon({});
            activePokemonMoves = [];
            mapMoves();
            if (userPokemon.length > 0){
                console.log(userPokemon.length);
                updateJournal(rivalPokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!  ' + activePokemon.name + ' fainted!', false);
            } else {
                updateJournal(rivalPokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!  ' + activePokemon.name + ' fainted!', false);
                finishBattle('You Lose...');
            }
        } else {
            if (movePower !== null){
                updateJournal(rivalPokemon.name + ' used ' + moveName + ' for ' + movePower + ' damage!', false);
            } else {
                updateJournal(rivalPokemon.name + ' used ' + moveName + "! It doesn't seem like anything happened...", false);
            }
            displayActivePokemon(activePokemon);
        }
        userTurn = true;
    }
}

async function updateJournal(message, rivalTurn){
    while (journal.firstChild){
        journal.removeChild(journal.firstChild);
    }
    journal.append(message);
    if (rivalTurn === true){
        setTimeout(function(){
            getRivalPokemonMove();
        }, 2000);
    }
}

async function finishBattle(message){
    while (battleTop.firstChild){
        battleTop.removeChild(battleTop.firstChild);
    }
    battleTop.append(rivalTrainer);
    while (battleBottom.firstChild){
        battleBottom.removeChild(battleBottom.firstChild);
    }
    battleBottom.append(trainer);

    setTimeout(function(){
        updateJournal(message, false)
    }, 2000);
    
}

pSelect.append(pTeam);
pSelect.append(battle);
actions.append(pSelect);
pSelect.append(intro);
intro.append(info);
actions.append(moves);