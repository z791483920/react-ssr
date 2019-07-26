/* eslint-disable sort-imports */
/* eslint-disable no-undef */
import React from 'react';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import ReactDOM from 'react-dom';
import routeConfig from './router/routes';

function clientRender() {
    const Entry = () => (
        <BrowserRouter>{renderRoutes(routeConfig)}</BrowserRouter>
    );
    const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
    const render = (App) => {
        renderMethod(<App />, document.getElementById('root'));
    };

    render(Entry);
    if (module.hot) {
        module.hot.accept();
    }
}

function serverRender(locals) {
    const { ctx } = locals;
    return () => (
        <StaticRouter location={ctx.url} context={{}}>
            {renderRoutes(routeConfig)}
        </StaticRouter>
    );
}

export default __IS_NODE__ ? serverRender : clientRender();
