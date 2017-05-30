import React from 'react';
import PropTypes from 'prop-types';

const Logout = ({handleClick}) => {
    return (
        <span className="logout" onClick={handleClick}>Logout</span>
    )
};

if(process.env.NODE_ENV !== 'production') {
    Logout.propTypes = {
        handleClick : PropTypes.func
    };
}

export default Logout;
