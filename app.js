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
const bcrypt = require('bcryptjs');


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

async function isAuthenticatedMiddleware(ctx, next) {
    if (!ctx.state.isLogged) {
        ctx.redirect('/login');

        return;
    }

    await next();
}

//TODO add error check validation
//TODO model bootstrap
//TODO add router to diferent file

async function isSameUserMiddleware(ctx, next) {

    if (!('id' in ctx.request.body) || 'string' !== typeof ctx.request.body.id){
        ctx.status = 400;
        ctx.body = {
            success: false,
            error: "You don't have permission to delete"
        };

        return;
    }

    const thing = await dataBase.getThing(ctx.request.body.id);


    if (!thing) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            error: "You don't have permission to delete"
        };

        return;
    }

    if (thing.userid !== ctx.state.user.id) {
        ctx.status = 403;
        ctx.body = {
            success: false,
            error: "You don't have permission to delete"
        };

        return;
    }

    await next();
}


router.use('/user', isAuthenticatedMiddleware);
router.use('/thing', isAuthenticatedMiddleware);

router.get('/', indexPage);
router.get('/login', loginPage);
router.get('/user/logout', logout);
router.get('/user/things', indexPageById);
router.get('/registration', registrationForm);
router.post('/registration', addUser);
router.post('/thing/delete', isSameUserMiddleware, deleteThing);
router.post('/thing/update', isSameUserMiddleware, updateThing);
router.post('addThing', '/thing/add', addItem);
router.post('/login', login);


async function login(ctx) {
    return passport.authenticate('local', async function (err, user, info, status) {
        if (user === false) {
            // ctx.status = 401;
            await ctx.render('nouser', {
                success: false
            });
        } else {
            ctx.body = {success: true};
            ctx.redirect(`/user/things`);
            return ctx.login(user)
        }
    })(ctx);
}

async function registrationForm(ctx) {
    await ctx.render('register');
}

async function addUser(ctx) {
    const body = ctx.request.body;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(body.password, salt, async function (err, hash) {
            await dataBase.addUser(body.username, hash);
        });
    });
    ctx.redirect('/')
}

async function deleteThing(ctx) {
    try {
        await dataBase.deleteById(ctx.request.body.id);
        console.log(ctx.request.body)
        ctx.body = {
            success: true
        };

    } catch (e) {
        console.log(e);

        if (typeof ctx.request.body.id !== 'number') {
            ctx.throw(400, 'You dont have permission');

            return;
        }

        ctx.body = "You don't have permission to delete";
    }

}

async function updateThing(ctx) {

    const body = ctx.request.body;

    try {
        await dataBase.updateThing(body.changeThing, body.id);

        ctx.body = {
            success: true
        };

    } catch (e) {
        console.log(e);
    }


}

//TODO generate rout address

async function addItem(ctx) {
    if (ctx.state.isLogged) {
        console.log(ctx.request.body);
        try {
            await dataBase.addThingUser(ctx.request.body.thing, ctx.state.user.id, ctx.request.body.private);
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
        title: `User ${ctx.state.user.name} loggin`,
        urlAddThing: router.url('addThing')
    });
}

async function indexPage(ctx) {
    await ctx.render('index', {
        things: await dataBase.getThings(),
        title: 'All Things',
        urlAddThing: router.url('addThing')
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
        ctx.state.isGuest = ctx.isUnauthenticated();
        ctx.state.userObj = ctx.state.user;

        await next();
    })
    .use(router.routes()).use(router.allowedMethods());

app.listen(3000);