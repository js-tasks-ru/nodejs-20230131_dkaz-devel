const path = require('path');
const Koa = require('koa');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class Chat {
    constructor() {
        this.subscribers = [];
    }

    publish(message) {
        this.subscribers.forEach(resolve => {
            resolve(message)
        })
        this.subscribers = [];
    }

    subscribe() {
        return new Promise(resolve => {
            this.subscribers.push(resolve);
        })
    }
}

const chat = new Chat();

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await chat.subscribe()
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message) {
        chat.publish(ctx.request.body.message);
        ctx.status = 201;
    } else {
        ctx.status = 400;
    }
});

app.use(router.routes());

module.exports = app;
