import React from 'react';
import './backdrop.css';

const Backdrop = ({close}) => {
    return (<div className="modal_backdrop"  onClick={close}></div>)
}

export default Backdrop;