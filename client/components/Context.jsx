import React, { useContext } from 'react';
import defaultContext from './Test';

const ContextComponent = (props) => {
    const value = useContext(defaultContext);
    return (
        <div>
            <h1>{value}</h1>
        </div>
    );
};

export default ContextComponent;
