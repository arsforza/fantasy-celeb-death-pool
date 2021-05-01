const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      name: 'deathPoolCookie',
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 600000
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_LOCAL,
      })
    })
  )
}