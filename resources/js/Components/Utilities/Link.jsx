import React from 'react';
import {Link as DomLink} from 'react-router-dom';

/**
 * @function Link
 * @param {string} to
 * @param {JSX.Element} children
 * @param {string} colour
 * @return {JSX.Element}
 * @constructor
 */
const Link = ({to, children, colour}) => {
    return (
        <DomLink to={to} className={`text-sm ${colour ?? 'text-teal-500'}`}>
            {children}
        </DomLink>
    );
};

export default Link;
