import React from 'react'
import { Switch, NavLink, Route, useRouteMatch } from 'react-router-dom';
import CreateCategory from './CreateCategory/CreateCategory';
import './category.css';
import ListCategory from './ListCategory/ListCategory';

function Category() {
    const { path, url } = useRouteMatch();
    return (
        <div className="category_container text-center pt-5">
            
            <ul className="list-group list-group-horizontal d-flex justify-content-center mb-4">
                <li className="list-group-item border-0 p-0 mr-3">
                    <NavLink className="btn btn-light" type="button" to={`${url}/createCategory`} activeClassName="category_selected">
                        Create Category
                    </NavLink>
                </li>
                <li className="list-group-item border-0 p-0">
                    <NavLink className="btn btn-light"  activeClassName="category_selected" type="button" to={`${url}/listCategory`}>
                        List Categories
                    </NavLink>
                </li>
            </ul>
            <Switch>
                <Route exact path={path}>
                    <h3 className="text-center">Please select a action.</h3>
                </Route>
                <Route path={`${path}/createCategory`}>
                    <CreateCategory />
                </Route>
                <Route path={`${path}/listCategory`}>
                    <ListCategory />
                </Route>
            </Switch>
        </div>
    )
}

export default Category
