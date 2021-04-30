const wikiApi = import('../../wiki-api');

window.addEventListener('load', () => {
  const searchTextField = document.querySelector('#search-text-field');
  const searchBtn = document.querySelector('#search-button');
  const searchResultsList = document.querySelector('#search-results');
  
  searchBtn.addEventListener('click', (event) => {
  console.log('search clicked');
   const searchQuery = searchTextField.nodeValue;

   wikiApi.searchPerson(searchQuery)
  .then(searchResults => {
    searchResults.forEach(person => {
      searchResultsList.textContent += `
      <li>
        <a href="${person.wikipediaUrl}" target="_blank"><h2>${person.name}</h2></a>
        <p>${person.description}</p>
        <p>Birth year: ${person.birth}}</p>
        <form action="/add-person" method="post"><button class="btn btn-primary">Add person to list</button></form>
      </li>
      `
    });
  })
  });
})