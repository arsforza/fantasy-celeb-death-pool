const Person = require('../models/Person.model');
const Bet = require('../models/Bet.model');
const Death = require('../models/Death.model');
const { updateMany } = require('../models/Person.model');

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

const getAllThisYearsBets = () => {
  return new Promise((resolve, reject) => {
    Bet.find({ year: currentYear })
    .populate({
      path: 'userId',
      model: 'User'
    })
    .populate({
      path: 'people',
      model: 'Person'
    })
    .then(allBets => {
      resolve(allBets);
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
    const { wikiId, name, description, birthYear, wikipediaUrl, jsonUrl } = person;
  
    Person.create({
      wikiId: wikiId,
      name: name,
      description: description,
      birthYear: birthYear,
      wikipediaUrl: wikipediaUrl,
      jsonUrl: jsonUrl,
      basePoints: calculateBasePoints(birthYear),
    })
    .then(createdPerson => {
      resolve(createdPerson);
    })
    .catch(err => console.error(err));
  });
}

function calculateBasePoints(birthYear) {
  const age = currentYear - birthYear;

  let bonus = 1;
  
  switch(true) {
    case (age < 10):
      bonus = 5;
      break;
    case (age < 20):
      bonus = 3;
      break;
    case (age < 30):
      bonus = 2;
      break;
    case (age < 40):
      bonus = 1.5;
      break;
    case (age < 50):
      bonus = 1.2;
      break;
    case (age < 60):
      bonus = 1.1;
      break;
    default:
      bonus = 1;
  }

  return bonus * 1000 / age;
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

// const getDeadPeople = (year) => {
//   return new Promise((resolve, reject) => {
//     People.find({ deathYear: year })
//     .then(people => {
//       resolve(people)
//     })
//     .catch(err => console.error(err));
//   });
// }

const getPersonById = (personId) => {
  return new Promise((resolve, reject) => {
    Person.findById(personId)
    .then(person => resolve(person))
    .catch(err => console.error(err));
  });
}

const updatePoints = (person) => {
  Bet.updateMany({ year: currentYear, people: person._id}, { $inc: { points: person.basePoints } })
  .then()
  .catch(err => console.error(err));



  // getAllThisYearsBets()
  // .then(bets => {
  //   bets.forEach(bet => {
  //     console.log('bet :', bet);
  //     if(bet.people.some(betPerson => betPerson._id === person._id)) {
  //       const newPoints = bet.points + person.basePoints;
  //       console.log('newPoints :', newPoints);
  //       Bet.findOneAndUpdate({_id: bet._id}, { points: newPoints })
  //       .then()
  //       .catch(err => console.error(err));
  //     }
  //   });
  // })
  // .catch(err => console.error(err));
}

const newDeath = (personId) => {
  return new Promise((resolve, reject) => {
    getPersonById(personId)
    .then(person => {
      console.log('before update');
      updatePoints(person);
      console.log('after update');
      Death.create({ person: person._id, year: currentYear })
      .then(death => resolve(death))
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
  });
}

const getThisYearDeaths = () => {
  return new Promise((resolve, reject) => {
    Death.find({ year: currentYear })
    .populate({
      path: 'person',
      model: 'Person'
    })
    .then(deathList => resolve(deathList))
    .catch(err => console.error(err));
  });
}

const howManyBets = (personId) => {
  return new Promise((resolve, reject) => {
    Bet.find({ year: currentYear })
    .then(bets => {
      return bets.reduce((sum, bet) => {
        if(bet.people.includes(personId))
          sum++;
      },  0)
    })
    .then(repeatedBets => resolve(repeatedBets))
    .catch(err => console.error(err));
  });
}

const didPersoDie = (personId) => {
  return new Promise((resolve, reject) => {
    Death.findOne({person: personId})
    .then(foundDeath => {
      foundDeath ? resolve(true) : resolve(false);
    })
    .catch(err => console.error(err));
  })
}

module.exports = {
  getThisYearDeaths,
  getUserThisYearBet,
  getPersonByWikiId,
  getAllPeople,
  getAllThisYearsBets,
  createNewPerson,
  createBet,
  isBetFull,
  isPersonAlreadyInDb,
  isPersonAlreadyInBet,
  didPersoDie,
  addPersonToBet,
  newDeath,
  howManyBets,
}