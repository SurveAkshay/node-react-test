import React from 'react';

const MessageModal = ({modalText}) => {
    return(
        <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{modalText}!</strong>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export default MessageModal;