import React from 'react';
import { Switch, NavLink, Route, useRouteMatch } from 'react-router-dom';
import CreateProduct from './CreateProduct/CreateProduct';
import ListProducts from './ListProducts/ListProducts';

function Products() {
    const { path, url } = useRouteMatch();
    return (
        <div className="product_container pt-5">
            <ul className="list-group list-group-horizontal d-flex justify-content-center mb-4">
                <li className="list-group-item border-0 p-0 mr-3">
                    <NavLink className="btn btn-light" type="button" to={`${url}/createProduct`} activeClassName="category_selected">
                        Create Product
                    </NavLink>
                </li>
                <li className="list-group-item border-0 p-0">
                    <NavLink className="btn btn-light"  activeClassName="category_selected" type="button" to={`${url}/listProducts`}>
                        List Products
                    </NavLink>
                </li>
            </ul>
            <Switch>
                <Route exact path={path}>
                    <h3 className="text-center">Please select a action.</h3>
                </Route>
                <Route path={`${path}/createProduct`}>
                    <CreateProduct />
                </Route>
                <Route path={`${path}/listProducts`}>
                    <ListProducts />
                </Route>
            </Switch>
        </div>
    )
}

export default Products
