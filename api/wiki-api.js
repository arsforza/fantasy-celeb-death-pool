const axios = require('axios');
const schedule = require('node-schedule');
const localApi = require('./local-api');

const searchPerson = (searchQuery) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchQuery}&language=en&format=json`)
    .then(responseFromApi => {
      return responseFromApi.data.search;
    })
    .then( allSearchResults => {
      filterResults(allSearchResults)
      .then(filteredResults => {
        resolve(filteredResults);
      })
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
  })
}

const checkDeath = (jsonUrl) => {
  return new Promise((resolve, reject) => {
    axios.get(jsonUrl)
    .then(responseFromApi => {
      const firstKey = Object.keys(responseFromApi.data.entities)[0];
      const ent = responseFromApi.data.entities[`${firstKey}`];
      resolve(!isAlive(ent));
    })
    .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
}

const graveDigger = schedule.scheduleJob('0 7 0 * * *', () => {
  console.log('--- GRAVEDIGGER ---');
  localApi.getAllPeople()
  .then(people => {
    people.forEach(person => {
      if(person.deathYear === null) {
        checkDeath(person.jsonUrl)
        .then(isDead => {
          if(isDead) {
            localApi.newDeath(person.id)
            .then(death => console.log(death))
            .catch(err => console.error(err));
          }
        }).catch(err => console.error(err));
      }
    });
  })
  .catch(err => console.error(err));
});

function filterResults(allSearchResults) {
    const apiCalls = [];
    allSearchResults.forEach(currentResult => {
      const { id } = currentResult;
      apiCalls.push(axios.get(`https://www.wikidata.org/wiki/Special:EntityData/${id}.json`));
    });

    return Promise.all(apiCalls)
    .then(responses => {
      const filteredArray = [];

      responses.forEach(singleResponse => {
        if(getPersonData(singleResponse)) {
          filteredArray.push(getPersonData(singleResponse));
        }
      })

      return filteredArray;
    })
    .catch(error => console.error(error));    
}

function getPersonData(responseFromApi) {
  const firstKey = Object.keys(responseFromApi.data.entities)[0];
  const ent = responseFromApi.data.entities[`${firstKey}`];
  if(isEligible(ent))
    return getInfo(ent);
  else 
    return false;
}

function isEligible(ent) {
  return isRealPerson(ent) && isAlive(ent) && hasEnglishWikiPage(ent);
}

function isRealPerson(ent) {
  return ent.claims.P31[0].mainsnak.datavalue.value.id === 'Q5' ? true : false;
}

function isAlive(ent) {
  return !ent.claims.P570 ? true : false;
}

function hasEnglishWikiPage(ent) {
  return ent.sitelinks.enwiki ? true : false;
}

function getInfo(entity) {
  const { id: wikiId, labels, descriptions, claims, sitelinks } = entity;
  let name = '';
  if(labels.en)
    name = labels.en.value;

  let birthYear = null;
  if(claims.P569)
    birthYear = getYear(claims.P569[0].mainsnak.datavalue.value.time);
  else
    return false;
  
  let description = '';
  if(descriptions.en)
    description = descriptions.en.value;

  let wikipediaUrl = '';
  if(sitelinks.enwiki)
    wikipediaUrl = sitelinks.enwiki.url;

  const jsonUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikiId}.json`;

  return { wikiId, name, description, birthYear, wikipediaUrl, jsonUrl };
}

function getYear(date) {
  return Number(date.substring(1,5));
}

module.exports = {
  searchPerson,
  checkDeath,
};