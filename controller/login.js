const passport = require('koa-passport');


class Login {

    constructor(){

    }

    async login(ctx) {
        return passport.authenticate('local', async function (err, user, info, status) {
            if (user === false) {
                await ctx.render('nouser', {
                    success: false
                });
            } else {
                ctx.body = {success: true};
                ctx.redirect('/user/things');
                return ctx.login(user)
            }
        })(ctx);
    }

    async loginPage(ctx) {
        await ctx.render('login');
    }

    async logout(ctx) {
        ctx.logout();
        ctx.redirect('/');

    }

    async registrationForm(ctx) {
        await ctx.render('register');
    }


}

module.exports = Login;