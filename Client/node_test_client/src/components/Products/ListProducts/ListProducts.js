import React, { useEffect, useState } from 'react'
import './listproducts.css';
import Product from '../Product/Product';
import ProductPagination from '../../Pagination/pagination';
import MessageModal from '../../MessageModal/messageModal';
import Modal from '../../Modal/modal';
import Backdrop from '../../Backdrop/backdrop';
import API from '../../../axios';

const ListProducts = () => {

    const [productsArr, setProductsArr] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2);
    const [isModalOpen, setModalState] = useState(false);
    const [isMessageModalOpen, setMessageModalState] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [currentCategoryID, setCurrentCategoryID] = useState('');
    const [prodID,setProdID] = useState('');
    const [modalContent, setModalContent] = useState([]);
    const initialFieldValues = {
        name : '',
        description : '',
        category : '',
        brand : '',
        countInStock : '',
        price : ''
    }

    const [values, setValues] = useState(initialFieldValues)
    const [imageobj, setImageObj] = useState({
        image: '',
        old_img: '',
        img_label: "Choose File",
        img_url: ""
    })
    let imageFormData = new FormData();

    let messageModalUI = isMessageModalOpen ? <MessageModal modalText={messageModal} /> : null;

    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get('/products');
            console.log(response);
            setProductsArr(response.data);
            const categoryResponse = await API.get('/category');
            console.log(categoryResponse);
            if(response.data.length === 0) {
                setMessageModalState(true);
                setMessageModal('No products to show !!!');
                messageModalUI = <MessageModal modalText={messageModal} />
            }
            setCategoryList(categoryResponse.data)
            setLoading(false);
        }
        fetchData();
    },[]);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = productsArr.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // functions
    const openModal = (id,selectedCategoryID, selectedCategory) => {
        setProdID(id);
        setCurrentCategoryID(selectedCategoryID);
        setCategoryName(selectedCategory);

        const elementsIndex = productsArr.findIndex(element => element._id == id )
        const imgName = productsArr[elementsIndex].image;
        // console.log(imgName)
        
        setImageObj({...imageobj,image: imgName, old_img: imgName});
        setValues(productsArr[elementsIndex]);
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
        const { name, value } = e.target;
        // console.log(name, value)
        if(name == 'category') {
            setCategoryName(value);
        }
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = async e => {
        e.preventDefault();
        // console.log(values)
        try {
            delete values.image;
            delete values.__v;
            delete values._id;
            let updatedData = values;
            updatedData.category = categoryName;
            // console.log(updatedData)
            // console.log(categoryName)

            const response = await API.patch(`/products/${prodID}`, updatedData);
            const elementsIndex = productsArr.findIndex(element => element._id == prodID );
            // console.log(elementsIndex)
            let newProdArr = [...productsArr];
            newProdArr[elementsIndex] = {...response.data}

            setProductsArr(newProdArr);
            setImageObj({...imageobj, img_url:''});
            modalCloseHandler();
            setMessageModalState(true);
            setMessageModal('Details Succesfully Updated');
            setTimeout(() => {
                setMessageModalState(false);
                setMessageModal('');
            }, 1000);
        } catch(err) {
            console.log(err);
        }

    }

    
    const imageUpdate = async (prodId,imgObj,isURL) => {   
        // console.log("imgObj at start",imgObj);
        // console.log(typeof(imgObj.image));
        let config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        if(imgObj.old_img) {
            try {
                let response;
                if(isURL) {
                    // console.log("imgObj at start is url in old_img",imgObj);

                    response = await API.patch(`/products/updateproductimage/${prodId}`, imgObj, config)
                } else {
                    let formData = new FormData();
                    formData.append('image',imgObj.image);
                    formData.append('old_img',imgObj.old_img);
                    // console.log(formData.get('image'));
                    // debugger;
                    response = await API.patch(`/products/updateproductimage/${prodId}`, formData, config)
                }
                // console.log(`updated product`);
                // console.log(response.data);
                const elementsIndex = productsArr.findIndex(element => element._id == response.data._id )
                let newProdArr = [...productsArr];
                newProdArr[elementsIndex] = {...newProdArr[elementsIndex], image: response.data.image};
                
                modalCloseHandler();
                setMessageModalState(true);
                setMessageModal('Details Succesfully Updated');
                setProductsArr(newProdArr);            
                setTimeout(() => {
                    setMessageModalState(false);
                    setMessageModal('');
                }, 2000);
    
            } catch(error) {
                console.log(`${error} Error occured`);
            }
        }
        else {
            try {
                let response;
                if(isURL) {
                    response = await API.patch(`/products/updateproductimage/${prodId}`, imgObj, config)
                } else {
                    let formData = new FormData();
                    formData.append('image',imgObj.image);
                    console.log(formData.get('image'));
                    response = await API.patch(`/products/updateproductimage/${prodId}`, formData, config)
                }
                console.log(`updated product`);
                console.log(response.data);
                const elementsIndex = productsArr.findIndex(element => element._id == response.data._id )
                let newProdArr = [...productsArr];
                newProdArr[elementsIndex] = {...newProdArr[elementsIndex], image: response.data.image};
                modalCloseHandler();
                setMessageModalState(true);
                setMessageModal('Details Succesfully Updated');
                setProductsArr(newProdArr);            
                setTimeout(() => {
                    setMessageModalState(false);
                    setMessageModal('');
                }, 2000);
    
            } catch(error) {
                console.log(`${error} Error occured`);
            }
        }        
    }


    const handleImageChange = e => {
        const { name, value} = e.target;
        const filename = e.target.files ? e.target.files[0].name : "Choose File";
        const file = e.target.files ? URL.createObjectURL(e.target.files[0]) : value;
        console.log(name)
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

    const imageSubmitHandler = e => {
        e.preventDefault();
        
        const id = prodID;
        console.log(id)
        if (imageobj.img_url) {
            const old_img_path = imageobj.old_img;
            const isURL = true;
            console.log("old_img_path",old_img_path);
            const is_old_img = old_img_path.indexOf('/static/');
            console.log("is_old_img",is_old_img);
            if(is_old_img > 0) {
                const pos = old_img_path.lastIndexOf("/");
                const res = "/public" + old_img_path.slice(pos);
                const data = {
                    image: imageobj.img_url,
                    old_img: res
                }
                imageUpdate(id, data,isURL)
            } else {
                const data = {
                    image: imageobj.img_url
                }
                imageUpdate(id, data,isURL)
            }
        } else {
            const old_img_path = imageobj.old_img;
            // console.log("old_img_path",old_img_path);
            const is_old_img = old_img_path.indexOf('/static/');
            // console.log("is_old_img in else", is_old_img);
            if(is_old_img > 0) {
                const pos = old_img_path.lastIndexOf("/");
                const res = "/public" + old_img_path.slice(pos);
                const data = {
                    image: imageobj.image,
                    old_img: res
                }
                // console.log(res)
                imageFormData.append('old_img',res);
                // console.log("imageobj.fileobj",imageobj.fileobj);
                // console.log("imageFormData else",imageFormData.get('image'));

                imageUpdate(id, data,undefined)
            } else {
                const data = {
                    image: imageobj.fileobj
                }
                // console.log("imageobj.fileobj",imageobj.fileobj);
                
                imageUpdate(id, data,undefined)
            }
        }
    }

    const deleteProduct = async (id) => {
        try {
            await API.delete(`/products/${id}`);
            const newproductsArr = productsArr.filter(item => item._id != id );
            setProductsArr(newproductsArr);
            modalCloseHandler();
            setMessageModal('Product Deleted !!!');
            setMessageModalState(true);
            setTimeout(() => {
                setMessageModal('');
                setMessageModalState(false);
            }, 2000);
        } catch(e) {
            console.log(e);
        }
    }
    
    if (loading) {
        return <h2 className="text-center">Loading...</h2>;
    }
    return(
        <>
        {isModalOpen ? (
            <div className="edit_modal_container">   
            <Backdrop close={modalCloseHandler} />
            
            <Modal close={modalCloseHandler}>
                <div className="row">
                    <div className="col-md-7 border-right">
                        <form onSubmit={handleFormSubmit} autoComplete="off">
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="prod_name">Name</label>
                                    <div className="col-sm-10">
                                        <input required type="text" value={values.name} onChange={handleChange}  name="name" className="form-control" placeholder="Product Name" id="prod_name"/>
                                    </div>                                        
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="prod_brand">Brand</label>
                                    <div className="col-sm-10">
                                        <input required type="text" value={values.brand} onChange={handleChange}  name="brand" className="form-control" placeholder="Product Brand" id="prod_brand"/>
                                    </div>                                        
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="prod_price">Price</label>
                                    <div className="col-sm-10">
                                        <input required type="text" value={values.price} onChange={handleChange}  name="price" className="form-control" placeholder="Product Price" id="prod_price"/>
                                    </div>                                        
                                </div>
                                <div className="form-group row">
                                        <label htmlFor="prod_category" className="col-sm-2 col-form-label"> Category </label>
                                        <div className="col-sm-10">
                                            <select defaultValue={categoryName} className="form-control" onChange={handleChange} name="category" id="prod_category">
                                                {categoryList.map(item => <option key={item._id} value={item.name} >{item.name}</option>)}
                                            </select>
                                        </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="prod_desc">Description</label>
                                    <div className="col-sm-10">
                                        <textarea  className="form-control" value={values.description} onChange={handleChange}  name="description" placeholder="Product Detail" id="prod_desc" rows="5"></textarea>
                                    </div>                                        
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="prod_CIS">Count</label>
                                    <div className="col-sm-10">
                                        <input required type="text" className="form-control" value={values.countInStock} onChange={handleChange}  name="countInStock" placeholder="Product Count" id="prod_CIS"/>
                                    </div>                                        
                                </div>
                            <button className="btn btn-primary mx-auto btn-block">Update Details</button>
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
                            <button className="btn btn-primary update_img_btn ">Update Image</button>
                        </form>
                    </div>
                </div>
            </Modal>
                
            
        </div>
        ): null}
        <div className="position-relative">
        <div className="admin_product_container text-center" style={{marginBottom: '20px'}}>
            {messageModalUI}

            {categoryList.length > 0 ? <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Category Name</th>
                        <th>Category ID</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((item,indx) => <Product categoryName={categoryName} currentCategoryID={currentCategoryID} indx={indx} categoryList={categoryList} singleproduct={item} key={item._id} openModal={openModal} deleteProduct={deleteProduct} />)}
                </tbody>
            </table> : null}
        </div>
        {categoryList.length > 0 ? <ProductPagination 
            postsPerPage={postsPerPage}
            totalPosts={productsArr.length}
            paginate={paginate}
            currentPage={currentPage}
        />: null}
        </div>
        </>
    )
}

export default ListProducts
