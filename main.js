import {people} from './data/people.js';
import {species} from './data/species.js';

console.log(people);

const speciesSection = document.querySelector('#species');

species.map(val => {
    let newSpecies = document.createElement('div');
    newSpecies.classList.add('new-species');
    
    let speciesName = document.createElement('h2');
    speciesName.append(val.name);
    newSpecies.append(speciesName);

    let classification = document.createElement('h6');
    classification.append('Classification: ' + val.classification);
    newSpecies.append(classification);
    
    let language = document.createElement('h6');
    language.append('Spoken Language: ' + val.language);
    newSpecies.append(language);

    let lifespan = document.createElement('h6');
    if (val.average_lifespan !== 'unknown'){
        lifespan.append('Average Lifespan: ' + val.average_lifespan + ' years');
    } else {
        lifespan.append('Average Lifespan: ' + val.average_lifespan);
    }
    newSpecies.append(lifespan);

    let specimens = document.createElement('div');

    let knownSpeciesTitle = document.createElement('h5');
    knownSpeciesTitle.append('Known Specimens');
    specimens.append(knownSpeciesTitle);

    let specimenList = document.createElement('ul');
    specimens.classList.add('specimen-list')
    people.map(person => {
        if (person.species[0] === val.url){
            let specimen = document.createElement('li');
            specimen.append(person.name);
            specimenList.append(specimen);
        }
    });
    specimens.append(specimenList)
    newSpecies.append(specimens);

    speciesSection.append(newSpecies)
})



