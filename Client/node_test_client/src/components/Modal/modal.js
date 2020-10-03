import React from 'react';
import './modal.css';

const Modal = (props) => {
return (
        <div className='modal_container'>
            <div className='modal_body p-4'>
                {props.children}
                <button className="modalclose_btn btn" onClick={props.close} title='Close'>x</button>
            </div>
        </div>
    )
}

export default Modal;