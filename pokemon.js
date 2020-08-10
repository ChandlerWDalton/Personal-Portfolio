var generate = document.querySelector('#generate');

const pokemonList = document.querySelector('#pokemon');
pokemonList.classList.add('pokemon-page');
let cards = document.createElement('div');
        
cards.classList.add('card-page');

fetch('https://pokeapi.co/api/v2/pokemon?limit=900')
    .then(response => response.json())
    .then(data => {
        let addCard = document.createElement('select');
        console.log(data);
        for (const pokemon of data.results){
            let option = document.createElement('option');
            option.append(pokemon.name);
            addCard.append(option);
        }
        pokemonList.append(addCard);
        addCard.addEventListener('change', (event) => {
            fetch('https://pokeapi.co/api/v2/pokemon/'+event.target.value)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card');
    
                let cardFront = document.createElement('div');
                cardFront.classList.add('card-face');
                cardFront.classList.add('card-face--front');
    
                let cardBack = document.createElement('div');
                cardBack.classList.add('card-face');
                cardBack.classList.add('card-face--back');
    
                let pokemonName = document.createElement('h5');
                let pokemonImage = document.createElement('img');
                let pokemonId = document.createElement('h5');
                let pokemonTypeHead = document.createElement('h5');
                let pokemonTypesList = document.createElement('ul');
    
                pokemonImage.src = data.sprites.front_default;
    
                pokemonName.append(data.name);
                pokemonId.append('#');
                pokemonId.append(data.id);
                
                pokemonTypeHead.append('Types: ')
                data.types.map(val => {
                    let pokemonType = document.createElement('li');
                    console.log(val.type.name);
                    pokemonType.append(val.type.name);
                    pokemonTypesList.append(pokemonType);
                })
    
                cardFront.append(pokemonImage);
                cardFront.append(pokemonName);
    
                cardBack.append(pokemonId)
                cardBack.append(pokemonTypeHead);
                cardBack.append(pokemonTypesList);
    
                pokemonCard.append(cardFront);
                pokemonCard.append(cardBack);
    
                cards.append(pokemonCard)
                pokemonList.append(cards);
    
                pokemonCard.addEventListener('click', function() {
                    pokemonCard.classList.toggle('is-flipped');
                })
            })
        })
    });



generate.addEventListener('click', async function() {
    for (let i = 0; i < 25; i++) {
        let random = Math.floor(Math.random() * 807) + 1;
        fetch('https://pokeapi.co/api/v2/pokemon/'+random)
            .then(response => response.json())
            .then(data => {
            console.log(data);

            let pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            let cardFront = document.createElement('div');
            cardFront.classList.add('card-face');
            cardFront.classList.add('card-face--front');

            let cardBack = document.createElement('div');
            cardBack.classList.add('card-face');
            cardBack.classList.add('card-face--back');

            let pokemonName = document.createElement('h5');
            let pokemonImage = document.createElement('img');
            let pokemonId = document.createElement('h5');
            let pokemonTypeHead = document.createElement('h5');
            let pokemonTypesList = document.createElement('ul');

            pokemonImage.src = data.sprites.front_default;

            pokemonName.append(data.name);
            pokemonId.append('#');
            pokemonId.append(data.id);
            
            pokemonTypeHead.append('Types: ')
            data.types.map(val => {
                let pokemonType = document.createElement('li');
                console.log(val.type.name);
                pokemonType.append(val.type.name);
                pokemonTypesList.append(pokemonType);
            })

            cardFront.append(pokemonImage);
            cardFront.append(pokemonName);

            cardBack.append(pokemonId)
            cardBack.append(pokemonTypeHead);
            cardBack.append(pokemonTypesList);

            pokemonCard.append(cardFront);
            pokemonCard.append(cardBack);

            cards.append(pokemonCard)
            pokemonList.append(cards);

            pokemonCard.addEventListener('click', function() {
                pokemonCard.classList.toggle('is-flipped');
            })
        })  
    }
    
});