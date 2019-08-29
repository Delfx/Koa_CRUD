const Koa = require('koa');
const KoaRouter = require('koa-router');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
require('./auth');
const passport = require('koa-passport');
const mysql = require(path.join(__dirname, 'database', 'thingsDatabase.js'));
const session = require('koa-session');


const app = new Koa();
const router = new KoaRouter();
const dataBase = new mysql();

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'layout',
    viewExt: 'ejs',
    cache: false,
    debug: false
});

router.use('/user', async (ctx, next) => {
    if (!ctx.state.isLogged) {
        ctx.redirect('/login');

        return;
    }

    await next();
});

router.get('/', indexPage);
router.get('/login', loginPage);
router.get('/user/logout', logout);
router.get('/user/things', indexPageById);
router.post('/delete', deleteThing);
router.post('/add', addItem);
router.post('/login', login);

async function login(ctx) {
    return passport.authenticate('local', async function (err, user, info, status) {
        if (user === false) {
            ctx.status = 401;
            ctx.body = {success: false}
        } else {
            ctx.body = {success: true};
            ctx.redirect(`/user/things`);
            return ctx.login(user)
        }
    })(ctx);
}

async function deleteThing(ctx) {
    try {
        const getUserIdfromThings = await dataBase.getUserIdFromThings(ctx.request.body.id);

        if (!(getUserIdfromThings[0].userid === ctx.state.user.id)) {
            ctx.body = "You don't have permission to delete";
            console.log(!(getUserIdfromThings[0].userid === ctx.state.user.id));

            return;
        }

        await dataBase.deleteById(ctx.request.body.id);
        ctx.redirect(`/user/things`);
    } catch (e) {
        console.log(e);

        if (typeof ctx.request.body.id !== "number") {
            // ctx.body = "You don't have permission";
            ctx.throw(400, 'You dont have permission');
            return;
        }
        ctx.body = "You don't have permission to delete";
    }

}

async function addItem(ctx) {
    if (ctx.state.isLogged) {
        try {
            await dataBase.addThingUser(ctx.request.body.thing, ctx.state.user.id);
            ctx.redirect(`/user/things`);


        } catch (e) {
            console.log(e);
            ctx.throw()
        }

        return;
    }
    try {
        await dataBase.addThing(ctx.request.body.thing);
        ctx.redirect('/');

    } catch (e) {
        console.log(e);
    }
}

async function loginPage(ctx) {
    await ctx.render('login');
}

async function logout(ctx) {
    ctx.logout();
    ctx.redirect('/');

}

async function indexPageById(ctx) {
    await ctx.render('index', {
        things: await dataBase.getThingsById(ctx.state.user.id),
        title: `User ${ctx.state.user.name} loggin`
    });
}

async function indexPage(ctx) {
    if (ctx.state.isLogged) {
        ctx.redirect('/user/things');

        return;
    }

    await ctx.render('index', {
        things: await dataBase.getThings(),
        title: 'Hello'
    });
}

app.keys = ['secret'];

app
    .use(bodyParser())
    .use(serve(path.join(__dirname, 'static')))
    .use(session({}, app))
    .use(passport.initialize())
    .use(passport.session())
    .use(async (ctx, next) => {
        ctx.state.isLogged = ctx.isAuthenticated();
        ctx.state.userObj = ctx.state.user;

        await next();
    })
    .use(router.routes()).use(router.allowedMethods());

app.listen(3000);