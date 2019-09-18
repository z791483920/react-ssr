import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import process from 'process';
import staticCache from 'koa-static-cache';
import compress from 'koa-compress';
import fs from 'fs';
import favicon from 'koa-favicon';
import getModuleFromString from './getModuleFromString';
import render from './render';

const app = new Koa();
const router = new Router();
const baseDir = process.cwd();

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = process.env.NODE_ENV === 'development';

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(favicon(`${__dirname}/favicon.ico`));

if (!__DEV__) {
    app.use(async (ctx, next) => {
        const manifestPath = path.join(baseDir, 'build/manifest.json');
        // eslint-disable-next-line no-underscore-dangle
        ctx.__assets = JSON.parse(fs.readFileSync(manifestPath));
        await next();
    });
    app.use(
        staticCache(path.join(baseDir, 'build'), {
            maxAge: 365 * 24 * 60 * 60,
            gzip: true
        })
    );
    const webpackServerConfig = require('../webpack/server/webpackProdConfig');
    const renderPath = path.join(webpackServerConfig.output.path, 'index.js');
    const content = fs.readFileSync(renderPath, 'utf-8').toString();
    // 获取bundle其中的一个方法
    // const bundle = eval(content).default;
    // 第二种
    const bundle = getModuleFromString(content, renderPath);

    router.get('/*', async (ctx, next) => {
    // if (ctx.url === '/favicon.ico') {
    // } else {
    // }
        await next();
        ctx.body = render(bundle({ ctx }), ctx.__assets);
    });
    app.use(router.routes());
} else {
    // 开发环境运行时的compiler
    require('./webpackCompiler').default(app);
}

app.use(compress({ threshold: 2048 }));

router.post('/upload', (ctx, next) => {
    console.log(ctx, 'ctx');
});

app.on('error', (err) => {
    console.error('server error', err);
});

app.listen(5555, () => {});
