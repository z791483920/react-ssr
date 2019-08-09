import React from 'react';
import { renderToString } from 'react-dom/server';

const template = (html, css, js) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>react-ssr</title>
        <meta charset="UTF-8" />
        <meta http-equiv="pragma" content="no-cache" />
        <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
        <meta http-equiv="Expires" content="0" />
        <link rel="shortcut icon" href="/favicon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        ${css}
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
    ${js}
    </html>
    `;

const manifestJsLoader = manifest => Object.keys(manifest)
        .filter(item => item.endsWith('.js'))
        .map(item => `<script src="${manifest[item]}"></script>`)
        .join('\n');
const manifestCssLoader = manifest => Object.keys(manifest)
        .filter(item => item.endsWith('.css'))
        .map(item => `<link  rel="stylesheet" href="${manifest[item]}"/>`)
        .join('\n');

export default function (TargetComponent, manifest) {
    const js = manifestJsLoader(manifest);
    const css = manifestCssLoader(manifest);
    // 获取当前路由下面的组件
    const html = renderToString(<TargetComponent />);
    return template(html, css, js);
}
