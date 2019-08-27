const passport = require('koa-passport');
const path = require('path');
const mysql = require(path.join(__dirname, 'database', 'thingsDatabase.js'));
const LocalStrategy = require('passport-local').Strategy;

const dataBase = new mysql();

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(async function (id, done) {
    const user = await dataBase.getUserById(id);
    done(null, {
        id: user[0].id,
        name: user[0].name
    });
});

passport.use(new LocalStrategy(async function (username, password, done) {
    const user = await dataBase.getUser(username);
    done(null, {
        id: user[0].id,
        name: user[0].name
    });

}));
