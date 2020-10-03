import React , { useState } from 'react';
import MessageModal from '../../MessageModal/messageModal';
import Backdrop from '../../Backdrop/backdrop';
import Modal from '../../Modal/modal';
import './createcategory.css';
import API from '../../../axios';

const CreateCategory = () => {
    const [isModalOpen, setModalState] = useState(false);
    const [isMessageModalOpen, setMessageModalState] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [errorMessageModal, seterrorMessageModal] = useState(false);

    const messageModalUI = isMessageModalOpen ? <MessageModal modalText={messageModal} /> : null;

    const errorMessageUI = errorMessageModal ? <p className="alert alert-danger" role="alert">Category must be unique !</p> : null;

    const openModal = () => {
        setModalState(true);
        document.querySelector('body').classList.add('modal-open');
    }

    const modalCloseHandler = () => {
        setModalState(false);
        setCategoryName('');
        document.querySelector('body').classList.remove('modal-open');
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setCategoryName(value);
    }

    const handleFormSubmit = async e => {
        e.preventDefault();
        const newCategory = categoryName;
        try {
            const response = await API.post('/category', {name: newCategory});
            modalCloseHandler();
            setMessageModal('New Category successfully added');
            setMessageModalState(true);
            setTimeout(() => {
                setMessageModal('');
                setMessageModalState(false);
            }, 2000);
        } catch(e) {
            if(e.response.status == '400') {
                seterrorMessageModal(true);
                setTimeout(() => {
                    seterrorMessageModal(false);
                }, 2000);
            }
        }

    }

    return (
        <div className="create_category_container">
            {messageModalUI}

            {isModalOpen? (
                <div className="add_modal_container">
                    <Backdrop close={modalCloseHandler} />
                    <Modal close={modalCloseHandler} >
                        {errorMessageUI}
                        <form onSubmit={handleFormSubmit} autoComplete="off">
                            <div className="form-group d-flex mt-3">
                                <label htmlFor="inputCategory" className="col-sm-3 col-form-label">Category Name</label>
                                <input id="inputCategory" className="form-control" type="text" placeholder="Type here.." value={categoryName} onChange={handleChange} />
                            </div>   
                            <button className="btn btn-primary">Create</button>
                        </form>
                    </Modal>
                </div>
            ) : null}

            <div className="card">
                <img src={window.location.origin + '/images/download-icon.svg'} className="card-img-top" alt="img" />
                <div className="card-body">
                    <h2 className="card-title">Add and manage your categories</h2>
                    <p className="card-text">This is where you’ll add category and manage. </p>
                    <button className="btn btn-primary" onClick={openModal}>
                        create category
                    </button>
                </div>
            </div>

        </div>
    )
}

export default CreateCategory
