const passport = require('koa-passport');
const path = require('path');
const mysql = require(path.join(__dirname, 'database', 'thingsDatabase.js'));
const LocalStrategy = require('passport-local').Strategy;

const dataBase = new mysql();

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await dataBase.getUserById(id);
        done(null, {
            id: user[0].id,
            name: user[0].name
        });
    } catch (e) {
        done(e)
    }
});

passport.use(new LocalStrategy(async function (username, password, done) {
    try {
        const userObj = await dataBase.checkUser(username, password);

        if (userObj) {
            done(null, {
                id: userObj.id,
                username: userObj.name
            });
        } else {
            done(null, false);
        }
    } catch (e) {
        done(e);
    }
}));
