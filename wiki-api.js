const axios = require('axios');

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

  let birth = null;
  if(claims.P569)
    birth = getYear(claims.P569[0].mainsnak.datavalue.value.time);
  else
    return false;
  
  let death = null;
  if(claims.P570)
    death = getYear(claims.P570[0].mainsnak.datavalue.value.time);

  let description = '';
  if(descriptions.en)
    description = descriptions.en.value;

  let wikipediaUrl = '';
  if(sitelinks.enwiki)
    wikipediaUrl = sitelinks.enwiki.url;

  const jsonUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikiId}.json`;

  return { wikiId, name, description, birth, death, wikipediaUrl, jsonUrl };
}

function getYear(date) {
  return Number(date.substring(1,5));
}

module.exports = {
  searchPerson
};