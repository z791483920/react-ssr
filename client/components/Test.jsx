import React from 'react';

const defaultContext = React.createContext('default');
export const { Provider, Consumer } = defaultContext;
export default defaultContext;
