import React from 'react';
import './product.css';

function Product({singleproduct, openModal ,deleteProduct, categoryList, categoryName, currentCategoryID, indx}) {

    const elementsIndex = categoryList.findIndex(element => element._id == singleproduct.category )
    const name = categoryList[elementsIndex].name;
    const id = categoryList[elementsIndex]._id;

    return (
        <>
            <tr className="product">
                <td>{singleproduct._id}</td>
                <td>{singleproduct.name}</td>
                <td>{name}</td>
                <td>{id}</td>
                <td><button className="btn btn-dark" onClick={() => openModal(singleproduct._id, id, name)}>Edit</button></td>
                <td><button className="btn btn-dark" onClick={() => deleteProduct(singleproduct._id)}>Delete</button></td>
            </tr>
        </>
    )
}

export default Product
