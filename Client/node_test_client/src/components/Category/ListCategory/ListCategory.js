import React, { useState, useEffect } from 'react';
import Backdrop from '../../Backdrop/backdrop';
import MessageModal from '../../MessageModal/messageModal';
import Modal from '../../Modal/modal';
import './listcategory.css';
import API from '../../../axios';

function ListCategory() {
    const [categoryList,setCategoryList] = useState([]);

    // getting categories from server
    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get('/category');
            // console.log(response);
            if(response.data.length === 0) {
                setMessageModalState(true);
                setMessageModal('Please create a category. No category found !!!');
                messageModalUI = <MessageModal modalText={messageModal} />
            }
            setCategoryList(response.data)
        }

        fetchData();
    },[]);

    // setting the state for modals
    const [isModalOpen, setModalState] = useState(false);
    const [isMessageModalOpen, setMessageModalState] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [currentCategoryID, setCurrentCategoryID] = useState('');

    let messageModalUI = isMessageModalOpen ? <MessageModal modalText={messageModal} /> : null;
    
    const openModal = (id,selectedCategory) => {
        setCurrentCategoryID(id);
        setCategoryName(selectedCategory);
        setModalState(true);
        document.querySelector('body').classList.add('modal-open');
    }

    const modalCloseHandler = () => {
        setModalState(false);
        setCurrentCategoryID('');
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
            const response = await API.patch(`/category/${currentCategoryID}`, {name: newCategory});
            const newCategoryList = categoryList.map(item => {
                if(item._id == currentCategoryID) {
                    item.name = newCategory;
                }
                return item;
            })
            setCategoryList(newCategoryList);
            modalCloseHandler();
            setMessageModal('Category updated successfully');
            setMessageModalState(true);
            setTimeout(() => {
                setMessageModal('');
                setMessageModalState(false);
            }, 2000);
        } catch(e) {
            console.log(e);
        }
    }

    const deleteCategory = async (id) => {
        try {
            await API.delete(`/category/${id}`);
            const newCategoryList = categoryList.filter(item => item._id != id );
            setCategoryList(newCategoryList);
            modalCloseHandler();
            setMessageModal('Category Deleted !!!');
            setMessageModalState(true);
            setTimeout(() => {
                setMessageModal('');
                setMessageModalState(false);
            }, 2000);
        } catch(e) {

        }
    }

    return (
        <>
        {isModalOpen ? (
                <div className="edit_category_modal_container">
                    <Backdrop close={modalCloseHandler} />
                    <Modal close={modalCloseHandler} >
                        <form onSubmit={handleFormSubmit} autoComplete="off">
                            <div className="form-group d-flex mt-3">
                                <label htmlFor="inputCategory" className="col-sm-3 col-form-label">Category Name</label>
                                <input id="inputCategory" className="form-control" type="text" placeholder="Type here.." value={categoryName} onChange={handleChange} />
                            </div>   
                            <button className="btn btn-primary">Update</button>
                        </form>
                    </Modal>
                </div>
            ) : null}
        <div className="list_container mx-4">
            {messageModalUI}
            {categoryList.map( categoryItem => (
                <p key={categoryItem._id} className="list_item d-flex justify-content-between align-items-center border-top border-bottom pt-2 pb-2 mb-0">
                    <span className="item_name">{categoryItem.name}</span>
                    <button onClick={() => openModal(`${categoryItem._id}`, `${categoryItem.name}`)} className="btn btn-dark">Edit</button>
                    <button className="btn btn-dark" onClick={() => deleteCategory(`${categoryItem._id}`)} >Delete</button>
                </p>
            ))}
            
        </div>
        </>
    )
}

export default ListCategory
