import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import path from 'path';
import MemoryFs from 'memory-fs';
import Router from 'koa-router';
import webpackClientConfig from '../webpack/client/webpackDevConfig';
import webpackServerConfig from '../webpack/server/webpackDevConfig';
import render from './render';
import getModuleFromString from './getModuleFromString';

export const clientCompiler = webpack(webpackClientConfig);
export const serverCompiler = webpack(webpackServerConfig);

const baseDir = process.cwd();
const mfs = new MemoryFs();

let bundle;
const router = new Router();

function clientCompile(app) {
    new webpack.ProgressPlugin().apply(clientCompiler);
    app.use(
        webpackDevMiddleware(clientCompiler, {
            lazy: false,
            quiet: true,
            noInfo: true,
            stats: { colors: true },
            publicPath: webpackClientConfig.output.publicPath,
            historyApiFallback: true
        })
    );
    app.use(webpackHotMiddleware(clientCompiler));
}

function serverCompile() {
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch(
        {
            aggregateTimeout: 300, // 防止重复按键
            poll: 1000, // 监测修改的时间(ms)
            ignored: /node_modules/
        },
        (err, stats) => {
            if (err) {
                return console.error(err);
            }

            if (stats.hasErrors()) {
                return;
            }
            // 编译到内存的路径
            const renderPath = path.join(webpackServerConfig.output.path, 'index.js');

            // 获取代码串 第一种方法
            // 读取内容并转成String类型
            // const content = mfs.readFileSync(renderPath, 'utf-8').toString();
            // 因为读取的是js文件，所以直接执行可以获取到输出的内容
            // new Function 找不到module 所以改用eval，由于在后端所以避免了风险
            // bundle = eval(content).default ? eval(content).default : eval(content);

            // 获取代码串 第二种方法
            const content = mfs.readFileSync(renderPath, 'utf-8');
            bundle = getModuleFromString(
                content,
                webpackServerConfig.output.filename
            );
        }
    );
}

function setResourceConfiguration(app) {
    app.use(async (ctx, next) => {
        const manifestPath = path.join(baseDir, 'server/views/manifest.json');
        ctx.__assets = JSON.parse(
            clientCompiler.outputFileSystem.readFileSync(manifestPath)
        );
        await next();
    });
}

export default async (app) => {
    await clientCompile(app);
    await serverCompile(app);
    await setResourceConfiguration(app);
    router.get('/*', async (ctx, next) => {
        await next();
        ctx.body = render(bundle({ ctx }), ctx.__assets);
    });
    app.use(router.routes());
};
