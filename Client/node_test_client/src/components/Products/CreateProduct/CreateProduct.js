import React , { useState, useEffect } from 'react';
import './CreateProduct.css';
import MessageModal from '../../MessageModal/messageModal';
import Backdrop from '../../Backdrop/backdrop';
import Modal from '../../Modal/modal';
import API from '../../../axios';

const CreateProduct = () => {
    const [isModalOpen, setModalState] = useState(false);
    const [isMessageModalOpen, setMessageModalState] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [productName, setProductName] = useState('');
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get('/category');
            console.log(response);
            setCategoryList(response.data);
        }

        fetchData();
    },[]);

    const initialFieldValues = {
        name : '',
        description : '',
        category : '',
        brand : '',
        countInStock : '',
        price : '',
        image: 'https://via.placeholder.com/150x200?text=Product+Image'
    }

    const messageModalUI = isMessageModalOpen ? <MessageModal modalText={messageModal} /> : null;

    const [values, setValues] = useState(initialFieldValues);

    const [imageobj, setImageObj] = useState({
        image: "https://via.placeholder.com/150x200?text=Product+Image",
        img_label: "Choose File",
        img_url: ""
    });
    
    let imageFormData = new FormData();

    const openModal = () => {
        setModalState(true);
        document.querySelector('body').classList.add('modal-open');
    }

    const modalCloseHandler = () => {
        setModalState(false);
        setProductName('');
        document.querySelector('body').classList.remove('modal-open');
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        console.log(name , value)

        setValues({
            ...values,
            [name]: value
        })
    }

    const handleBlurChange = e => {
        const {name, value} = e.target;

        if(!value) {
            e.target.classList.add('border','border-danger');
            e.target.focus();
        }
        else {
            e.target.classList.remove('border','border-danger');
        }
    }

    const handleFormSubmit = async e => {
        
        e.preventDefault();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        console.log('values.image',values)
        try{
            let formData = new FormData();
            const selectCategory = values.category ? values.category : categoryList[0].name;
            formData.append('name',values.name);
            formData.append('brand',values.brand);
            formData.append('image',values.image);
            formData.append('price',values.price);
            formData.append('category',selectCategory);
            formData.append('description',values.description);
            formData.append('countInStock',values.countInStock);
            await API.post('/products', formData, config);
            setValues(initialFieldValues);
            modalCloseHandler();
            setMessageModalState(true);
            setMessageModal('Product Added Succesfully 😃');
            setTimeout(() => {
                setMessageModalState(false);
                setMessageModal('');
            }, 2000);

        } catch(error) {
            console.log(`${error} Error occured`);
        }
    }

    const imageSubmitHandler = e => {
        e.preventDefault();
        console.log("imageobj.fileobj in if",imageobj.fileobj);
        if (imageobj.img_url) {
            setValues({
                ...values,
                image: imageobj.img_url
            })
        } else {
            setValues({
                ...values,
                image: imageobj.fileobj
            })
            console.log("imageobj.fileobj",imageobj.fileobj);
        }
    }

    const handleImageChange = e => {
        const { name, value} = e.target;
        const filename = e.target.files ? e.target.files[0].name : "Choose File";
        const file = e.target.files ? URL.createObjectURL(e.target.files[0]) : value;
        if(name == "img_url") {
            setImageObj({
                ...imageobj,
                "img_url": file,
                img_label: filename
            })

            document.querySelector('#preview_img').setAttribute('src', file);

        } else {
            setImageObj({
                ...imageobj,
                [name]: file,
                img_label: filename,
                fileobj: e.target.files[0]
            })

            imageFormData.append('image',e.target.files[0]);
            console.log("imageFormData else",imageFormData.get('image'));
                // debugger;
        }
    }

    return (
        <>
        {isModalOpen? (
                <div className="add_modal_container">
                    <Backdrop close={modalCloseHandler} />
                    <Modal close={modalCloseHandler} >
                            <div className="row">
                                <div className="col-md-7 border-right">
                                    <form onSubmit={handleFormSubmit} autoComplete="off">
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label" htmlFor="prod_name">Name</label>
                                                <div className="col-sm-10">
                                                    <input required type="text" value={values.name} onChange={handleInputChange} onBlur={handleBlurChange} name="name" className="form-control" placeholder="Product Name" id="prod_name"/>
                                                </div>                                        
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label" htmlFor="prod_brand">Brand</label>
                                                <div className="col-sm-10">
                                                    <input required type="text" value={values.brand} onChange={handleInputChange} onBlur={handleBlurChange} name="brand" className="form-control" placeholder="Product Brand" id="prod_brand"/>
                                                </div>                                        
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label" htmlFor="prod_price">Price</label>
                                                <div className="col-sm-10">
                                                    <input required type="text" value={values.price} onChange={handleInputChange} onBlur={handleBlurChange} name="price" className="form-control" placeholder="Product Price" id="prod_price"/>
                                                </div>                                        
                                            </div>
                                            <div className="form-group row">                                                
                                                <label htmlFor="prod_category" className="col-sm-2 col-form-label"> Category </label>
                                                <div className="col-sm-10">
                                                    <select value={categoryList[0].name} className="form-control" onBlur={handleBlurChange} onChange={handleInputChange} name="category" id="prod_category">
                                                        {categoryList.map(item => <option key={item._id} value={item.name}>{item.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label" htmlFor="prod_desc">Description</label>
                                                <div className="col-sm-10">
                                                    <textarea  className="form-control" value={values.description} onChange={handleInputChange} onBlur={handleBlurChange} name="description" placeholder="Product Detail" id="prod_desc" rows="5"></textarea>
                                                </div>                                        
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label" htmlFor="prod_CIS">Count</label>
                                                <div className="col-sm-10">
                                                    <input required type="text" className="form-control" value={values.countInStock} onChange={handleInputChange} onBlur={handleBlurChange} name="countInStock" placeholder="Product Count" id="prod_CIS"/>
                                                </div>                                        
                                            </div>
                                        <button className="btn btn-primary mx-auto btn-block">Add Product</button>
                                    </form>
                                </div>
                                <div className="col-md-5 justify-content-center prodimage_container text-center">
                                    <img id="preview_img" src={imageobj.image} alt="Product" />
                                    <form autoComplete="off" onSubmit={imageSubmitHandler}>
                                        <div className="custom-file">
                                            <input type="file" onChange={handleImageChange} name="image" className="custom-file-input" id="customFile" />
                                            <label className="custom-file-label" htmlFor="customFile">{imageobj.img_label}</label>
                                        </div>
                                        <h4>Or</h4>
                                        <div className="form-group img_url">
                                            <input type="text" onChange={handleImageChange} name="img_url" className="form-control" value={imageobj.img_url} placeholder="Image url" />
                                        </div>
                                        <button className="btn btn-primary update_img_btn ">Upload Image</button>
                                    </form>
                                </div>
                            </div>
                    </Modal>
                </div>
            ) : null}
        <div className="create_product_container text-center">
            {messageModalUI}

            <div className="card">
                <img src={window.location.origin + '/images/download-icon.svg'} className="card-img-top" alt="img" />
                <div className="card-body px-0">
                    <h2 className="card-title">Add and manage your products</h2>
                    <p className="card-text">This is where you’ll add products and manage. </p>
                    <button className="btn btn-primary" onClick={openModal}>
                        Create Product
                    </button>
                </div>
            </div>

        </div>
        </>
    )
}

export default CreateProduct
