const Koa = require('koa');
const KoaRouter = require('koa-router');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const app = new Koa();
const router = new KoaRouter();

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'layout',
    viewExt: 'ejs',
    cache: false,
    debug: false
});

router.get('/', indexPage);
router.post('/add', addItem);

async function indexPage(ctx) {
    await ctx.render('index');
}

async function addItem(ctx) {
    console.log(ctx.request.body);
    ctx.redirect('/')
}

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);