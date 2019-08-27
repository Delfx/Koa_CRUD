const Koa = require('koa');
const KoaRouter = require('koa-router');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
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

router.get('/', indexPage);
router.get('/login', loginPage);
router.get('/logout', logout);
router.get('userthings','/userthings/:id', indexPageById);
router.post('/delete', deleteThing);
router.post('/addUser', addThingToUser);
router.post('/add', addItem);
router.post('/login', login);

async function login(ctx) {
    return passport.authenticate('local', async function (err, user, info, status) {
        if (user === false) {
            ctx.status = 401;
            ctx.body = {success: false}
        } else {
            router.url('userthings', user.id);
            ctx.body = {success: true};
            ctx.redirect(`/userthings/${user.id}`);
            return ctx.login(user)
        }
    })(ctx);
}

async function deleteThing (ctx){
    await dataBase.deleteById(ctx.request.body.id);
    ctx.redirect(`/userthings/${ctx.state.user.id}`);
}

async function addThingToUser(ctx){
    try {
        await dataBase.addThingUser(ctx.request.body.thing, ctx.state.user.id);
        ctx.redirect(`/userthings/${ctx.state.user.id}`);

    } catch (e) {
        console.log(e);
    }
}

async function addItem(ctx) {
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
    })
}

async function indexPage(ctx) {
    await ctx.render('index', {
        things: await dataBase.getThings(),
        title: 'Hello'
    });
}

app.keys = ['secret'];

app
    .use(bodyParser())
    .use(session({}, app))
    .use(passport.initialize())
    .use(passport.session())
    .use(async (ctx, next) => {
        ctx.state.isLogged = ctx.isAuthenticated();
        await next();
    })
    .use(async (ctx, next) => {
        ctx.state.userObj = ctx.state.user;
        await next();
    })
    .use(router.routes()).use(router.allowedMethods());

app.listen(3000);