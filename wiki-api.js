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


function isRealPerson(ent) {
  return ent.claims.P31[0].mainsnak.datavalue.value.id === 'Q5';
}

function getInfo(entity) {
  const { id: wikiId, labels, descriptions, claims, sitelinks } = entity;
  let name = '';
  if(labels.en)
    name = labels.en.value;

  let birth = null;
  if(claims.P569)
    birth = claims.P569[0].mainsnak.datavalue.value.time;
  else
    return false;
  
  let death = null;
  if(claims.P570)
    death = claims.P570[0].mainsnak.datavalue.value.time;

  let description = ''
  if(descriptions.en)
    description = descriptions.en.value;

  let wikipediaUrl = ''
  if(sitelinks.enwiki)
    wikipediaUrl = sitelinks.enwiki.url;

  return { wikiId, name, description, birth, death };
}

function filterResults(allSearchResults) {
    const apiCalls = [];
    allSearchResults.forEach(currentResult => {
      const { id } = currentResult;
      apiCalls.push(axios.get(`https://www.wikidata.org/wiki/Special:EntityData/${id}.json?`));
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
  if(isRealPerson(ent))
    return getInfo(ent);
  else 
    return false;
}


module.exports = {
  searchPerson
};