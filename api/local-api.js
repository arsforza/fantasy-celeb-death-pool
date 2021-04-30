const Person = require('../models/Person.model');
const Bet = require('../models/Bet.model');

const currentYear = new Date().getFullYear();

const getUserThisYearBet = (userId) => {
  return new Promise((resolve, reject) => {
    Bet.findOne({ userId: userId, year: currentYear })
    .populate({
      path: 'people',
      model: 'Person'
    })
    .then(thisYearBet => {
      thisYearBet ? resolve(thisYearBet) : resolve(false);
    })
    .catch(err => console.error(err))
  });
};

const isBetFull = (bet) => {
  return new Promise((resolve, reject) => {
    if(!bet.people) {
        resolve(false);
        return;
    } else {
      bet.people.length === 15 ? resolve(true) : resolve(false);
    }
  });
};

const getAllUserBets = (userId) => {
  return new Promise((resolve, reject) => {
    Bet.find({ userId })
    .then(allUserBets => {
      resolve(allUserBets);
    })
    .catch(err => console.error(err));
  });
};

const isPersonAlreadyInBet = (userId, wikiId) => {
  return new Promise((resolve, reject) => {
    let inBet = false;
    getUserThisYearBet(userId)
    .then(bet => {
      if(bet.people) {
        bet.people.forEach(person => {
          if(person.wikiId === wikiId) {
            inBet = true;
            return;
          }
        });
      }

      resolve(inBet);
    })
    .catch(err => console.error(err));
  });
}

const isPersonAlreadyInDb = (wikiId) => {
  return new Promise((resolve, reject) => {
    Person.findOne({ wikiId: wikiId })
    .then(person => {
      person ? resolve(true) : resolve(false);
    })
    .catch(err => console.error(err));
  });
};

const getPersonByWikiId = (wikiId) => {
  return new Promise((resolve, reject) => {
    Person.findOne({ wikiId: wikiId })
    .then(person =>{
      resolve(person)
    })
    .catch(err => console.error(err));
  })
}

const createNewPerson = (person) => {
  return new Promise((resolve, reject) => {
    const { wikiId, name, description, birthYear, deathYear, wikipediaUrl, jsonUrl } = person;
  
    Person.create({
      wikiId: wikiId,
      name: name,
      description: description,
      birthYear: birthYear,
      deathYear: deathYear,
      wikipediaUrl: wikipediaUrl,
      jsonUrl: jsonUrl
    })
    .then(createdPerson => {
      resolve(createdPerson);
    })
    .catch(err => console.error(err));
  });
}

const createBet = (userId) => {
  return new Promise((resolve, reject) => {
    Bet.create({ userId, year: currentYear, people: []})
    .then(bet => {
      resolve(bet)
    })
    .catch(err => console.error(err));
  });
}

const addPersonToBet = (userId, person) => {
  return new Promise((resolve, reject) => {
    Bet.findOneAndUpdate(
      { userId: userId, year: currentYear },
      { "$push": {people: [person._id]}}
    ).then( addedPerson => {
      resolve();
    })
    .catch(err => console.error(err));
  });
}

const getAllPeople = () => {
  return new Promise((resolve, reject) => {
    Person.find({})
    .then(people => {
      resolve(people)
    })
    .catch(err => console.error(err));
  });
}

const getDeadPeople = (year) => {
  return new Promise((resolve, reject) => {
    People.find({ deathYear: year })
    .then(people => {
      resolve(people)
    })
    .catch(err => console.error(err));
  });
}

module.exports = {
  getUserThisYearBet,
  isBetFull,
  getAllUserBets,
  isPersonAlreadyInDb,
  createNewPerson,
  createBet,
  isPersonAlreadyInBet,
  addPersonToBet,
  getPersonByWikiId,
  getAllPeople,
  getDeadPeople,
}